import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { OrderService } from "@apps/backend/modules/order/order.service";
import { CreateOrderRequestDto } from "@apps/backend/modules/order/dto/order-request.dto";
import { CreateOrderResponseDto, OrderResponseDto } from "@apps/backend/modules/order/dto/order-response.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import {
  ORDER_ERROR_MESSAGES,
} from "@apps/backend/modules/order/constants/order.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { AUTH_ERROR_MESSAGES, USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 사용자 주문 컨트롤러
 * 사용자 주문 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags("주문")
@ApiExtraModels(CreateOrderResponseDto, OrderResponseDto)
@Controller(`${USER_ROLES.USER}/orders`)
@Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] }) // 인증 필수
export class UserOrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 주문 생성 API
   * 상품을 주문합니다.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인 필요) 주문 생성",
    description:
      "상품을 주문합니다. 상품의 판매 상태와 노출 상태를 확인하고, 주문 항목의 수량과 금액을 검증한 후 주문을 생성합니다. 생성된 주문 ID만 반환합니다.",
  })
  @SwaggerResponse(201, { dataDto: CreateOrderResponseDto })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.INVALID_TOTAL_QUANTITY),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.INVALID_TOTAL_PRICE),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.PRODUCT_INACTIVE),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED),
  })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.PRODUCT_NOT_FOUND),
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<CreateOrderResponseDto> {
    return await this.orderService.createOrder(createOrderDto, req.user);
  }

  /**
   * 주문 상세조회 API
   * 자신의 주문 정보를 조회합니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 주문 상세조회",
    description:
      "주문 ID를 통해 자신의 주문 상세 정보를 조회합니다. 자신의 주문만 조회할 수 있습니다.",
  })
  @SwaggerResponse(200, { dataDto: OrderResponseDto })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED),
  })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.NOT_FOUND),
  })
  async getOrderById(
    @Param("id") id: string,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<OrderResponseDto> {
    return await this.orderService.getOrderById(id, req.user);
  }
}

