import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";
import { StoreFeed } from "@apps/backend/infra/database/prisma/generated/client";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 피드 소유권 확인 유틸리티
 */
export class FeedOwnershipUtil {
  /**
   * 피드를 조회하고 스토어 소유권을 확인합니다.
   * @param prisma PrismaService 인스턴스
   * @param feedId 피드 ID
   * @param userId 사용자 ID (스토어 소유자)
   * @param includeStoreSelect 스토어 조회 시 포함할 필드
   * @returns 피드 정보 (스토어 정보 포함)
   * @throws NotFoundException 피드를 찾을 수 없을 경우
   * @throws ForbiddenException 스토어 소유권이 없을 경우
   */
  static async verifyFeedOwnership(
    prisma: PrismaService,
    feedId: string,
    userId: string,
    includeStoreSelect?: { userId: boolean; logoImageUrl?: boolean },
    expectedStoreId?: string,
  ): Promise<
    StoreFeed & {
      store: { userId: string; logoImageUrl?: string | null };
    }
  > {
    const feed = await prisma.storeFeed.findFirst({
      where: {
        id: feedId,
        ...(expectedStoreId && { storeId: expectedStoreId }),
      },
      include: {
        store: {
          select: {
            userId: true,
            ...(includeStoreSelect?.logoImageUrl && { logoImageUrl: true }),
          },
        },
      },
    });

    if (!feed || !feed.store) {
      LoggerUtil.log(`피드 소유권 확인 실패: 피드 없음 - feedId: ${feedId}, userId: ${userId}`);
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    if (feed.store.userId !== userId) {
      LoggerUtil.log(
        `피드 소유권 확인 실패: 소유권 없음 - feedId: ${feedId}, userId: ${userId}, storeUserId: ${feed.store.userId}`,
      );
      throw new ForbiddenException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    return feed as StoreFeed & {
      store: { userId: string; logoImageUrl?: string | null };
    };
  }

  /**
   * 스토어 소유권을 확인합니다.
   * @param prisma PrismaService 인스턴스
   * @param storeId 스토어 ID
   * @param userId 사용자 ID (스토어 소유자)
   * @param errorMessage 커스텀 에러 메시지 (옵셔널)
   * @throws NotFoundException 스토어를 찾을 수 없을 경우
   * @throws ForbiddenException 스토어 소유권이 없을 경우
   */
  static async verifyStoreOwnership(
    prisma: PrismaService,
    storeId: string,
    userId: string,
    errorMessage?: string,
  ): Promise<void> {
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!store) {
      LoggerUtil.log(
        `스토어 소유권 확인 실패: 스토어 없음 - storeId: ${storeId}, userId: ${userId}`,
      );
      throw new NotFoundException(errorMessage || FEED_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    if (store.userId !== userId) {
      LoggerUtil.log(
        `스토어 소유권 확인 실패: 소유권 없음 - storeId: ${storeId}, userId: ${userId}, storeUserId: ${store.userId}`,
      );
      throw new ForbiddenException(errorMessage || FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }
  }
}
