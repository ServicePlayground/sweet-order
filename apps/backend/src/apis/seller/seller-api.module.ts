import { Module } from "@nestjs/common";
import { ProductModule } from "@apps/backend/modules/product/product.module";
import { SellerProductController } from "./controllers/product.controller";
import { BusinessModule } from "@apps/backend/modules/business/business.module";
import { SellerBusinessController } from "./controllers/business.controller";
import { StoreModule } from "@apps/backend/modules/store/store.module";
import { SellerStoreController } from "@apps/backend/apis/seller/controllers/store.controller";
import { ChatModule } from "@apps/backend/modules/chat/chat.module";
import { SellerChatController } from "./controllers/chat.controller";
import { FeedModule } from "@apps/backend/modules/feed/feed.module";
import { SellerFeedController } from "./controllers/feed.controller";
import { OrderModule } from "@apps/backend/modules/order/order.module";
import { StatisticsModule } from "@apps/backend/modules/statistics/statistics.module";
import { NotificationModule } from "@apps/backend/modules/notification/notification.module";
import { SellerOrderController } from "@apps/backend/apis/seller/controllers/order.controller";
import { SellerStatisticsController } from "@apps/backend/apis/seller/controllers/statistics.controller";
import { SellerNotificationController } from "@apps/backend/apis/seller/controllers/notification.controller";
import { SellerHomeController } from "@apps/backend/apis/seller/controllers/home.controller";
import { SellerHomeModule } from "@apps/backend/modules/seller-home/seller-home.module";

/**
 * Seller API 모듈
 *
 * Seller 관련 API를 제공합니다.
 */
@Module({
  imports: [
    ProductModule,
    BusinessModule,
    StoreModule,
    ChatModule,
    FeedModule,
    OrderModule,
    StatisticsModule,
    NotificationModule,
    SellerHomeModule,
  ],
  controllers: [
    SellerProductController,
    SellerBusinessController,
    SellerStoreController,
    SellerChatController,
    SellerFeedController,
    SellerOrderController,
    SellerStatisticsController,
    SellerNotificationController,
    SellerHomeController,
  ],
})
export class SellerApiModule {}
