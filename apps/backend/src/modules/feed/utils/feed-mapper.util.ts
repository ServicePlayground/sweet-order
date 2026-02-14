import { FeedResponseDto } from "@apps/backend/modules/feed/dto/feed-detail.dto";

/**
 * 피드 매핑 유틸리티
 * Prisma StoreFeed 엔티티를 응답 DTO로 변환하는 공통 로직을 제공합니다.
 */
export class FeedMapperUtil {
  /**
   * Prisma StoreFeed 엔티티를 FeedResponseDto로 변환
   * @param feed - Prisma StoreFeed 엔티티 (store 포함)
   * @returns FeedResponseDto 객체
   */
  static mapToFeedResponse(feed: {
    id: string;
    storeId: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    store: {
      logoImageUrl?: string | null;
    };
  }): FeedResponseDto {
    return {
      id: feed.id,
      storeId: feed.storeId,
      title: feed.title,
      content: feed.content,
      storeLogoImageUrl: feed.store.logoImageUrl ?? "",
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
    };
  }
}
