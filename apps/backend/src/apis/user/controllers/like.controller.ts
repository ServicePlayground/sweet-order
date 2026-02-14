import { Controller, Post, Delete, Param, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { LikeService } from "@apps/backend/modules/like/like.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { SwaggerAuthResponses } from "@apps/backend/common/decorators/swagger-auth-responses.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import {
  LIKE_ERROR_MESSAGES,
  LIKE_SUCCESS_MESSAGES,
} from "@apps/backend/modules/like/constants/like.constants";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { LikeProductResponseDto } from "@apps/backend/modules/like/dto/like-product-create.dto";
import { LikeProductDeleteResponseDto } from "@apps/backend/modules/like/dto/like-product-delete.dto";
import { LikeStoreResponseDto } from "@apps/backend/modules/like/dto/like-store-create.dto";
import { LikeStoreDeleteResponseDto } from "@apps/backend/modules/like/dto/like-store-delete.dto";

/**
 * 좋아요 관련 컨트롤러 (사용자용)
 */
@ApiTags("좋아요")
@ApiExtraModels(
  LikeProductResponseDto,
  LikeProductDeleteResponseDto,
  LikeStoreResponseDto,
  LikeStoreDeleteResponseDto,
)
@Controller(`${USER_ROLES.USER}`)
@Auth({ isPublic: true })
export class UserLikeController {
  constructor(private readonly likeService: LikeService) {}

  /**
   * 상품 좋아요 추가 API
   */
  @Post("products/:productId/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인 필요) 상품 좋아요 추가",
    description: "상품에 좋아요를 추가합니다.",
  })
  @SwaggerResponse(201, { dataDto: LikeProductResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  @SwaggerResponse(409, {
    dataExample: createMessageObject(LIKE_ERROR_MESSAGES.PRODUCT_LIKE_ALREADY_EXISTS),
  })
  async addProductLike(
    @Param("productId") productId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.likeService.addProductLike(req.user.sub, productId);
    return { message: LIKE_SUCCESS_MESSAGES.PRODUCT_LIKE_ADDED };
  }

  /**
   * 상품 좋아요 삭제 API
   */
  @Delete("products/:productId/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 상품 좋아요 삭제",
    description: "상품의 좋아요를 취소합니다.",
  })
  @SwaggerResponse(200, { dataDto: LikeProductDeleteResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(404, {
    dataExample: createMessageObject(LIKE_ERROR_MESSAGES.PRODUCT_LIKE_NOT_FOUND),
  })
  async removeProductLike(
    @Param("productId") productId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.likeService.removeProductLike(req.user.sub, productId);
    return { message: LIKE_SUCCESS_MESSAGES.PRODUCT_LIKE_REMOVED };
  }

  /**
   * 스토어 좋아요 추가 API
   */
  @Post("store/:storeId/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 좋아요 추가",
    description: "스토어에 좋아요를 추가합니다.",
  })
  @SwaggerResponse(201, { dataDto: LikeStoreResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  @SwaggerResponse(409, {
    dataExample: createMessageObject(LIKE_ERROR_MESSAGES.STORE_LIKE_ALREADY_EXISTS),
  })
  async addStoreLike(
    @Param("storeId") storeId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.likeService.addStoreLike(req.user.sub, storeId);
    return { message: LIKE_SUCCESS_MESSAGES.STORE_LIKE_ADDED };
  }

  /**
   * 스토어 좋아요 삭제 API
   */
  @Delete("store/:storeId/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 좋아요 삭제",
    description: "스토어의 좋아요를 취소합니다.",
  })
  @SwaggerResponse(200, { dataDto: LikeStoreDeleteResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(404, {
    dataExample: createMessageObject(LIKE_ERROR_MESSAGES.STORE_LIKE_NOT_FOUND),
  })
  async removeStoreLike(
    @Param("storeId") storeId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.likeService.removeStoreLike(req.user.sub, storeId);
    return { message: LIKE_SUCCESS_MESSAGES.STORE_LIKE_REMOVED };
  }
}
