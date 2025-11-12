import { Injectable, BadRequestException } from "@nestjs/common";
import { BusinessService } from "@apps/backend/modules/business/business.service";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CreateStoreRequestDto } from "@apps/backend/modules/store/dto/store.request.dto";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 스토어 생성 서비스
 *
 * 3단계 스토어 생성 로직을 담당하는 서비스입니다.
 * 1단계, 2단계 API를 재검증하고 스토어를 생성합니다.
 */
@Injectable()
export class StoreCreationService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 스토어 생성 (3단계)
   * 1단계, 2단계 API를 다시 호출하여 검증하고 스토어를 생성합니다.
   */
  async createStore(userId: string, createStoreDto: CreateStoreRequestDto) {
    // 1) 1단계와 2단계의 사업자등록번호가 일치하는지 검증
    // 하이픈 제거 후 비교
    const businessNo1 = createStoreDto.businessValidation.b_no.replace(/[-\s]/g, "");
    const businessNo2 = createStoreDto.onlineTradingCompanyDetail.brno.replace(/[-\s]/g, "");
    if (businessNo1 !== businessNo2) {
      throw new BadRequestException(STORE_ERROR_MESSAGES.BUSINESS_REGISTRATION_NUMBER_MISMATCH);
    }

    // 2) 같은 사업자등록번호와 인허가관리번호 조합으로 이미 스토어가 존재하는지 확인
    // 한 사용자는 여러 스토어를 생성할 수 있지만, 같은 사업자 정보로는 중복 생성 불가
    // 사업자등록번호 정규화 (하이픈 제거) 후 비교
    // DB에 저장된 값도 정규화되어 있으므로 정규화된 값으로 비교
    const normalizedBusinessNo = businessNo1;
    const existingStore = await this.prisma.store.findFirst({
      where: {
        userId,
        businessNo: normalizedBusinessNo,
        permissionManagementNumber: createStoreDto.onlineTradingCompanyDetail.prmmiMnno,
      },
    });
    if (existingStore) {
      throw new BadRequestException(
        STORE_ERROR_MESSAGES.STORE_ALREADY_EXISTS_WITH_SAME_BUSINESS_INFO,
      );
    }

    // 3) 1단계: 사업자등록번호 진위확인 (재검증)
    // 응답 값은 저장하지 않음 - 필요시 외부 API 호출로 최신 상태 조회
    await this.businessService.verifyBusinessRegistration(createStoreDto.businessValidation);

    // 4) 2단계: 통신판매사업자 등록상세 조회 (재검증)
    // 응답 값은 저장하지 않음 - 필요시 외부 API 호출로 최신 상태 조회
    await this.businessService.getOnlineTradingCompanyDetail(
      createStoreDto.onlineTradingCompanyDetail,
    );

    // DB에 스토어 저장 및 사용자 role 업데이트 - 트랜잭션으로 원자성 보장
    // 사업자등록번호는 정규화(하이픈 제거)하여 저장하여 일관성 유지
    return await this.prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: {
          userId,
          // 스토어 정보
          logoImageUrl: createStoreDto.logoImageUrl,
          name: createStoreDto.name,
          description: createStoreDto.description,
          // 사업자 정보 (1단계 - 사용자 입력값만 저장, 사업자등록번호는 정규화하여 저장)
          businessNo: normalizedBusinessNo,
          representativeName: createStoreDto.businessValidation.p_nm,
          openingDate: createStoreDto.businessValidation.start_dt,
          businessName: createStoreDto.businessValidation.b_nm,
          businessSector: createStoreDto.businessValidation.b_sector,
          businessType: createStoreDto.businessValidation.b_type,
          // 통신판매사업자 정보 (2단계 - 사용자 입력값만 저장)
          permissionManagementNumber: createStoreDto.onlineTradingCompanyDetail.prmmiMnno,
          // 응답 값(businessStatus, taxType, onlineTradingCompanyDetail 등)은 저장하지 않음
          // 필요시 외부 API를 호출하여 최신 상태 조회
        },
      });

      // 스토어 생성 완료 후 사용자 role을 seller로 변경 (이미 seller인 경우 유지)
      await tx.user.update({
        where: { id: userId },
        data: {
          role: "SELLER",
        },
      });

      return {
        id: store.id,
      };
    });
  }
}
