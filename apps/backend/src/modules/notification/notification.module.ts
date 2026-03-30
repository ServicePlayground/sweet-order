import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { NotificationService } from "@apps/backend/modules/notification/services/notification.service";
import { NotificationOrderDispatchService } from "@apps/backend/modules/notification/services/notification-order-dispatch.service";
import { NotificationGateway } from "@apps/backend/modules/notification/gateways/notification.gateway";

/**
 * 판매자 알림 모듈
 * - NotificationService / NotificationOrderDispatchService: 저장·목록·설정
 * - NotificationGateway: Socket.IO `/notifications`
 */
@Module({
  imports: [DatabaseModule, JwtModule, ConfigModule],
  providers: [NotificationService, NotificationGateway, NotificationOrderDispatchService],
  exports: [NotificationService, NotificationOrderDispatchService],
})
export class NotificationModule {}
