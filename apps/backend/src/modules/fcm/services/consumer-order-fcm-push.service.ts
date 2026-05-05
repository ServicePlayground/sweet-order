import { Injectable } from "@nestjs/common";
import { ConsumerFcmPushService } from "@apps/backend/modules/fcm/services/consumer-fcm-push.service";
import {
  FCM_ANDROID_CHANNEL_ID,
  FCM_PUSH_TYPE,
  SendConsumerOrderPushParams,
} from "@apps/backend/modules/fcm/types/fcm-push.types";

/**
 * 주문 상태 알림용 구매자 FCM 푸시 발송 서비스.
 * 공용 ConsumerFcmPushService를 이용해 주문 카테고리 페이로드를 구성합니다.
 */
@Injectable()
export class ConsumerOrderFcmPushService {
  constructor(private readonly consumerFcmPushService: ConsumerFcmPushService) {}

  /**
   * 구매자의 등록된 FCM 토큰에 주문 푸시를 발송합니다.
   * Flutter `RemoteMessage.data`로 orderId·type이 전달되어,
   * Flutter 앱에서 알림 탭 시 주문 상세 화면으로 이동할 수 있습니다.
   */
  async sendOrderPush(params: SendConsumerOrderPushParams): Promise<void> {
    await this.consumerFcmPushService.sendToConsumer({
      consumerId: params.consumerId,
      title: params.title,
      body: params.body,
      data: {
        type: FCM_PUSH_TYPE.ORDER_NOTIFICATION,
        orderId: params.orderId,
      },
      androidChannelId: FCM_ANDROID_CHANNEL_ID.ORDER_NOTIFICATION,
    });
  }
}
