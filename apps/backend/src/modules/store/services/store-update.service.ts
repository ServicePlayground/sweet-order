import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { UpdateStoreRequestDto } from "@apps/backend/modules/store/dto/store.request.dto";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 스토어 수정 서비스
 *
 * 스토어 수정 로직을 담당하는 서비스입니다.
 */
@Injectable()
export class StoreUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 스토어 수정 (판매자용)
   * @param storeId 스토어 ID
   * @param updateStoreDto 수정할 스토어 정보
   * @param user 인증된 사용자 정보
   * @returns 수정된 스토어 ID
   */
  async updateStore(
    storeId: string,
    updateStoreDto: UpdateStoreRequestDto,
    user: JwtVerifiedPayload,
  ) {
    // 스토어 존재 여부 및 소유권 확인
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    // 스토어가 존재하지 않으면 404 에러
    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (store.userId !== user.sub) {
      throw new UnauthorizedException(STORE_ERROR_MESSAGES.FORBIDDEN);
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};

    // 필수 필드: 그대로 업데이트
    updateData.logoImageUrl = updateStoreDto.logoImageUrl;
    updateData.description = updateStoreDto.description;
    updateData.name = updateStoreDto.name;
    updateData.address = updateStoreDto.address;
    updateData.roadAddress = updateStoreDto.roadAddress;
    updateData.zonecode = updateStoreDto.zonecode;
    updateData.latitude = updateStoreDto.latitude;
    updateData.longitude = updateStoreDto.longitude;

    // 스토어 수정
    const updatedStore = await this.prisma.store.update({
      where: {
        id: storeId,
      },
      data: updateData,
    });

    return {
      id: updatedStore.id,
    };
  }
}
