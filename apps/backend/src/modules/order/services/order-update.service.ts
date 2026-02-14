import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { UpdateOrderStatusRequestDto } from "@apps/backend/modules/order/dto/order-update.dto";
import {
  OrderStatus,
  ORDER_ERROR_MESSAGES,
} from "@apps/backend/modules/order/constants/order.constants";
import { OrderOwnershipUtil } from "@apps/backend/modules/order/utils/order-ownership.util";

/**
 * 주문 상태 변경 서비스
 * 주문 상태 변경 관련 로직을 담당합니다.
 */
@Injectable()
export class OrderUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 주문 상태 변경 (판매자용)
   * 자신이 소유한 스토어의 주문만 상태 변경 가능합니다.
   * @param orderId - 주문 ID
   * @param updateDto - 상태 변경 요청 DTO
   * @param userId - 사용자 ID (권한 확인용)
   * @returns 업데이트된 주문 ID
   */
  async updateOrderStatusForSeller(
    orderId: string,
    updateDto: UpdateOrderStatusRequestDto,
    userId: string,
  ): Promise<{ id: string }> {
    // 주문 소유권 확인 및 조회
    const order = await OrderOwnershipUtil.verifyOrderStoreOwnership(this.prisma, orderId, userId, {
      id: true,
      userId: true,
    });

    // 상태 변경 유효성 검증
    const { orderStatus } = updateDto;

    // PENDING -> CONFIRMED만 허용 (현재는 두 가지 상태만 존재)
    if (order.orderStatus === OrderStatus.CONFIRMED && orderStatus === OrderStatus.PENDING) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.CANNOT_REVERT_CONFIRMED);
    }

    // 상태 업데이트
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
      },
    });

    return { id: orderId };
  }
}
