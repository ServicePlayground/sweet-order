import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";
import { FeedMapperUtil } from "@apps/backend/modules/feed/utils/feed-mapper.util";
import { FeedOwnershipUtil } from "@apps/backend/modules/feed/utils/feed-ownership.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 피드 상세 조회 서비스
 * 피드 상세 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class FeedDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 상세 조회 (사용자용)
   */
  async getFeedByIdForUser(feedId: string, storeId?: string) {
    const feed = await this.prisma.storeFeed.findUnique({
      where: {
        id: feedId,
      },
      include: {
        store: {
          select: FeedMapperUtil.STORE_LOGO_IMAGE_URL_SELECT,
        },
      },
    });

    // storeId 조건 확인 (제공된 경우)
    if (storeId && feed && feed.storeId !== storeId) {
      LoggerUtil.log(
        `피드 상세 조회 실패: 스토어 ID 불일치 - feedId: ${feedId}, storeId: ${storeId}, feedStoreId: ${feed.storeId}`,
      );
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    if (!feed) {
      LoggerUtil.log(
        `피드 상세 조회 실패: 피드 없음 - feedId: ${feedId}, storeId: ${storeId || "없음"}`,
      );
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    return FeedMapperUtil.mapToFeedResponse(feed);
  }

  /**
   * 피드 상세 조회 (판매자용)
   */
  async getFeedByIdForSeller(feedId: string, user: JwtVerifiedPayload, storeId: string) {
    const feed = await FeedOwnershipUtil.verifyFeedOwnership(
      this.prisma,
      feedId,
      user.sub,
      {
        userId: true,
        logoImageUrl: true,
      },
      storeId,
    );

    return FeedMapperUtil.mapToFeedResponse(feed);
  }
}
