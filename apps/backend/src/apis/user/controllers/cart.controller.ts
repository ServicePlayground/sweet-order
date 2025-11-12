import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CartService } from "@apps/backend/modules/cart/cart.service";
import {
  AddCartItemRequestDto,
  UpdateCartItemRequestDto,
} from "@apps/backend/modules/cart/dto/cart-request.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  CART_ERROR_MESSAGES,
  CART_SUCCESS_MESSAGES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@apps/backend/modules/cart/constants/cart.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { AUTH_ERROR_MESSAGES, USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";

/** 
 * 사용자 장바구니 컨트롤러
 * 사용자 장바구니 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags("장바구니")
@Controller(`${USER_ROLES.USER}/cart`)
@Auth({ isPublic: false }) // 인증 필수
export class UserCartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * 장바구니 목록 조회 API
   * 사용자의 장바구니에 담긴 모든 항목을 조회합니다.
   * 유효하지 않은 항목(삭제된 상품, 품절된 상품, 재고 부족, orderFormSchema 변경 등)은 자동으로 제거됩니다.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 장바구니 목록 조회",
    description:
      "사용자의 장바구니에 담긴 모든 항목을 조회합니다. 유효하지 않은 항목(삭제된 상품, 품절된 상품, 재고 부족, orderFormSchema 변경 등)은 자동으로 제거됩니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.CART_LIST_RESPONSE)
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  async getCartItems(@Request() req: { user: JwtVerifiedPayload }) {
    return await this.cartService.getCartItems(req.user.sub);
  }

  /**
   * 장바구니에 상품 추가 API
   * 장바구니에 새로운 상품을 추가합니다.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인필요) 장바구니에 상품 추가",
    description: "장바구니에 새로운 상품을 추가합니다.",
  })
  @SwaggerResponse(201, createMessageObject(CART_SUCCESS_MESSAGES.ITEM_ADDED))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.PRODUCT_INACTIVE))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.ORDER_FORM_DATA_INVALID))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.ORDER_FORM_DATA_REQUIRED))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.ORDER_FORM_SCHEMA_CHANGED))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.ORDER_FORM_SCHEMA_CHANGED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(404, createMessageObject(CART_ERROR_MESSAGES.PRODUCT_NOT_FOUND))
  @SwaggerResponse(404, createMessageObject(CART_ERROR_MESSAGES.PRODUCT_DELETED))
  async addCartItem(
    @Body() addCartItemDto: AddCartItemRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.cartService.addCartItem(req.user.sub, addCartItemDto);
    return { message: CART_SUCCESS_MESSAGES.ITEM_ADDED };
  }

  /**
   * 장바구니 항목 수정 API
   * 장바구니 항목의 수량이나 주문 폼 데이터를 수정합니다.
   */
  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 장바구니 항목 수정",
    description: "장바구니 항목의 수량이나 주문 폼 데이터를 수정합니다.",
  })
  @SwaggerResponse(200, createMessageObject(CART_SUCCESS_MESSAGES.ITEM_UPDATED))
  @SwaggerResponse(404, createMessageObject(CART_ERROR_MESSAGES.NOT_FOUND))
  @SwaggerResponse(400, createMessageObject(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  async updateCartItem(
    @Param("id") cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.cartService.updateCartItem(req.user.sub, cartItemId, updateCartItemDto);
    return { message: CART_SUCCESS_MESSAGES.ITEM_UPDATED };
  }

  /**
   * 장바구니 항목 삭제 API
   * 장바구니에서 특정 항목을 삭제합니다.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 장바구니 항목 삭제",
    description: "장바구니에서 특정 항목을 삭제합니다.",
  })
  @SwaggerResponse(200, createMessageObject(CART_SUCCESS_MESSAGES.ITEM_REMOVED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(404, createMessageObject(CART_ERROR_MESSAGES.NOT_FOUND))
  async removeCartItem(
    @Param("id") cartItemId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.cartService.removeCartItem(req.user.sub, cartItemId);
    return { message: CART_SUCCESS_MESSAGES.ITEM_REMOVED };
  }

  /**
   * 장바구니 전체 삭제 API
   * 사용자의 장바구니를 모두 비웁니다.
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인필요) 장바구니 전체 삭제",
    description: "사용자의 장바구니를 모두 비웁니다.",
  })
  @SwaggerResponse(200, createMessageObject(CART_SUCCESS_MESSAGES.CART_CLEARED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  async clearCart(@Request() req: { user: JwtVerifiedPayload }) {
    await this.cartService.clearCart(req.user.sub);
    return { message: CART_SUCCESS_MESSAGES.CART_CLEARED };
  }
}

