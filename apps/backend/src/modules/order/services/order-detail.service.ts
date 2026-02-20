import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import { OrderOwnershipUtil } from "@apps/backend/modules/order/utils/order-ownership.util";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

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
  async getOrderByIdForUser(orderId: string, userId: string): Promise<OrderResponseDto> {
    // 주문 소유권 확인
    await OrderOwnershipUtil.verifyOrderUserOwnership(this.prisma, orderId, userId);

    // 주문 항목 정보 포함하여 조회
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: OrderMapperUtil.ORDER_ITEMS_INCLUDE,
    });

    if (!order) {
      LoggerUtil.log(`주문 상세 조회 실패: 주문 없음 - orderId: ${orderId}, userId: ${userId}`);
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    return OrderMapperUtil.mapToOrderResponse(order);
  }

  /**
   * 주문 상세조회 (판매자용)
   * 자신이 소유한 스토어의 주문만 조회 가능합니다.
   * @param orderId - 주문 ID
   * @param userId - 판매자 사용자 ID (권한 확인용)
   * @returns 주문 정보 (OrderResponseDto)
   */
  async getOrderByIdForSeller(orderId: string, userId: string): Promise<OrderResponseDto> {
    // 주문 소유권 확인
    await OrderOwnershipUtil.verifyOrderStoreOwnership(this.prisma, orderId, userId);

    // 주문 항목 정보 포함하여 조회
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: OrderMapperUtil.ORDER_ITEMS_INCLUDE,
    });

    if (!order) {
      LoggerUtil.log(`주문 상세 조회 실패: 주문 없음 - orderId: ${orderId}, userId: ${userId}`);
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    return OrderMapperUtil.mapToOrderResponse(order);
  }
}
