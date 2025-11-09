import {
  Controller,
  Delete,
  Post,
  Body,
  Param,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  PRODUCT_ERROR_MESSAGES,
  PRODUCT_SUCCESS_MESSAGES,
  SWAGGER_EXAMPLES,
} from "@apps/backend/modules/product/constants/product.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { CreateProductRequestDto } from "@apps/backend/modules/product/dto/product-request.dto";

/**
 * 판매자 상품 컨트롤러
 * 판매자용 상품 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags("상품")
@Controller(`${USER_ROLES.SELLER}/products`)
@Auth({ isPublic: false, roles: ["SELLER", "ADMIN"] }) // SELLER와 ADMIN 역할만 접근 가능
export class SellerProductController {
  constructor(private readonly productService: ProductService) {}

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
  @SwaggerResponse(201, { id: SWAGGER_EXAMPLES.PRODUCT_DATA.id })
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED))
  @SwaggerResponse(401, createMessageObject(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED))
  @SwaggerResponse(404, createMessageObject(PRODUCT_ERROR_MESSAGES.STORE_NOT_FOUND))
  async createProduct(
    @Body() createProductDto: CreateProductRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.productService.createProduct(createProductDto, req.user);
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
  @SwaggerResponse(200, createMessageObject(PRODUCT_SUCCESS_MESSAGES.PRODUCT_DELETED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED))
  @SwaggerResponse(401, createMessageObject(PRODUCT_ERROR_MESSAGES.FORBIDDEN))
  @SwaggerResponse(404, createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND))
  async deleteProduct(@Param("id") id: string, @Request() req: { user: JwtVerifiedPayload }) {
    await this.productService.deleteProduct(id, req.user);
    return createMessageObject(PRODUCT_SUCCESS_MESSAGES.PRODUCT_DELETED);
  }
}
