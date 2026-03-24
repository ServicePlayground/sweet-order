import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";
import {
  isPickupPendingDue,
  isPaymentPendingWindowExpired,
  PAYMENT_PENDING_VALIDITY_MS,
} from "@apps/backend/modules/order/utils/order-datetime.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";
import { OrderLifecycleHookService } from "@apps/backend/modules/order/services/order-lifecycle-hook.service";
import { ORDER_STATUS_TRANSITION_SOURCE } from "@apps/backend/modules/order/types/order-lifecycle.types";

/**
 * 입금대기 만료, 픽업 시각 도달 자동 전환 등 주문 상태 자동화
 */
@Injectable()
export class OrderAutomationService implements OnModuleInit, OnModuleDestroy {
  private batchTimer?: ReturnType<typeof setInterval>;
  private readonly batchIntervalMs = 5 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderLifecycleHookService: OrderLifecycleHookService,
  ) {}

  onModuleInit(): void {
    void this.runBatchTransitions();
    this.batchTimer = setInterval(() => void this.runBatchTransitions(), this.batchIntervalMs);
  }

  onModuleDestroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
  }

  /**
   * 단일 주문에 대해 만료·픽업 전환 규칙을 즉시 적용 (최신 상태 보장)
   * 만료 규칙: 입금대기 상태에서 12시간이 지난 주문을 취소완료로 전환합니다.
   * 픽업 규칙: 예약확정 상태에서 픽업 시각이 도달했거나 지난 주문을 픽업대기로 전환합니다.
   */
  async syncOrderLifecycleById(orderId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return;
    }
    const now = new Date();

    if (order.orderStatus === OrderStatus.PAYMENT_PENDING) {
      if (isPaymentPendingWindowExpired(order.createdAt, now)) {
        const expireCreatedBefore = new Date(now.getTime() - PAYMENT_PENDING_VALIDITY_MS);
        const { count } = await this.prisma.order.updateMany({
          where: {
            id: orderId,
            orderStatus: OrderStatus.PAYMENT_PENDING,
            createdAt: { lte: expireCreatedBefore },
          },
          data: { orderStatus: OrderStatus.CANCEL_COMPLETED },
        });
        if (count === 1) {
          this.orderLifecycleHookService.afterOrderStatusTransition({
            orderId,
            fromStatus: OrderStatus.PAYMENT_PENDING,
            toStatus: OrderStatus.CANCEL_COMPLETED,
            source: ORDER_STATUS_TRANSITION_SOURCE.AUTOMATION_SYNC,
          });
        }
      }
      return;
    }

    if (order.orderStatus === OrderStatus.CONFIRMED && order.pickupDate) {
      if (isPickupPendingDue(order.pickupDate, now)) {
        const { count } = await this.prisma.order.updateMany({
          where: {
            id: orderId,
            orderStatus: OrderStatus.CONFIRMED,
          },
          data: { orderStatus: OrderStatus.PICKUP_PENDING },
        });
        if (count === 1) {
          this.orderLifecycleHookService.afterOrderStatusTransition({
            orderId,
            fromStatus: OrderStatus.CONFIRMED,
            toStatus: OrderStatus.PICKUP_PENDING,
            source: ORDER_STATUS_TRANSITION_SOURCE.AUTOMATION_SYNC,
          });
        }
      }
    }
  }

  /**
   * 앱(모듈)이 기동된 직후 5분마다 실행되며 주문 상태 자동화
   * 전체 주문에 대해 `syncOrderLifecycleById`와 **같은 조건**으로 상태를 맞춥니다.
   */
  async runBatchTransitions(): Promise<void> {
    try {
      const now = new Date();
      const expireCreatedBefore = new Date(now.getTime() - PAYMENT_PENDING_VALIDITY_MS);

      const paymentExpiredCandidates = await this.prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.PAYMENT_PENDING,
          createdAt: { lte: expireCreatedBefore },
        },
        select: { id: true },
      });

      for (const { id } of paymentExpiredCandidates) {
        // findMany 직후 상태가 바뀌었을 수 있어, 갱신 시 동일 조건으로 한 번 더 좁힘 + count로 실제 반영 여부 확인
        const { count } = await this.prisma.order.updateMany({
          where: {
            id,
            orderStatus: OrderStatus.PAYMENT_PENDING,
            createdAt: { lte: expireCreatedBefore },
          },
          data: { orderStatus: OrderStatus.CANCEL_COMPLETED },
        });
        if (count === 1) {
          this.orderLifecycleHookService.afterOrderStatusTransition({
            orderId: id,
            fromStatus: OrderStatus.PAYMENT_PENDING,
            toStatus: OrderStatus.CANCEL_COMPLETED,
            source: ORDER_STATUS_TRANSITION_SOURCE.AUTOMATION_BATCH,
          });
        }
      }

      // sync의 `CONFIRMED && pickupDate && isPickupPendingDue`와 동일
      const confirmedWithPickup = await this.prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.CONFIRMED,
          pickupDate: { lte: now },
        },
        select: { id: true, pickupDate: true },
      });

      for (const row of confirmedWithPickup) {
        if (!row.pickupDate || !isPickupPendingDue(row.pickupDate, now)) {
          continue;
        }
        // `syncOrderLifecycleById`와 경합해도 훅은 실제 전환이 1건만 일어났을 때만 발화
        const { count } = await this.prisma.order.updateMany({
          where: {
            id: row.id,
            orderStatus: OrderStatus.CONFIRMED,
          },
          data: { orderStatus: OrderStatus.PICKUP_PENDING },
        });
        if (count === 1) {
          this.orderLifecycleHookService.afterOrderStatusTransition({
            orderId: row.id,
            fromStatus: OrderStatus.CONFIRMED,
            toStatus: OrderStatus.PICKUP_PENDING,
            source: ORDER_STATUS_TRANSITION_SOURCE.AUTOMATION_BATCH,
          });
        }
      }
    } catch (e) {
      LoggerUtil.log(`주문 자동 전환 배치 실패: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  /**
   * 목록 페이지에 포함된 주문에 대해 `syncOrderLifecycleById`를 병렬 적용합니다.
   * 호출부에서 동일 조건으로 `findMany`를 한 번 더 하면 상세 조회와 같은 시점의 상태를 맞출 수 있습니다.
   */
  async syncOrderLifecycleForIds(orderIds: string[]): Promise<void> {
    if (orderIds.length === 0) {
      return;
    }
    await Promise.all(orderIds.map((id) => this.syncOrderLifecycleById(id)));
  }
}
