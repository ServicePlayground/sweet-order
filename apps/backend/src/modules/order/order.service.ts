import { Injectable } from "@nestjs/common";
import { OrderCreateService } from "@apps/backend/modules/order/services/order-create.service";
import { OrderDetailService } from "@apps/backend/modules/order/services/order-detail.service";
import { CreateOrderRequestDto } from "@apps/backend/modules/order/dto/order-request.dto";
import {
  CreateOrderResponseDto,
  OrderResponseDto,
} from "@apps/backend/modules/order/dto/order-response.dto";
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
  ) {}

  /**
   * 주문 생성
   */
  async createOrder(
    createOrderDto: CreateOrderRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<CreateOrderResponseDto> {
    return this.orderCreateService.createOrder(user.sub, createOrderDto);
  }

  /**
   * 주문 상세조회
   */
  async getOrderById(orderId: string, user: JwtVerifiedPayload): Promise<OrderResponseDto> {
    return this.orderDetailService.getOrderById(orderId, user.sub);
  }
}
