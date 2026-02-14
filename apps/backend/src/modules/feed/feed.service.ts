import { Injectable } from "@nestjs/common";
import { CreateFeedRequestDto } from "@apps/backend/modules/feed/dto/feed-create.dto";
import { UpdateFeedRequestDto } from "@apps/backend/modules/feed/dto/feed-update.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FeedCreateService } from "@apps/backend/modules/feed/services/feed-create.service";
import { FeedUpdateService } from "@apps/backend/modules/feed/services/feed-update.service";
import { FeedDeleteService } from "@apps/backend/modules/feed/services/feed-delete.service";
import { FeedListService } from "@apps/backend/modules/feed/services/feed-list.service";
import { FeedDetailService } from "@apps/backend/modules/feed/services/feed-detail.service";

/**
 * 피드 서비스
 *
 * 피드 관련 기능을 통합해서 제공하는 파사드 서비스입니다.
 * 실제 비즈니스 로직은 services/ 하위 서비스들에 분리되어 있습니다.
 */
@Injectable()
export class FeedService {
  constructor(
    private readonly feedCreateService: FeedCreateService,
    private readonly feedUpdateService: FeedUpdateService,
    private readonly feedDeleteService: FeedDeleteService,
    private readonly feedListService: FeedListService,
    private readonly feedDetailService: FeedDetailService,
  ) {}

  /**
   * 피드 목록 조회 (사용자용)
   */
  async getFeedsByStoreIdForUser(storeId: string, query: PaginationRequestDto) {
    return this.feedListService.getFeedsByStoreIdForUser(storeId, query);
  }

  /**
   * 피드 상세 조회 (사용자용)
   */
  async getFeedByIdForUser(feedId: string) {
    return this.feedDetailService.getFeedByIdForUser(feedId);
  }

  /**
   * 피드 생성 (판매자용)
   */
  async createFeedForSeller(userId: string, createFeedDto: CreateFeedRequestDto) {
    return this.feedCreateService.createFeed(userId, createFeedDto);
  }

  /**
   * 피드 수정 (판매자용)
   */
  async updateFeedForSeller(
    feedId: string,
    updateFeedDto: UpdateFeedRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return this.feedUpdateService.updateFeed(feedId, updateFeedDto, user);
  }

  /**
   * 피드 삭제 (판매자용)
   */
  async deleteFeedForSeller(feedId: string, user: JwtVerifiedPayload) {
    await this.feedDeleteService.deleteFeed(feedId, user);
  }

  /**
   * 피드 목록 조회 (판매자용)
   */
  async getFeedsByStoreIdForSeller(
    storeId: string,
    user: JwtVerifiedPayload,
    query: PaginationRequestDto,
  ) {
    return this.feedListService.getFeedsByStoreIdForSeller(storeId, user, query);
  }

  /**
   * 피드 상세 조회 (판매자용)
   */
  async getFeedByIdForSeller(feedId: string, user: JwtVerifiedPayload) {
    return this.feedDetailService.getFeedByIdForSeller(feedId, user);
  }
}
