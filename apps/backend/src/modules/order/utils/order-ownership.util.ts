import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";
import { Order, Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 주문 소유권 확인 유틸리티
 */
export class OrderOwnershipUtil {
  /**
   * 주문을 조회하고 스토어 소유권을 확인합니다 (판매자용).
   * @param prisma PrismaService 인스턴스
   * @param orderId 주문 ID
   * @param userId 사용자 ID (스토어 소유자)
   * @param includeStoreSelect 스토어 조회 시 포함할 필드
   * @returns 주문 정보 (스토어 정보 포함)
   * @throws NotFoundException 주문을 찾을 수 없을 경우
   * @throws ForbiddenException 스토어 소유권이 없을 경우
   */
  static async verifyOrderStoreOwnership(
    prisma: PrismaService,
    orderId: string,
    userId: string,
    includeStoreSelect?: Prisma.StoreSelect,
  ): Promise<Order & { store: { id: string; userId: string; [key: string]: any } }> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        store: {
          select: {
            id: true,
            userId: true,
            ...(includeStoreSelect || {}),
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    if (order.store.userId !== userId) {
      throw new ForbiddenException(ORDER_ERROR_MESSAGES.FORBIDDEN);
    }

    return order as Order & { store: { id: string; userId: string; [key: string]: any } };
  }

  /**
   * 주문을 조회하고 사용자 소유권을 확인합니다 (사용자용).
   * @param prisma PrismaService 인스턴스
   * @param orderId 주문 ID
   * @param userId 사용자 ID
   * @returns 주문 정보
   * @throws NotFoundException 주문을 찾을 수 없을 경우
   * @throws ForbiddenException 사용자 소유권이 없을 경우
   */
  static async verifyOrderUserOwnership(
    prisma: PrismaService,
    orderId: string,
    userId: string,
  ): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException(ORDER_ERROR_MESSAGES.FORBIDDEN);
    }

    return order;
  }
}
