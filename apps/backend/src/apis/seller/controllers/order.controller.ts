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
  OrderListResponseDto,
  OrderListRequestDto,
} from "@apps/backend/modules/order/dto/order-list.dto";
import {
  UpdateOrderStatusRequestDto,
  UpdateOrderStatusResponseDto,
} from "@apps/backend/modules/order/dto/order-seller-action.dto";
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
      "자신이 소유한 스토어의 주문 목록을 조회합니다. 픽업 예정/지난 예약(type), 스토어/상태/기간/주문번호 필터, 정렬(sortBy), 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: OrderListResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(403, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(403, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.STORE_NOT_OWNED),
  })
  async getOrders(
    @Query() query: OrderListRequestDto,
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
  @SwaggerResponse(403, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(403, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.FORBIDDEN),
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
    description:
      "예약확정·픽업완료·노쇼·취소완료·취소환불대기·취소환불완료 중 하나로 변경할 수 있습니다. 예약확정은 입금대기·입금완료에서만 가능합니다. 픽업완료는 예약확정·픽업대기에서만 가능합니다. 취소완료는 입금대기에서만 가능하며 sellerCancelReason 필수입니다. 취소환불대기는 입금 이후(입금완료·예약확정·픽업대기)에서 설정 가능하며 sellerCancelRefundPendingReason 필수입니다(사용자 취소·환불 요청 시 저장되는 refundRequestReason과 별도). 취소환불완료는 취소환불대기에서만 가능합니다. 노쇼는 픽업대기에서만 가능하며 sellerNoShowReason 필수입니다. 동일 상태 요청은 불가합니다.",
  })
  @SwaggerResponse(200, { dataDto: UpdateOrderStatusResponseDto })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.INVALID_STATUS_TRANSITION),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.SELLER_CANCEL_REASON_REQUIRED),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.SELLER_NO_SHOW_REASON_REQUIRED),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(
      ORDER_ERROR_MESSAGES.SELLER_CANCEL_REFUND_PENDING_REASON_REQUIRED,
    ),
  })
  @SwaggerAuthResponses()
  @SwaggerResponse(403, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(403, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.FORBIDDEN),
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
