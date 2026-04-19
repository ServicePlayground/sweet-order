import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { UpdateOrderStatusRequestDto } from "../dto/order-seller-action.dto";
import {
  OrderStatus,
  ORDER_ERROR_MESSAGES,
} from "@apps/backend/modules/order/constants/order.constants";
import { OrderOwnershipUtil } from "@apps/backend/modules/order/utils/order-ownership.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";
import { isSellerTransitionAllowed } from "@apps/backend/modules/order/utils/order-status-transition.util";
import { OrderAutomationService } from "@apps/backend/modules/order/services/order-automation.service";
import { OrderLifecycleHookService } from "@apps/backend/modules/order/services/order-lifecycle-hook.service";
import { ORDER_STATUS_TRANSITION_SOURCE } from "@apps/backend/modules/order/types/order-lifecycle.types";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { computePaymentPendingDeadline } from "@apps/backend/modules/order/utils/order-datetime.util";

/**
 * 판매자(스토어 소유자) 주문 액션 전용 서비스.
 * `OrderUserActionService`와 대응됩니다.
 */
@Injectable()
export class OrderSellerActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderAutomationService: OrderAutomationService,
    private readonly orderLifecycleHookService: OrderLifecycleHookService,
  ) {}

  /**
   * 주문 상태 변경 (판매자용)
   * 자신이 소유한 스토어의 주문만 상태 변경 가능합니다.
   *
   * 입금대기(예약 확인)·예약확정·픽업완료·노쇼·취소완료·취소환불대기·취소환불완료 중 하나입니다.
   * isSellerTransitionAllowed 규칙을 따릅니다.
   *
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
    await OrderOwnershipUtil.verifyOrderStoreOwnership(this.prisma, orderId, userId, {
      id: true,
      sellerId: true,
    });

    await this.orderAutomationService.syncOrderLifecycleById(orderId);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { orderStatus: true, pickupDate: true },
    });

    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    const { orderStatus } = updateDto;
    const current = order.orderStatus as OrderStatus;

    if (current === orderStatus) {
      LoggerUtil.log(
        `주문 상태 변경 실패: 동일한 상태 - orderId: ${orderId}, userId: ${userId}, currentStatus: ${current}, requestedStatus: ${orderStatus}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.SAME_STATUS);
    }

    if (!isSellerTransitionAllowed(current, orderStatus)) {
      LoggerUtil.log(
        `주문 상태 변경 실패: 허용되지 않은 전환 - orderId: ${orderId}, userId: ${userId}, from: ${current}, to: ${orderStatus}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_STATUS_TRANSITION);
    }

    if (orderStatus === OrderStatus.CANCEL_COMPLETED) {
      const reason = updateDto.sellerCancelReason?.trim();
      if (!reason) {
        throw new BadRequestException(ORDER_ERROR_MESSAGES.SELLER_CANCEL_REASON_REQUIRED);
      }
    }

    if (orderStatus === OrderStatus.NO_SHOW) {
      const reason = updateDto.sellerNoShowReason?.trim();
      if (!reason) {
        throw new BadRequestException(ORDER_ERROR_MESSAGES.SELLER_NO_SHOW_REASON_REQUIRED);
      }
    }

    if (orderStatus === OrderStatus.CANCEL_REFUND_PENDING) {
      const reason = updateDto.sellerCancelRefundPendingReason?.trim();
      if (!reason) {
        throw new BadRequestException(
          ORDER_ERROR_MESSAGES.SELLER_CANCEL_REFUND_PENDING_REASON_REQUIRED,
        );
      }
    }

    const data: Prisma.OrderUpdateInput = { orderStatus };
    if (orderStatus === OrderStatus.PAYMENT_PENDING) {
      const at = new Date();
      data.paymentPendingAt = at;
      data.paymentPendingDeadlineAt = computePaymentPendingDeadline(at, order.pickupDate);
    }
    if (orderStatus === OrderStatus.CANCEL_COMPLETED && updateDto.sellerCancelReason) {
      data.sellerCancelReason = updateDto.sellerCancelReason.trim();
    }
    if (orderStatus === OrderStatus.NO_SHOW && updateDto.sellerNoShowReason) {
      data.sellerNoShowReason = updateDto.sellerNoShowReason.trim();
    }
    if (
      orderStatus === OrderStatus.CANCEL_REFUND_PENDING &&
      updateDto.sellerCancelRefundPendingReason
    ) {
      data.sellerCancelRefundPendingReason = updateDto.sellerCancelRefundPendingReason.trim();
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data,
    });

    this.orderLifecycleHookService.afterOrderStatusTransition({
      orderId,
      fromStatus: current,
      toStatus: orderStatus,
      source: ORDER_STATUS_TRANSITION_SOURCE.SELLER_STATUS_UPDATE,
    });

    return { id: orderId };
  }
}
