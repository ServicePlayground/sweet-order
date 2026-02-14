import { Controller, Get, Query, HttpCode, HttpStatus, Param, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { ProductService } from "@apps/backend/modules/product/product.service";
import {
  GetProductsRequestDto,
  ProductListResponseDto,
} from "@apps/backend/modules/product/dto/product-list.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import {
  ProductResponseDto,
  CakeSizeOptionResponseDto,
  CakeFlavorOptionResponseDto,
} from "@apps/backend/modules/product/dto/product-detail.dto";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 사용자 상품 컨트롤러
 * 사용자 상품 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags("상품")
/** @ApiExtraModels
 * Swagger 스키마에 응답 DTO를 등록합니다.
 * SwaggerResponse 데코레이터에서 $ref를 사용하여 DTO를 참조할 때, 해당 DTO가 Swagger 스키마에 등록되어 있어야 하기 때문
 */
@ApiExtraModels(
  ProductListResponseDto,
  ProductResponseDto,
  PaginationMetaResponseDto,
  CakeSizeOptionResponseDto,
  CakeFlavorOptionResponseDto,
)
@Controller(`${USER_ROLES.USER}/products`)
@Auth({ isOptionalPublic: true }) // 선택적 인증: 토큰이 있으면 검증하고 user 설정, 없으면 통과
export class UserProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 상품 목록 조회 API (무한 스크롤)
   * 필터링, 정렬, 무한 스크롤을 지원하는 상품 목록을 조회합니다.
   * 로그인한 사용자의 경우 각 상품의 좋아요 여부(isLiked)도 함께 반환됩니다.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "상품 목록 조회",
    description:
      "필터링, 정렬, 무한 스크롤을 지원하는 상품 목록을 조회합니다. 로그인한 사용자의 경우 각 상품의 좋아요 여부(isLiked)도 함께 반환됩니다.",
  })
  @SwaggerResponse(200, { dataDto: ProductListResponseDto })
  async getProducts(
    @Query() query: GetProductsRequestDto,
    @Request() req: { user?: JwtVerifiedPayload },
  ) {
    return await this.productService.getProducts(query, req.user);
  }

  /**
   * 상품 상세 조회 API
   * 특정 상품의 상세 정보를 조회합니다.
   * 로그인한 사용자의 경우 해당 상품의 좋아요 여부(isLiked)도 함께 반환됩니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "상품 상세 조회",
    description:
      "특정 상품의 상세 정보를 조회합니다. 로그인한 사용자의 경우 해당 상품의 좋아요 여부(isLiked)도 함께 반환됩니다.",
  })
  @SwaggerResponse(200, { dataDto: ProductResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  async getProductDetail(@Param("id") id: string, @Request() req: { user?: JwtVerifiedPayload }) {
    return await this.productService.getProductDetail(id, req.user);
  }
}
