import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { NotificationService } from "@apps/backend/modules/notification/services/notification.service";
import { NotificationOrderDispatchService } from "@apps/backend/modules/notification/services/notification-order-dispatch.service";
import { NotificationGateway } from "@apps/backend/modules/notification/gateways/notification.gateway";
import { FcmModule } from "@apps/backend/modules/fcm/fcm.module";

/**
 * 주문 알림 모듈
 * - NotificationService: 알림 저장·목록·설정·읽음 처리
 * - NotificationOrderDispatchService: 주문 상태 전환 → Socket.IO + FCM 발송
 * - NotificationGateway: Socket.IO `/notifications` (판매자·구매자)
 */
@Module({
  imports: [DatabaseModule, JwtModule, ConfigModule, FcmModule],
  providers: [NotificationService, NotificationGateway, NotificationOrderDispatchService],
  exports: [NotificationService, NotificationOrderDispatchService],
})
export class NotificationModule {}
