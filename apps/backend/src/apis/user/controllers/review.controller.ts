import { Controller, Get, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { ReviewService } from "@apps/backend/modules/review/review.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { REVIEW_ERROR_MESSAGES } from "@apps/backend/modules/review/constants/review.constants";
import {
  GetReviewsRequestDto,
  ReviewListResponseDto,
} from "@apps/backend/modules/review/dto/review-list.dto";
import { ReviewResponseDto } from "@apps/backend/modules/review/dto/review-detail.dto";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 후기 관련 컨트롤러
 */
@ApiTags("후기")
@ApiExtraModels(ReviewListResponseDto, ReviewResponseDto)
@Controller(`${USER_ROLES.USER}/review`)
@Auth({ isPublic: true })
export class UserReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 상품 후기 목록 조회 API
   */
  @Get("product/:productId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "상품 후기 목록 조회",
    description: "특정 상품의 후기 목록을 조회합니다. 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: ReviewListResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  async getProductReviews(
    @Param("productId") productId: string,
    @Query() query: GetReviewsRequestDto,
  ) {
    return await this.reviewService.getProductReviewsForUser(productId, query);
  }

  /**
   * 상품 후기 단일 조회 API
   */
  @Get("product/:productId/:reviewId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "상품 후기 단일 조회",
    description: "특정 상품의 후기 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: ReviewResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(REVIEW_ERROR_MESSAGES.REVIEW_NOT_FOUND),
  })
  async getProductReview(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
  ) {
    return await this.reviewService.getProductReviewForUser(productId, reviewId);
  }

  /**
   * 스토어 후기 목록 조회 API
   */
  @Get("store/:storeId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 후기 목록 조회",
    description:
      "특정 스토어의 모든 상품에 대한 후기 목록을 조회합니다. 최신순, 별점순 정렬을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: ReviewListResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  async getStoreReviews(@Param("storeId") storeId: string, @Query() query: GetReviewsRequestDto) {
    return await this.reviewService.getStoreReviewsForUser(storeId, query);
  }

  /**
   * 스토어 후기 단일 조회 API
   */
  @Get("store/:storeId/:reviewId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 후기 단일 조회",
    description: "해당 스토어의 상품 중 하나에 대한 특정 후기를 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: ReviewResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(REVIEW_ERROR_MESSAGES.REVIEW_NOT_FOUND),
  })
  async getStoreReview(@Param("storeId") storeId: string, @Param("reviewId") reviewId: string) {
    return await this.reviewService.getStoreReviewForUser(storeId, reviewId);
  }
}
