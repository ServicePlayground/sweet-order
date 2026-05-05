import { Injectable } from "@nestjs/common";
import { ConsumerFcmTokenService } from "@apps/backend/modules/fcm/services/consumer-fcm-token.service";
import { FcmService } from "@apps/backend/modules/fcm/fcm.service";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";
import { SentryUtil } from "@apps/backend/common/utils/sentry.util";
import type { SendConsumerPushParams } from "@apps/backend/modules/fcm/types/fcm-push.types";

/**
 * 구매자 대상 공용 FCM 푸시 발송 서비스.
 * - 소비자 토큰 조회
 * - FCM 멀티캐스트 발송
 * - 무효 토큰 정리
 */
@Injectable()
export class ConsumerFcmPushService {
  constructor(
    private readonly consumerFcmTokenService: ConsumerFcmTokenService,
    private readonly fcmService: FcmService,
  ) {}

  async sendToConsumer(params: SendConsumerPushParams): Promise<void> {
    if (!this.fcmService.isEnabled) {
      return;
    }

    try {
      const tokens = await this.consumerFcmTokenService.getTokensByConsumerId(params.consumerId);
      if (tokens.length === 0) {
        return;
      }

      const { invalidTokens } = await this.fcmService.sendToTokens({
        tokens,
        title: params.title,
        body: params.body,
        data: params.data,
        androidChannelId: params.androidChannelId,
      });

      if (invalidTokens.length === 0) {
        return;
      }

      await this.consumerFcmTokenService.removeInvalidTokens(invalidTokens);
    } catch (e) {
      LoggerUtil.log(
        `[ConsumerFcmPushService] 실패 consumer=${params.consumerId}: ${e instanceof Error ? e.message : String(e)}`,
      );
      SentryUtil.captureException(e, "error", {
        module: "consumer-fcm-push",
        operation: "send-to-consumer",
        consumerId: params.consumerId,
      });
    }
  }
}
