import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  PRODUCT_ERROR_MESSAGES,
  PRODUCT_SUCCESS_MESSAGES,
  SWAGGER_EXAMPLES,
} from "@apps/backend/modules/product/constants/product.constants";
import {
  ProductListResponseDto,
  ProductResponseDto,
} from "@apps/backend/modules/product/dto/product-response.dto";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import {
  CreateProductRequestDto,
  UpdateProductRequestDto,
  GetSellerProductsRequestDto,
} from "@apps/backend/modules/product/dto/product-request.dto";

/**
 * 판매자 상품 컨트롤러
 * 판매자용 상품 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags("상품")
@ApiExtraModels(ProductListResponseDto, ProductResponseDto, PaginationMetaResponseDto)
@Controller(`${USER_ROLES.SELLER}/products`)
@Auth({ isPublic: false, roles: ["SELLER", "ADMIN"] }) // SELLER와 ADMIN 역할만 접근 가능
export class SellerProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 판매자용 상품 목록 조회 API (무한 스크롤)
   * 자신이 소유한 스토어의 상품만 조회합니다.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 판매자용 상품 목록 조회",
    description:
      "자신이 소유한 스토어의 상품 목록을 조회합니다. 필터링, 정렬, 무한 스크롤을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: ProductListResponseDto })
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
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED),
  })
  async getProducts(
    @Query() query: GetSellerProductsRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.productService.getSellerProducts(query, req.user);
  }

  /**
   * 판매자용 상품 상세 조회 API
   * 자신이 소유한 스토어의 상품만 조회 가능합니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 판매자용 상품 상세 조회",
    description: "자신이 소유한 스토어의 상품 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: ProductResponseDto })
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
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.FORBIDDEN) })
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  async getProductDetail(@Param("id") id: string, @Request() req: { user: JwtVerifiedPayload }) {
    return await this.productService.getSellerProductDetail(id, req.user);
  }

  /**
   * 상품 등록 API
   * 판매자가 새로운 상품을 등록합니다.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인 필요) 상품 등록",
    description:
      "판매자가 새로운 상품을 등록합니다. 스토어 소유권을 확인하고 상품 정보를 저장합니다.",
  })
  @SwaggerResponse(201, { dataExample: { id: SWAGGER_EXAMPLES.PRODUCT_DATA.id } })
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
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED),
  })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.STORE_NOT_FOUND),
  })
  async createProduct(
    @Body() createProductDto: CreateProductRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.productService.createProduct(createProductDto, req.user);
  }

  /**
   * 상품 수정 API
   * 판매자가 등록한 상품을 수정합니다.
   */
  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 상품 수정",
    description: "판매자가 등록한 상품을 수정합니다.",
  })
  @SwaggerResponse(200, { dataExample: { id: SWAGGER_EXAMPLES.PRODUCT_DATA.id } })
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
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.FORBIDDEN) })
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.productService.updateProduct(id, updateProductDto, req.user);
  }

  /**
   * 상품 삭제 API
   * 판매자가 등록한 상품을 삭제합니다.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 상품 삭제",
    description: "판매자가 등록한 상품을 삭제합니다.",
  })
  @SwaggerResponse(200, {
    dataExample: createMessageObject(PRODUCT_SUCCESS_MESSAGES.PRODUCT_DELETED),
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
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.FORBIDDEN) })
  @SwaggerResponse(404, { dataExample: createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND) })
  async deleteProduct(@Param("id") id: string, @Request() req: { user: JwtVerifiedPayload }) {
    await this.productService.deleteProduct(id, req.user);
    return createMessageObject(PRODUCT_SUCCESS_MESSAGES.PRODUCT_DELETED);
  }
}
