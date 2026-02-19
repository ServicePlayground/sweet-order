import { Injectable, BadRequestException } from "@nestjs/common";
import {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@apps/backend/modules/business/dto/business-request.dto";
import { NtsApiService } from "@apps/backend/modules/business/services/nts-api.service";
import { KftcApiService } from "@apps/backend/modules/business/services/kftc-api.service";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { BUSINESS_ERROR_MESSAGES } from "@apps/backend/modules/business/constants/business.contants";

/**
 * 사업 서비스
 *
 * 모든 사업 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * NtsApiService와 KftcApiService를 조합하여 사용합니다.
 */
@Injectable()
export class BusinessService {
  constructor(
    private readonly ntsApiService: NtsApiService,
    private readonly kftcApiService: KftcApiService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 사업자등록번호 진위확인
   */
  async verifyBusinessRegistration(validationDto: BusinessValidationRequestDto) {
    // 사업자등록번호 정규화 (하이픈 제거)
    const normalizedBusinessNo = validationDto.b_no.replace(/[-\s]/g, "");

    // 이미 등록된 사업자등록번호인지 확인
    const existingStore = await this.prisma.store.findFirst({
      where: {
        businessNo: normalizedBusinessNo,
      },
    });

    if (existingStore) {
      throw new BadRequestException(
        BUSINESS_ERROR_MESSAGES.BUSINESS_REGISTRATION_NUMBER_ALREADY_EXISTS,
      );
    }

    await this.ntsApiService.verifyBusinessRegistration(validationDto);
  }

  /**
   * 통신판매사업자 등록상세 조회
   */
  async getOnlineTradingCompanyDetail(detailDto: OnlineTradingCompanyDetailRequestDto) {
    // 이미 등록된 통신판매업번호인지 확인
    const existingStore = await this.prisma.store.findFirst({
      where: {
        permissionManagementNumber: detailDto.prmmiMnno,
      },
    });

    if (existingStore) {
      throw new BadRequestException(
        BUSINESS_ERROR_MESSAGES.PERMISSION_MANAGEMENT_NUMBER_ALREADY_EXISTS,
      );
    }

    await this.kftcApiService.getOnlineTradingCompanyDetail(detailDto);
  }
}
