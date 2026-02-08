import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  CreateFeedRequestDto,
  UpdateFeedRequestDto,
  GetFeedsRequestDto,
} from "@apps/backend/modules/feed/dto/feed-request.dto";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FeedMapperUtil } from "@apps/backend/modules/feed/utils/feed-mapper.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";

/**
 * 피드 서비스
 */
@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 생성 (판매자용)
   */
  async createFeed(userId: string, createFeedDto: CreateFeedRequestDto) {
    // 스토어 존재 여부 및 소유권 확인
    const store = await this.prisma.store.findFirst({
      where: {
        id: createFeedDto.storeId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!store) {
      throw new NotFoundException("스토어를 찾을 수 없습니다.");
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (store.userId !== userId) {
      throw new UnauthorizedException("스토어를 수정할 권한이 없습니다.");
    }

    // 피드 생성
    const feed = await this.prisma.storeFeed.create({
      data: {
        storeId: createFeedDto.storeId,
        title: createFeedDto.title,
        content: createFeedDto.content,
      },
    });

    return {
      id: feed.id,
    };
  }

  /**
   * 피드 수정 (판매자용)
   */
  async updateFeed(feedId: string, updateFeedDto: UpdateFeedRequestDto, user: JwtVerifiedPayload) {
    // 피드 존재 여부 및 소유권 확인
    const feed = await this.prisma.storeFeed.findFirst({
      where: {
        id: feedId,
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!feed || !feed.store) {
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (feed.store.userId !== user.sub) {
      throw new UnauthorizedException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    // 피드 수정
    const updatedFeed = await this.prisma.storeFeed.update({
      where: {
        id: feedId,
      },
      data: {
        title: updateFeedDto.title,
        content: updateFeedDto.content,
      },
    });

    return {
      id: updatedFeed.id,
    };
  }

  /**
   * 피드 삭제 (판매자용)
   */
  async deleteFeed(feedId: string, user: JwtVerifiedPayload) {
    // 피드 존재 여부 및 소유권 확인
    const feed = await this.prisma.storeFeed.findFirst({
      where: {
        id: feedId,
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!feed || !feed.store) {
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (feed.store.userId !== user.sub) {
      throw new UnauthorizedException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    // 피드 삭제
    await this.prisma.storeFeed.delete({
      where: {
        id: feedId,
      },
    });
  }

  /**
   * 피드 목록 조회 (사용자용)
   */
  async getFeedsByStoreId(storeId: string, query: GetFeedsRequestDto) {
    const { page, limit } = query;

    // 전체 개수 조회
    const totalItems = await this.prisma.storeFeed.count({
      where: {
        storeId,
      },
    });

    // 페이지네이션 계산
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

    // 페이지네이션 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: feeds.map((feed) => FeedMapperUtil.mapToFeedResponse(feed)),
      meta,
    };
  }

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
   * 피드 목록 조회 (판매자용)
   */
  async getFeedsByStoreIdForSeller(
    storeId: string,
    user: JwtVerifiedPayload,
    query: GetFeedsRequestDto,
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

    if (!store) {
      throw new NotFoundException("스토어를 찾을 수 없습니다.");
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (store.userId !== user.sub) {
      throw new UnauthorizedException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    const { page, limit } = query;

    // 전체 개수 조회
    const totalItems = await this.prisma.storeFeed.count({
      where: {
        storeId,
      },
    });

    // 페이지네이션 계산
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

    // 페이지네이션 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: feeds.map((feed) => FeedMapperUtil.mapToFeedResponse(feed)),
      meta,
    };
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

    // 권한 확인: 스토어 소유자인지 확인
    if (feed.store.userId !== user.sub) {
      throw new UnauthorizedException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    return FeedMapperUtil.mapToFeedResponse(feed);
  }
}
