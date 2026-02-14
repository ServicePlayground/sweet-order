import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";
import { OrderMapperUtil } from "@apps/backend/modules/order/utils/order-mapper.util";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";

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
    // 주문 조회 (orderItems 포함)
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    // 사용자 권한 확인 (자신의 주문만 조회 가능)
    if (order.userId !== userId) {
      throw new UnauthorizedException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    // Prisma 엔티티를 DTO로 변환하여 반환
    return OrderMapperUtil.mapToOrderResponse(order);
  }

  /**
   * 주문 상세조회 (판매자용)
   * 자신이 소유한 스토어의 주문만 조회 가능합니다.
   * @param orderId - 주문 ID
   * @param userId - 판매자 사용자 ID (권한 확인용)
   * @returns 주문 정보 (OrderResponseDto)
   */
  async getSellerOrderById(orderId: string, userId: string): Promise<OrderResponseDto> {
    // 주문 조회 (orderItems, store 포함)
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        store: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (order.store.userId !== userId) {
      throw new UnauthorizedException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    // Prisma 엔티티를 DTO로 변환하여 반환
    return OrderMapperUtil.mapToOrderResponse(order);
  }
}
