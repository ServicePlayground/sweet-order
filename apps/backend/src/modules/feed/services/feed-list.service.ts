import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { FeedMapperUtil } from "@apps/backend/modules/feed/utils/feed-mapper.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FeedOwnershipUtil } from "@apps/backend/modules/feed/utils/feed-ownership.util";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 피드 목록 조회 서비스
 * 피드 목록 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class FeedListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 목록 조회 (사용자용)
   */
  async getFeedsByStoreIdForUser(storeId: string, query: PaginationRequestDto) {
    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        id: true,
      },
    });

    if (!store) {
      LoggerUtil.log(`피드 목록 조회 실패: 스토어 없음 - storeId: ${storeId}`);
      throw new NotFoundException(FEED_ERROR_MESSAGES.STORE_NOT_FOUND);
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
          select: FeedMapperUtil.STORE_LOGO_IMAGE_URL_SELECT,
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
    query: PaginationRequestDto,
  ) {
    // 스토어 소유권 확인
    await FeedOwnershipUtil.verifyStoreOwnership(this.prisma, storeId, user.sub);

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
          select: FeedMapperUtil.STORE_LOGO_IMAGE_URL_SELECT,
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
