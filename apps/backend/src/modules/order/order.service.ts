import { Injectable } from "@nestjs/common";
import { OrderCreateService } from "@apps/backend/modules/order/services/order-create.service";
import { OrderDetailService } from "@apps/backend/modules/order/services/order-detail.service";
import { OrderListService } from "@apps/backend/modules/order/services/order-list.service";
import { OrderUpdateService } from "@apps/backend/modules/order/services/order-update.service";
import { OrderUserListService } from "@apps/backend/modules/order/services/order-user-list.service";
import {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from "@apps/backend/modules/order/dto/order-create.dto";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import {
  OrderListResponseDto,
  OrderListRequestDto,
} from "@apps/backend/modules/order/dto/order-list.dto";
import { UpdateOrderStatusRequestDto } from "@apps/backend/modules/order/dto/order-update.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 주문 서비스
 *
 * 모든 주문 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * OrderCreateService와 OrderDetailService를 조합하여 사용합니다.
 */
@Injectable()
export class OrderService {
  constructor(
    private readonly orderCreateService: OrderCreateService,
    private readonly orderDetailService: OrderDetailService,
    private readonly orderListService: OrderListService,
    private readonly orderUpdateService: OrderUpdateService,
    private readonly orderUserListService: OrderUserListService,
  ) {}

  /**
   * 주문 생성 (사용자용)
   */
  async createOrderForUser(
    createOrderDto: CreateOrderRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<CreateOrderResponseDto> {
    return this.orderCreateService.createOrderForUser(user.sub, createOrderDto);
  }

  /**
   * 주문 상세조회 (사용자용)
   */
  async getOrderByIdForUser(orderId: string, user: JwtVerifiedPayload): Promise<OrderResponseDto> {
    return this.orderDetailService.getOrderByIdForUser(orderId, user.sub);
  }

  /**
   * 주문 목록 조회 (사용자용)
   */
  async getUserOrdersForUser(
    query: OrderListRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<OrderListResponseDto> {
    return this.orderUserListService.getUserOrdersForUser(query, user.sub);
  }

  /**
   * 주문 상세조회 (판매자용)
   */
  async getOrderByIdForSeller(
    orderId: string,
    user: JwtVerifiedPayload,
  ): Promise<OrderResponseDto> {
    return this.orderDetailService.getOrderByIdForSeller(orderId, user.sub);
  }

  /**
   * 주문 목록 조회 (판매자용)
   */
  async getOrdersForSeller(
    query: OrderListRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<OrderListResponseDto> {
    return this.orderListService.getOrdersForSeller(query, user);
  }

  /**
   * 주문 상태 변경 (판매자용)
   */
  async updateOrderStatusForSeller(
    orderId: string,
    updateDto: UpdateOrderStatusRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<{ id: string }> {
    return this.orderUpdateService.updateOrderStatusForSeller(orderId, updateDto, user.sub);
  }
}
