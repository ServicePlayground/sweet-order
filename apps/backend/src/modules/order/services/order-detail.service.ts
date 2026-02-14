import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import { OrderOwnershipUtil } from "@apps/backend/modules/order/utils/order-ownership.util";

/**
 * 주문 상세조회 서비스
 * 주문 상세조회 관련 로직을 담당합니다.
 */
@Injectable()
export class OrderDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 주문 상세조회 (사용자용)
   * @param orderId - 주문 ID
   * @param userId - 사용자 ID (권한 확인용)
   * @returns 주문 정보 (OrderResponseDto)
   */
  async getOrderById(orderId: string, userId: string): Promise<OrderResponseDto> {
    // 주문 소유권 확인
    await OrderOwnershipUtil.verifyOrderUserOwnership(this.prisma, orderId, userId);

    // 주문 조회 (orderItems 포함)
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    return OrderMapperUtil.mapToOrderResponse(order!);
  }

  /**
   * 주문 상세조회 (판매자용)
   * 자신이 소유한 스토어의 주문만 조회 가능합니다.
   * @param orderId - 주문 ID
   * @param userId - 판매자 사용자 ID (권한 확인용)
   * @returns 주문 정보 (OrderResponseDto)
   */
  async getSellerOrderById(orderId: string, userId: string): Promise<OrderResponseDto> {
    // 주문 소유권 확인
    await OrderOwnershipUtil.verifyOrderStoreOwnership(this.prisma, orderId, userId, {
      id: true,
      userId: true,
    });

    // 주문 조회 (orderItems 포함)
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    return OrderMapperUtil.mapToOrderResponse(order!);
  }
}
