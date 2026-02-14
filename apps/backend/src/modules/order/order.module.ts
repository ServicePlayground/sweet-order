import { Module } from "@nestjs/common";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { OrderService } from "@apps/backend/modules/order/order.service";
import { OrderCreateService } from "@apps/backend/modules/order/services/order-create.service";
import { OrderDetailService } from "@apps/backend/modules/order/services/order-detail.service";
import { OrderListService } from "@apps/backend/modules/order/services/order-list.service";
import { OrderUpdateService } from "@apps/backend/modules/order/services/order-update.service";

/**
 * 주문 모듈
 * 주문 관련 기능을 제공합니다.
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    OrderService,
    OrderCreateService,
    OrderDetailService,
    OrderListService,
    OrderUpdateService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
