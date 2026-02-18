import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { UpdateStoreRequestDto } from "@apps/backend/modules/store/dto/store-update.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { StoreOwnershipUtil } from "@apps/backend/modules/store/utils/store-ownership.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

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
  async updateStoreForSeller(
    storeId: string,
    updateStoreDto: UpdateStoreRequestDto,
    user: JwtVerifiedPayload,
  ) {
    // 스토어 소유권 확인
    await StoreOwnershipUtil.verifyStoreOwnership(this.prisma, storeId, user.sub);

    // 업데이트할 데이터 준비
    const updateData: {
      logoImageUrl?: string;
      description?: string;
      name: string;
      address: string;
      roadAddress: string;
      detailAddress: string;
      zonecode: string;
      latitude: number;
      longitude: number;
    } = {
      // 필수 필드
      name: updateStoreDto.name,
      address: updateStoreDto.address,
      roadAddress: updateStoreDto.roadAddress,
      detailAddress: updateStoreDto.detailAddress,
      zonecode: updateStoreDto.zonecode,
      latitude: updateStoreDto.latitude,
      longitude: updateStoreDto.longitude,
    };

    // 선택적 필드: 값이 제공된 경우에만 업데이트
    if (updateStoreDto.logoImageUrl !== undefined) {
      updateData.logoImageUrl = updateStoreDto.logoImageUrl;
    }
    if (updateStoreDto.description !== undefined) {
      updateData.description = updateStoreDto.description;
    }

    try {
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
    } catch (error: unknown) {
      LoggerUtil.log(
        `스토어 수정 실패: 트랜잭션 에러 - userId: ${user.sub}, storeId: ${storeId}, error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
