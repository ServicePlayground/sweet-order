import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import {
  STORE_ERROR_MESSAGES,
  STORE_SUCCESS_MESSAGES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@apps/backend/modules/store/constants/store.constants";
import { GetStoreReviewsRequestDto } from "@apps/backend/modules/store/dto/store-review-request.dto";
import {
  ProductReviewListResponseDto,
  ProductReviewResponseDto,
  ReviewPaginationMetaResponseDto,
} from "@apps/backend/modules/product/dto/product-review-response.dto";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";

/**
 * 스토어 관련 컨트롤러
 */
@ApiTags("스토어")
@ApiExtraModels(
  ProductReviewListResponseDto,
  ProductReviewResponseDto,
  ReviewPaginationMetaResponseDto,
)
@Controller(`${USER_ROLES.USER}/store`)
@Auth({ isPublic: true }) // 기본적으로 모든 엔드포인트에 통합 인증 가드 적용
export class UserStoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 스토어 상세 조회 API
   * 특정 스토어의 상세 정보를 조회합니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 상세 조회",
    description: "특정 스토어의 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, { dataExample: SWAGGER_RESPONSE_EXAMPLES.STORE_DETAIL_RESPONSE })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  async getStoreDetail(@Param("id") id: string) {
    return await this.storeService.getStoreById(id);
  }

  /**
   * 스토어 좋아요 여부 확인 API
   * 특정 스토어에 대한 사용자의 좋아요 여부를 확인합니다.
   */
  @Get(":id/is-liked")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 스토어 좋아요 여부 확인",
    description: "특정 스토어에 대한 사용자의 좋아요 여부를 확인합니다.",
  })
  @SwaggerResponse(200, { dataExample: { isLiked: true } })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  async isLiked(@Param("id") storeId: string, @Request() req: { user: JwtVerifiedPayload }) {
    const isLiked = await this.storeService.isStoreLiked(req.user.sub, storeId);
    return { isLiked };
  }

  /**
   * 스토어 좋아요 추가 API
   * 스토어에 좋아요를 추가합니다.
   */
  @Post(":id/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인필요) 스토어 좋아요 추가",
    description: "스토어에 좋아요를 추가합니다.",
  })
  @SwaggerResponse(201, {
    dataExample: createMessageObject(STORE_SUCCESS_MESSAGES.LIKE_ADDED),
  })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  @SwaggerResponse(409, {
    dataExample: createMessageObject(STORE_ERROR_MESSAGES.LIKE_ALREADY_EXISTS),
  })
  async addStoreLike(@Param("id") storeId: string, @Request() req: { user: JwtVerifiedPayload }) {
    await this.storeService.addStoreLike(req.user.sub, storeId);
    return { message: STORE_SUCCESS_MESSAGES.LIKE_ADDED };
  }

  /**
   * 스토어 좋아요 삭제 API
   * 스토어의 좋아요를 취소합니다.
   */
  @Delete(":id/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 스토어 좋아요 삭제",
    description: "스토어의 좋아요를 취소합니다.",
  })
  @SwaggerResponse(200, {
    dataExample: createMessageObject(STORE_SUCCESS_MESSAGES.LIKE_REMOVED),
  })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.LIKE_NOT_FOUND) })
  async removeStoreLike(
    @Param("id") storeId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.storeService.removeStoreLike(req.user.sub, storeId);
    return { message: STORE_SUCCESS_MESSAGES.LIKE_REMOVED };
  }

  /**
   * 스토어 후기 목록 조회 API
   * 해당 스토어의 모든 상품에 대한 후기 목록을 조회합니다.
   */
  @Get(":id/reviews")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 후기 목록 조회",
    description:
      "해당 스토어의 모든 상품에 대한 후기 목록을 조회합니다. 최신순, 별점순 정렬을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: ProductReviewListResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  async getStoreReviews(@Param("id") storeId: string, @Query() query: GetStoreReviewsRequestDto) {
    return await this.storeService.getStoreReviews(storeId, query);
  }

  /**
   * 스토어 후기 단일 조회 API
   * 해당 스토어의 상품 중 하나에 대한 특정 후기를 조회합니다.
   */
  @Get(":id/reviews/:reviewId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 후기 단일 조회",
    description: "해당 스토어의 상품 중 하나에 대한 특정 후기를 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: ProductReviewResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.REVIEW_NOT_FOUND),
  })
  async getStoreReview(@Param("id") storeId: string, @Param("reviewId") reviewId: string) {
    return await this.storeService.getStoreReview(storeId, reviewId);
  }
}
