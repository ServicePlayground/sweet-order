import { Injectable } from "@nestjs/common";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";
import type { OrderStatusTransitionPayload } from "@apps/backend/modules/order/types/order-lifecycle.types";
import { NotificationOrderDispatchService } from "@apps/backend/modules/notification/services/notification-order-dispatch.service";

/**
 * 주문 상태 전환 후 후처리 확장 지점.
 * 푸시/알림톡, @nestjs/event-emitter, 메시지 큐, Outbox 테이블 등은 여기서 연결합니다.
 * HTTP 응답을 막지 않도록 비동기로만 이어집니다.
 */
@Injectable()
export class OrderLifecycleHookService {
  constructor(private readonly notificationOrderDispatchService: NotificationOrderDispatchService) {}

  afterOrderStatusTransition(payload: OrderStatusTransitionPayload): void {
    void this.dispatchAsync(payload);
    void this.notificationOrderDispatchService.handleOrderStatusTransition(payload);
  }

  private async dispatchAsync(payload: OrderStatusTransitionPayload): Promise<void> {
    LoggerUtil.log(
      `[OrderLifecycle] ${payload.source} order=${payload.orderId} ${payload.fromStatus} → ${payload.toStatus}`,
    );
  }
}
