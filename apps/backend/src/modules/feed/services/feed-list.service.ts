import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { GetFeedsRequestDto } from "@apps/backend/modules/feed/dto/feed-request.dto";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { FeedMapperUtil } from "@apps/backend/modules/feed/utils/feed-mapper.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";

@Injectable()
export class FeedListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 목록 조회 (사용자용)
   */
  async getFeedsByStoreId(storeId: string, query: GetFeedsRequestDto) {
    const { page, limit } = query;

    const totalItems = await this.prisma.storeFeed.count({
      where: {
        storeId,
      },
    });

    const skip = (page - 1) * limit;

    const feeds = await this.prisma.storeFeed.findMany({
      where: {
        storeId,
      },
      include: {
        store: {
          select: {
            logoImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: feeds.map((feed) => FeedMapperUtil.mapToFeedResponse(feed)),
      meta,
    };
  }

  /**
   * 피드 목록 조회 (판매자용)
   */
  async getFeedsByStoreIdForSeller(
    storeId: string,
    user: JwtVerifiedPayload,
    query: GetFeedsRequestDto,
  ) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!store) {
      throw new NotFoundException("스토어를 찾을 수 없습니다.");
    }

    if (store.userId !== user.sub) {
      throw new UnauthorizedException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    const { page, limit } = query;

    const totalItems = await this.prisma.storeFeed.count({
      where: {
        storeId,
      },
    });

    const skip = (page - 1) * limit;

    const feeds = await this.prisma.storeFeed.findMany({
      where: {
        storeId,
      },
      include: {
        store: {
          select: {
            logoImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: feeds.map((feed) => FeedMapperUtil.mapToFeedResponse(feed)),
      meta,
    };
  }
}
