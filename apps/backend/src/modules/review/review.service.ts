import { Injectable } from "@nestjs/common";
import { ReviewListService } from "@apps/backend/modules/review/services/review-list.service";
import { ReviewDetailService } from "@apps/backend/modules/review/services/review-detail.service";
import { ReviewUserListService } from "@apps/backend/modules/review/services/review-user-list.service";
import { GetReviewsRequestDto } from "@apps/backend/modules/review/dto/review-list.dto";
import {
  GetMyReviewsRequestDto,
  MyReviewListResponseDto,
} from "@apps/backend/modules/review/dto/review-user-list.dto";

/**
 * 후기 서비스
 *
 * 모든 후기 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * ReviewDataService를 조합하여 사용합니다.
 */
@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewListService: ReviewListService,
    private readonly reviewDetailService: ReviewDetailService,
    private readonly reviewUserListService: ReviewUserListService,
  ) {}

  /**
   * 상품 후기 목록 조회 (사용자용)
   */
  async getProductReviewsForUser(productId: string, query: GetReviewsRequestDto) {
    return this.reviewListService.getProductReviewsForUser(productId, query);
  }

  /**
   * 상품 후기 단일 조회 (사용자용)
   */
  async getProductReviewForUser(productId: string, reviewId: string) {
    return this.reviewDetailService.getProductReviewForUser(productId, reviewId);
  }

  /**
   * 스토어 후기 목록 조회 (사용자용)
   */
  async getStoreReviewsForUser(storeId: string, query: GetReviewsRequestDto) {
    return this.reviewListService.getStoreReviewsForUser(storeId, query);
  }

  /**
   * 스토어 후기 단일 조회 (사용자용)
   */
  async getStoreReviewForUser(storeId: string, reviewId: string) {
    return this.reviewDetailService.getStoreReviewForUser(storeId, reviewId);
  }

  /**
   * 내가 작성한 후기 목록 조회 (사용자용)
   */
  async getMyReviewsForUser(
    userId: string,
    query: GetMyReviewsRequestDto,
  ): Promise<MyReviewListResponseDto> {
    return this.reviewUserListService.getMyReviewsForUser(userId, query);
  }
}
