import { Module } from "@nestjs/common";
import { OrderModule } from "@apps/backend/modules/order/order.module";
import { FeedModule } from "@apps/backend/modules/feed/feed.module";
import { NotificationModule } from "@apps/backend/modules/notification/notification.module";
import { SellerHomeService } from "./seller-home.service";

/**
 * 판매자 스토어 홈 모듈
 *
 * 주문·알림·피드를 묶어 대시보드 데이터를 만드는 `SellerHomeService`를 둡니다.
 * HTTP 라우트는 `SellerApiModule`에 등록된 `SellerHomeController`에 둡니다.
 */
@Module({
  imports: [OrderModule, FeedModule, NotificationModule],
  providers: [SellerHomeService],
  exports: [SellerHomeService],
})
export class SellerHomeModule {}
