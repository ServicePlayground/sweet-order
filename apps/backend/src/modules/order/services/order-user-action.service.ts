import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  ORDER_ERROR_MESSAGES,
  OrderStatus,
} from "@apps/backend/modules/order/constants/order.constants";
import { OrderOwnershipUtil } from "@apps/backend/modules/order/utils/order-ownership.util";
import { OrderAutomationService } from "@apps/backend/modules/order/services/order-automation.service";
import {
  isPaymentPendingWindowExpired,
  paymentPendingWindowStart,
} from "@apps/backend/modules/order/utils/order-datetime.util";
import {
  ORDER_PRE_PAYMENT_WINDOW_STATUSES,
  USER_CANCEL_REFUND_REQUEST_SOURCE_STATUSES,
} from "@apps/backend/modules/order/utils/order-status-transition.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";
import { OrderLifecycleHookService } from "@apps/backend/modules/order/services/order-lifecycle-hook.service";
import { ORDER_STATUS_TRANSITION_SOURCE } from "@apps/backend/modules/order/types/order-lifecycle.types";
import {
  CancelOrderBeforePaymentRequestDto,
  RequestCancelRefundRequestDto,
} from "@apps/backend/modules/order/dto/order-user-action.dto";

/**
 * 사용자(구매자)가 호출하는 주문 액션 전용 서비스.
 *
 * 공통 흐름: 소유권 검증 → `syncOrderLifecycleById`로 픽업일·입금 만료 등 자동 전환 반영 후 DB 재조회 → 상태 검증 및 업데이트.
 */
@Injectable()
export class OrderUserActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderAutomationService: OrderAutomationService,
    private readonly orderLifecycleHookService: OrderLifecycleHookService,
  ) {}

  /**
   * 사용자가 입금을 완료했다고 표시합니다. `PAYMENT_PENDING` → `PAYMENT_COMPLETED` (예약신청 단계에서는 불가).
   * 소유권 검증 → `syncOrderLifecycleById` → 조회 → 검증 → 갱신 → 훅 순서입니다.
   */
  async markPaymentCompleted(orderId: string, userId: string): Promise<{ id: string }> {
    await OrderOwnershipUtil.verifyOrderUserOwnership(this.prisma, orderId, userId);
    await this.orderAutomationService.syncOrderLifecycleById(orderId);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { orderStatus: true, createdAt: true, paymentPendingAt: true },
    });
    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    const now = new Date();
    const current = order.orderStatus as OrderStatus;

    if (current === OrderStatus.CANCEL_COMPLETED) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.PAYMENT_PENDING_EXPIRED);
    }

    if (current === OrderStatus.PAYMENT_PENDING) {
      const windowStart = paymentPendingWindowStart(order.paymentPendingAt, order.createdAt);
      if (isPaymentPendingWindowExpired(windowStart, now)) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: OrderStatus.CANCEL_COMPLETED },
        });
        this.orderLifecycleHookService.afterOrderStatusTransition({
          orderId,
          fromStatus: OrderStatus.PAYMENT_PENDING,
          toStatus: OrderStatus.CANCEL_COMPLETED,
          source: ORDER_STATUS_TRANSITION_SOURCE.USER_ACTION,
        });
        throw new BadRequestException(ORDER_ERROR_MESSAGES.PAYMENT_PENDING_EXPIRED);
      }
    }

    if (current !== OrderStatus.PAYMENT_PENDING) {
      LoggerUtil.log(`입금완료 처리 실패: 상태 불일치 - orderId: ${orderId}, status: ${current}`);
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_USER_ORDER_ACTION);
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: OrderStatus.PAYMENT_COMPLETED },
    });
    this.orderLifecycleHookService.afterOrderStatusTransition({
      orderId,
      fromStatus: OrderStatus.PAYMENT_PENDING,
      toStatus: OrderStatus.PAYMENT_COMPLETED,
      source: ORDER_STATUS_TRANSITION_SOURCE.USER_ACTION,
    });
    return { id: orderId };
  }

  /**
   * 입금 전 사용자 취소. `RESERVATION_REQUESTED` 또는 `PAYMENT_PENDING` → `CANCEL_COMPLETED`.
   * 소유권 검증 → `syncOrderLifecycleById` → 조회 → 검증 → 갱신 → 훅 순서입니다.
   */
  async cancelBeforePayment(
    orderId: string,
    userId: string,
    dto: CancelOrderBeforePaymentRequestDto,
  ): Promise<{ id: string }> {
    await OrderOwnershipUtil.verifyOrderUserOwnership(this.prisma, orderId, userId);
    await this.orderAutomationService.syncOrderLifecycleById(orderId);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    const beforeCancel = order.orderStatus as OrderStatus;
    if (!ORDER_PRE_PAYMENT_WINDOW_STATUSES.has(beforeCancel)) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_USER_ORDER_ACTION);
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: OrderStatus.CANCEL_COMPLETED,
        userCancelReason: dto.reason,
      },
    });
    this.orderLifecycleHookService.afterOrderStatusTransition({
      orderId,
      fromStatus: beforeCancel,
      toStatus: OrderStatus.CANCEL_COMPLETED,
      source: ORDER_STATUS_TRANSITION_SOURCE.USER_ACTION,
    });
    return { id: orderId };
  }

  /**
   * 취소·환불 요청. `USER_CANCEL_REFUND_REQUEST_SOURCE_STATUSES`에서만 허용.
   * 성공 시 `CANCEL_REFUND_PENDING`(취소환불대기)으로 전환됩니다.
   */
  async requestRefund(
    orderId: string,
    userId: string,
    dto: RequestCancelRefundRequestDto,
  ): Promise<{ id: string }> {
    await OrderOwnershipUtil.verifyOrderUserOwnership(this.prisma, orderId, userId);
    await this.orderAutomationService.syncOrderLifecycleById(orderId);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(ORDER_ERROR_MESSAGES.NOT_FOUND);
    }

    const fromStatus = order.orderStatus as OrderStatus;
    if (!USER_CANCEL_REFUND_REQUEST_SOURCE_STATUSES.has(fromStatus)) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_USER_ORDER_ACTION);
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: OrderStatus.CANCEL_REFUND_PENDING,
        refundRequestReason: dto.reason,
        refundBankName: dto.bankName,
        refundBankAccountNumber: dto.bankAccountNumber,
        refundAccountHolderName: dto.accountHolderName,
      },
    });
    this.orderLifecycleHookService.afterOrderStatusTransition({
      orderId,
      fromStatus,
      toStatus: OrderStatus.CANCEL_REFUND_PENDING,
      source: ORDER_STATUS_TRANSITION_SOURCE.USER_ACTION,
    });
    return { id: orderId };
  }
}
