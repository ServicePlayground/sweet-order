import { Controller, Get, Query, Request, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { GetProductsRequestDto } from "@apps/backend/modules/product/dto/product-request.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  PRODUCT_ERROR_MESSAGES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@apps/backend/modules/product/constants/product.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";

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
  async getProducts(
    @Query() query: GetProductsRequestDto,
    @Request() req: { user?: JwtVerifiedPayload }, // 필수는 아니지만, 사용자 정보가 있으면 좋아요와 같은 여부 판단에 사용할 수 있음
  ) {
    return this.productService.getProducts(query, req.user);
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
  async getProductDetail(@Param("id") id: string, @Request() req: { user?: JwtVerifiedPayload }) {
    return this.productService.getProductDetail(id, req.user);
  }
}
