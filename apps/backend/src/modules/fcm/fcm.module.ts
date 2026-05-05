import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { FcmService } from "@apps/backend/modules/fcm/fcm.service";
import { ConsumerFcmTokenService } from "@apps/backend/modules/fcm/services/consumer-fcm-token.service";
import { ConsumerFcmPushService } from "@apps/backend/modules/fcm/services/consumer-fcm-push.service";
import { ConsumerOrderFcmPushService } from "@apps/backend/modules/fcm/services/consumer-order-fcm-push.service";

/**
 * Firebase Cloud Messaging 모듈
 * - FcmService: Firebase Admin SDK 초기화 및 구매자 앱(Flutter) FCM 푸시 발송
 * - ConsumerFcmPushService: 구매자 대상 공용 푸시 발송 + 무효 토큰 정리
 * - ConsumerOrderFcmPushService: 주문 알림 전용 페이로드 구성
 * - 환경변수 미설정 시 비활성화 상태로 동작 (오류 없이 skip)
 */
@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [
    FcmService,
    ConsumerFcmTokenService,
    ConsumerFcmPushService,
    ConsumerOrderFcmPushService,
  ],
  exports: [
    FcmService,
    ConsumerFcmTokenService,
    ConsumerFcmPushService,
    ConsumerOrderFcmPushService,
  ],
})
export class FcmModule {}
