import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import type { OrderStatusTransitionPayload } from "@apps/backend/modules/order/types/order-lifecycle.types";
import { buildSellerOrderNotificationCopy } from "@apps/backend/modules/notification/utils/seller-order-notification-copy.util";
import { buildUserOrderNotificationCopy } from "@apps/backend/modules/notification/utils/user-order-notification-copy.util";
import { NotificationService } from "@apps/backend/modules/notification/services/notification.service";
import { NotificationGateway } from "@apps/backend/modules/notification/gateways/notification.gateway";
import { ConsumerOrderFcmPushService } from "@apps/backend/modules/fcm/services/consumer-order-fcm-push.service";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 주문 라이프사이클 훅에서 호출되어, 판매자·구매자 주문 알림을 처리합니다.
 *
 * 구매자 알림 발송 흐름:
 *   1. DB 저장 (UserNotification)
 *   2. Socket.IO 실시간 발송 → 앱 내 WebView가 포그라운드인 경우 즉시 수신
 *   3. FCM 푸시 발송       → 앱이 백그라운드이거나 종료된 경우 Flutter가 시스템 알림으로 표시
 */
@Injectable()
export class NotificationOrderDispatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
    private readonly consumerOrderFcmPushService: ConsumerOrderFcmPushService,
  ) {}

  async handleOrderStatusTransition(payload: OrderStatusTransitionPayload): Promise<void> {
    await this.dispatchSellerOrderNotification(payload);
    await this.dispatchUserOrderNotification(payload);
  }

  /**
   * 스토어 소유 판매자에게 SELLER_WEB 주문 알림 (설정 반영).
   */
  private async dispatchSellerOrderNotification(
    payload: OrderStatusTransitionPayload,
  ): Promise<void> {
    try {
      const copy = buildSellerOrderNotificationCopy(payload);
      if (!copy) return;

      const order = await this.prisma.order.findUnique({
        where: { id: payload.orderId },
        select: {
          storeId: true,
          store: { select: { sellerId: true } },
        },
      });
      if (!order?.store?.sellerId) return;

      const sellerUserId = order.store.sellerId;
      const prefs = await this.notificationService.getOrCreatePreferenceSellerWeb(
        sellerUserId,
        order.storeId,
      );
      if (!prefs.orderNotificationsEnabled) return;

      const item = await this.notificationService.createSellerWebOrderNotification({
        recipientUserId: sellerUserId,
        title: copy.title,
        body: copy.body,
        storeId: order.storeId,
        orderId: payload.orderId,
      });

      this.notificationGateway.emitSellerNotification(sellerUserId, item);
    } catch (e) {
      LoggerUtil.log(
        `[NotificationOrderDispatch/seller] 실패 order=${payload.orderId}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  /**
   * 구매자에게 USER_WEB 주문 알림을 발송합니다.
   *
   * - Socket.IO: 앱 내 WebView가 포그라운드일 때 즉시 수신
   * - FCM 푸시: 앱이 백그라운드·종료 상태일 때 Flutter가 시스템 알림으로 표시
   */
  private async dispatchUserOrderNotification(
    payload: OrderStatusTransitionPayload,
  ): Promise<void> {
    try {
      const copy = buildUserOrderNotificationCopy(payload);
      if (!copy) return;

      const order = await this.prisma.order.findUnique({
        where: { id: payload.orderId },
        select: { consumerId: true, storeId: true },
      });
      if (!order) return;

      // 1) DB 저장
      const item = await this.notificationService.createUserWebOrderNotification({
        recipientUserId: order.consumerId,
        title: copy.title,
        body: copy.body,
        storeId: order.storeId,
        orderId: payload.orderId,
      });

      // 2) Socket.IO 실시간 발송 (앱 내 WebView 포그라운드 대응)
      this.notificationGateway.emitUserOrderNotification(order.consumerId, item);

      // 3) FCM 푸시 발송 (Flutter 백그라운드/종료 대응)
      const prefs = await this.notificationService.getOrCreatePreferenceUserWeb(order.consumerId);
      if (prefs.pushNotificationsEnabled) {
        await this.consumerOrderFcmPushService.sendOrderPush({
          consumerId: order.consumerId,
          title: copy.title,
          body: copy.body,
          orderId: payload.orderId,
        });
      }
    } catch (e) {
      LoggerUtil.log(
        `[NotificationOrderDispatch/user] 실패 order=${payload.orderId}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}
