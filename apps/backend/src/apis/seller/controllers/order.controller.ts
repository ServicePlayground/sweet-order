import {
  Controller,
  Get,
  Patch,
  Query,
  Param,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { OrderService } from "@apps/backend/modules/order/order.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { SwaggerAuthResponses } from "@apps/backend/common/decorators/swagger-auth-responses.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import {
  GetSellerOrdersRequestDto,
  OrderListResponseDto,
} from "@apps/backend/modules/order/dto/order-list.dto";
import {
  UpdateOrderStatusRequestDto,
  UpdateOrderStatusResponseDto,
} from "@apps/backend/modules/order/dto/order-update.dto";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";

/**
 * 판매자 주문 컨트롤러
 * 판매자용 주문 관리 API 엔드포인트를 제공합니다.
 */
@ApiTags("주문")
@ApiExtraModels(
  UpdateOrderStatusResponseDto,
  OrderListResponseDto,
  OrderResponseDto,
  PaginationMetaResponseDto,
)
@Controller(`${USER_ROLES.SELLER}/orders`)
@Auth({ isPublic: false, roles: ["SELLER", "ADMIN"] }) // SELLER와 ADMIN 역할만 접근 가능
export class SellerOrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 판매자용 주문 목록 조회 API
   * 자신이 소유한 스토어의 주문만 조회합니다.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 판매자용 주문 목록 조회",
    description:
      "자신이 소유한 스토어의 주문 목록을 조회합니다. 필터링, 정렬, 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: OrderListResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  async getOrders(
    @Query() query: GetSellerOrdersRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.orderService.getOrdersForSeller(query, req.user);
  }

  /**
   * 판매자용 주문 상세 조회 API
   * 자신이 소유한 스토어의 주문만 조회 가능합니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 판매자용 주문 상세 조회",
    description: "자신이 소유한 스토어의 주문 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: OrderResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.NOT_FOUND),
  })
  async getOrderDetail(@Param("id") id: string, @Request() req: { user: JwtVerifiedPayload }) {
    return await this.orderService.getOrderByIdForSeller(id, req.user);
  }

  /**
   * 주문 상태 변경 API
   * 자신이 소유한 스토어의 주문만 상태 변경 가능합니다.
   */
  @Patch(":id/status")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 주문 상태 변경",
    description: "자신이 소유한 스토어의 주문 상태를 변경합니다.",
  })
  @SwaggerResponse(200, { dataDto: UpdateOrderStatusResponseDto })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.CANNOT_REVERT_CONFIRMED),
  })
  @SwaggerAuthResponses()
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.NOT_FOUND),
  })
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() updateDto: UpdateOrderStatusRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.orderService.updateOrderStatusForSeller(id, updateDto, req.user);
  }
}
