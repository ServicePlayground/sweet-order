import { Injectable } from "@nestjs/common";
import { ReviewDataService } from "@apps/backend/modules/review/services/review.service";
import { GetReviewsRequestDto } from "@apps/backend/modules/review/dto/review-request.dto";

/**
 * 후기 서비스
 *
 * 모든 후기 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * ReviewDataService를 조합하여 사용합니다.
 */
@Injectable()
export class ReviewService {
  constructor(private readonly reviewDataService: ReviewDataService) {}

  /**
   * 상품 후기 목록 조회
   */
  async getProductReviews(productId: string, query: GetReviewsRequestDto) {
    return this.reviewDataService.getProductReviews(productId, query);
  }

  /**
   * 상품 후기 단일 조회
   */
  async getProductReview(productId: string, reviewId: string) {
    return this.reviewDataService.getProductReview(productId, reviewId);
  }

  /**
   * 스토어 후기 목록 조회
   */
  async getStoreReviews(storeId: string, query: GetReviewsRequestDto) {
    return this.reviewDataService.getStoreReviews(storeId, query);
  }

  /**
   * 스토어 후기 단일 조회
   */
  async getStoreReview(storeId: string, reviewId: string) {
    return this.reviewDataService.getStoreReview(storeId, reviewId);
  }
}
