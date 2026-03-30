import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import type { OrderStatusTransitionPayload } from "@apps/backend/modules/order/types/order-lifecycle.types";
import { buildSellerOrderNotificationCopy } from "@apps/backend/modules/notification/utils/seller-order-notification-copy.util";
import { NotificationService } from "@apps/backend/modules/notification/services/notification.service";
import { NotificationGateway } from "@apps/backend/modules/notification/gateways/notification.gateway";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 주문 라이프사이클 훅에서 호출되어, 판매자용 주문 알림을 DB에 저장하고 소켓으로 푸시합니다.
 * 문구는 `buildSellerOrderNotificationCopy`(상태 전환 payload 기준)에서만 결정합니다.
 */
@Injectable()
export class NotificationOrderDispatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * 주문 상태 전환 시 스토어 소유 판매자에게 SELLER_WEB 주문 알림을 저장하고, 설정에 따라 실시간 전달합니다.
   */
  async handleOrderStatusTransition(payload: OrderStatusTransitionPayload): Promise<void> {
    try {
      // 1) 이 전환에 해당하는 알림 문구가 없으면 조용히 종료 (알림 대상 아님)
      const copy = buildSellerOrderNotificationCopy(payload);
      if (!copy) {
        return;
      }

      // 2) 주문·스토어·판매자(user) 연결 확인
      const order = await this.prisma.order.findUnique({
        where: { id: payload.orderId },
        select: {
          storeId: true,
          store: { select: { userId: true } },
        },
      });
      if (!order?.store?.userId) {
        return;
      }

      const sellerUserId = order.store.userId;
      // 3) 스토어별 판매자 알림 설정 (미수신이면 저장·푸시 모두 생략)
      const prefs = await this.notificationService.getOrCreatePreferenceSellerWeb(sellerUserId, order.storeId);
      if (!prefs.orderNotificationsEnabled) {
        return;
      }

      // 4) DB에 알림 행 저장
      const item = await this.notificationService.createSellerWebOrderNotification({
        recipientUserId: sellerUserId,
        title: copy.title,
        body: copy.body,
        storeId: order.storeId,
        orderId: payload.orderId,
      });

      // 5) 연결된 판매자 소켓에 브로드캐스트 (목록 갱신 트리거). 토스트·알림음은 클라이언트 설정
      this.notificationGateway.emitSellerNotification(sellerUserId, item);
    } catch (e) {
      LoggerUtil.log(
        `[NotificationOrderDispatch] 실패 order=${payload.orderId}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

}
