import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";
import { FeedMapperUtil } from "@apps/backend/modules/feed/utils/feed-mapper.util";

@Injectable()
export class FeedDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 상세 조회 (사용자용)
   */
  async getFeedById(feedId: string) {
    const feed = await this.prisma.storeFeed.findFirst({
      where: {
        id: feedId,
      },
      include: {
        store: {
          select: {
            logoImageUrl: true,
          },
        },
      },
    });

    if (!feed) {
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    return FeedMapperUtil.mapToFeedResponse(feed);
  }

  /**
   * 피드 상세 조회 (판매자용)
   */
  async getFeedByIdForSeller(feedId: string, user: JwtVerifiedPayload) {
    const feed = await this.prisma.storeFeed.findFirst({
      where: {
        id: feedId,
      },
      include: {
        store: {
          select: {
            userId: true,
            logoImageUrl: true,
          },
        },
      },
    });

    if (!feed || !feed.store) {
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    if (feed.store.userId !== user.sub) {
      throw new UnauthorizedException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    return FeedMapperUtil.mapToFeedResponse(feed);
  }
}
