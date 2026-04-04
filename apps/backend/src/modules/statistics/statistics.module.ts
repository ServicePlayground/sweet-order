import { Module } from "@nestjs/common";
import { DatabaseModule } from "@apps/backend/infra/database/database.module";
import { OrderStatisticsService } from "@apps/backend/modules/statistics/services/order-statistics.service";

/**
 * 통계 모듈
 *
 * 스토어·판매자 관점 집계 API의 도메인 로직을 둡니다.
 * 현재는 주문 통계(`OrderStatisticsService`)만 포함하며, 이후 상품 통계 등을 같은 모듈에 서비스로 추가하면 됩니다.
 */
@Module({
  imports: [DatabaseModule],
  providers: [OrderStatisticsService],
  exports: [OrderStatisticsService],
})
export class StatisticsModule {}
