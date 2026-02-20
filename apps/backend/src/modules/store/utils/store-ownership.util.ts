import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { Store, Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 스토어 소유권 확인 유틸리티
 */
export class StoreOwnershipUtil {
  /**
   * 스토어를 조회하고 소유권을 확인합니다.
   * @param prisma PrismaService 인스턴스
   * @param storeId 스토어 ID
   * @param userId 사용자 ID (스토어 소유자)
   * @param includeSelect 스토어 조회 시 포함할 필드
   * @returns 스토어 정보
   * @throws NotFoundException 스토어를 찾을 수 없을 경우
   * @throws UnauthorizedException 스토어 소유권이 없을 경우
   */
  static async verifyStoreOwnership(
    prisma: PrismaService,
    storeId: string,
    userId: string,
    includeSelect?: Prisma.StoreSelect,
  ): Promise<Store & { userId: string }> {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        userId: true,
        ...(includeSelect || {}),
      },
    });

    if (!store) {
      LoggerUtil.log(
        `스토어 소유권 확인 실패: 스토어 없음 - storeId: ${storeId}, userId: ${userId}`,
      );
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    if (store.userId !== userId) {
      LoggerUtil.log(
        `스토어 소유권 확인 실패: 소유권 없음 - storeId: ${storeId}, userId: ${userId}, storeUserId: ${store.userId}`,
      );
      throw new ForbiddenException(STORE_ERROR_MESSAGES.FORBIDDEN);
    }

    return store as Store & { userId: string };
  }
}
