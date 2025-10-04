import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductService } from "@web-user/backend/modules/product/product.service";
import { GetProductsRequestDto } from "@web-user/backend/modules/product/dto/product-request.dto";
import { JwtAuthGuard } from "@web-user/backend/modules/auth/guards/jwt-auth.guard";
import { Public } from "@web-user/backend/common/decorators/public.decorator";
import { SwaggerResponse } from "@web-user/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@web-user/backend/common/types/auth.types";
import {
  PRODUCT_ERROR_MESSAGES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@web-user/backend/modules/product/constants/product.constants";
import { createMessageObject } from "@web-user/backend/common/utils/message.util";

/**
 * 상품 컨트롤러
 * 상품 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags("상품")
@Controller("products")
// 기본적으로 모든 엔드포인트에 JWT 인증 가드 적용 // @Public() 데코레이터가 있는 엔드포인트는 인증을 건너뜀
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 상품 목록 조회 API (무한 스크롤)
   * 필터링, 정렬, 무한 스크롤을 지원하는 상품 목록을 조회합니다.
   */
  @Get()
  @Public()
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
  @Public()
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
