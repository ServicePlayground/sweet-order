import { Controller, Delete, Param, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductService } from "@apps/backend/modules/product/product.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  PRODUCT_ERROR_MESSAGES,
  PRODUCT_SUCCESS_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";

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
   * 상품 삭제 API
   * 판매자가 등록한 상품을 삭제합니다.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "상품 삭제",
    description: "판매자가 등록한 상품을 삭제합니다.",
  })
  @SwaggerResponse(200, createMessageObject(PRODUCT_SUCCESS_MESSAGES.PRODUCT_DELETED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(403, createMessageObject(AUTH_ERROR_MESSAGES.FORBIDDEN))
  @SwaggerResponse(403, createMessageObject(PRODUCT_ERROR_MESSAGES.FORBIDDEN))
  @SwaggerResponse(404, createMessageObject(PRODUCT_ERROR_MESSAGES.NOT_FOUND))
  async deleteProduct(@Param("id") id: string, @Request() req: { user: JwtVerifiedPayload }) {
    await this.productService.deleteProduct(id, req.user);
    return createMessageObject(PRODUCT_SUCCESS_MESSAGES.PRODUCT_DELETED);
  }
}
