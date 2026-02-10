import { Injectable } from "@nestjs/common";
import { ReviewListService } from "@apps/backend/modules/review/services/review-list.service";
import { ReviewDetailService } from "@apps/backend/modules/review/services/review-detail.service";
import { GetReviewsRequestDto } from "@apps/backend/modules/review/dto/review-request.dto";

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
  ) {}

  /**
   * 상품 후기 목록 조회
   */
  async getProductReviews(productId: string, query: GetReviewsRequestDto) {
    return this.reviewListService.getProductReviews(productId, query);
  }

  /**
   * 상품 후기 단일 조회
   */
  async getProductReview(productId: string, reviewId: string) {
    return this.reviewDetailService.getProductReview(productId, reviewId);
  }

  /**
   * 스토어 후기 목록 조회
   */
  async getStoreReviews(storeId: string, query: GetReviewsRequestDto) {
    return this.reviewListService.getStoreReviews(storeId, query);
  }

  /**
   * 스토어 후기 단일 조회
   */
  async getStoreReview(storeId: string, reviewId: string) {
    return this.reviewDetailService.getStoreReview(storeId, reviewId);
  }
}
