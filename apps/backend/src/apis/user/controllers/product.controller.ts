import { Controller, Get, Query, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { GetProductsRequestDto } from "@apps/backend/modules/product/dto/product-request.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import {
  ProductListResponseDto,
  ProductResponseDto,
  CakeSizeOptionResponseDto,
  CakeFlavorOptionResponseDto,
} from "@apps/backend/modules/product/dto/product-response.dto";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";

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
  @SwaggerResponse(200, { dataDto: ProductListResponseDto })
  async getProducts(@Query() query: GetProductsRequestDto) {
    return await this.productService.getProducts(query);
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
  @SwaggerResponse(200, { dataDto: ProductResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  async getProductDetail(@Param("id") id: string) {
    return await this.productService.getProductDetail(id);
  }
}
