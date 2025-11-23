import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { GetProductsRequestDto } from "@apps/backend/modules/product/dto/product-request.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  PRODUCT_ERROR_MESSAGES,
  PRODUCT_SUCCESS_MESSAGES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@apps/backend/modules/product/constants/product.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 사용자 상품 컨트롤러
 * 사용자 상품 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags("상품")
@Controller(`${USER_ROLES.USER}/products`)
@Auth({ isPublic: true }) // 기본적으로 모든 엔드포인트에 통합 인증 가드 적용
export class UserProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 상품 목록 조회 API (무한 스크롤)
   * 필터링, 정렬, 무한 스크롤을 지원하는 상품 목록을 조회합니다.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "상품 목록 조회",
    description: "필터링, 정렬, 무한 스크롤을 지원하는 상품 목록을 조회합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.PRODUCT_LIST_RESPONSE)
  async getProducts(@Query() query: GetProductsRequestDto) {
    return await this.productService.getProducts(query);
  }

  /**
   * 상품 좋아요 여부 확인 API
   * 특정 상품에 대한 사용자의 좋아요 여부를 확인합니다.
   */
  @Get(":id/is-liked")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 상품 좋아요 여부 확인",
    description: "특정 상품에 대한 사용자의 좋아요 여부를 확인합니다.",
  })
  @SwaggerResponse(200, { isLiked: true })
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(404, createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND))
  async isLiked(@Param("id") productId: string, @Request() req: { user: JwtVerifiedPayload }) {
    const isLiked = await this.productService.isLiked(req.user.sub, productId);
    return { isLiked };
  }

  /**
   * 상품 상세 조회 API
   * 특정 상품의 상세 정보를 조회합니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "상품 상세 조회",
    description: "특정 상품의 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.PRODUCT_DETAIL_RESPONSE)
  @SwaggerResponse(404, createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND))
  async getProductDetail(@Param("id") id: string) {
    return await this.productService.getProductDetail(id);
  }

  /**
   * 상품 좋아요 추가 API
   * 상품에 좋아요를 추가합니다.
   */
  @Post(":id/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인필요) 상품 좋아요 추가",
    description: "상품에 좋아요를 추가합니다.",
  })
  @SwaggerResponse(201, createMessageObject(PRODUCT_SUCCESS_MESSAGES.LIKE_ADDED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(404, createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND))
  @SwaggerResponse(409, createMessageObject(PRODUCT_ERROR_MESSAGES.LIKE_ALREADY_EXISTS))
  async addProductLike(
    @Param("id") productId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.productService.addProductLike(req.user.sub, productId);
    return { message: PRODUCT_SUCCESS_MESSAGES.LIKE_ADDED };
  }

  /**
   * 상품 좋아요 삭제 API
   * 상품의 좋아요를 취소합니다.
   */
  @Delete(":id/like")
  @Auth({ isPublic: false }) // 인증 필수
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 상품 좋아요 삭제",
    description: "상품의 좋아요를 취소합니다.",
  })
  @SwaggerResponse(200, createMessageObject(PRODUCT_SUCCESS_MESSAGES.LIKE_REMOVED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(404, createMessageObject(PRODUCT_ERROR_MESSAGES.LIKE_NOT_FOUND))
  async removeProductLike(
    @Param("id") productId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.productService.removeProductLike(req.user.sub, productId);
    return { message: PRODUCT_SUCCESS_MESSAGES.LIKE_REMOVED };
  }
}
