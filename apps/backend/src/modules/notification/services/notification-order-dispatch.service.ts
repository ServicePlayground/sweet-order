import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import type { OrderStatusTransitionPayload } from "@apps/backend/modules/order/types/order-lifecycle.types";
import { buildSellerOrderNotificationCopy } from "@apps/backend/modules/notification/utils/seller-order-notification-copy.util";
import { buildUserOrderNotificationCopy } from "@apps/backend/modules/notification/utils/user-order-notification-copy.util";
import { NotificationService } from "@apps/backend/modules/notification/services/notification.service";
import { NotificationGateway } from "@apps/backend/modules/notification/gateways/notification.gateway";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 주문 라이프사이클 훅에서 호출되어, 판매자·구매자 주문 알림을 DB에 저장하고 소켓으로 전달합니다.
 */
@Injectable()
export class NotificationOrderDispatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
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
      if (!copy) {
        return;
      }

      const order = await this.prisma.order.findUnique({
        where: { id: payload.orderId },
        select: {
          storeId: true,
          store: { select: { sellerId: true } },
        },
      });
      if (!order?.store?.sellerId) {
        return;
      }

      const sellerUserId = order.store.sellerId;
      const prefs = await this.notificationService.getOrCreatePreferenceSellerWeb(
        sellerUserId,
        order.storeId,
      );
      if (!prefs.orderNotificationsEnabled) {
        return;
      }

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
   * 주문자(USER)에게 USER_WEB 주문 알림 (실시간·목록용 DB 저장).
   */
  private async dispatchUserOrderNotification(
    payload: OrderStatusTransitionPayload,
  ): Promise<void> {
    try {
      const copy = buildUserOrderNotificationCopy(payload);
      if (!copy) {
        return;
      }

      const order = await this.prisma.order.findUnique({
        where: { id: payload.orderId },
        select: { consumerId: true, storeId: true },
      });
      if (!order) {
        return;
      }

      const item = await this.notificationService.createUserWebOrderNotification({
        recipientUserId: order.consumerId,
        title: copy.title,
        body: copy.body,
        storeId: order.storeId,
        orderId: payload.orderId,
      });

      this.notificationGateway.emitUserOrderNotification(order.consumerId, item);
    } catch (e) {
      LoggerUtil.log(
        `[NotificationOrderDispatch/user] 실패 order=${payload.orderId}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}
