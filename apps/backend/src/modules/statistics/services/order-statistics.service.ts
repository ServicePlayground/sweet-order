import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";
import {
  ORDER_STATISTICS_INCLUDED_STATUSES,
  ORDER_STATISTICS_PRODUCT_NAME_FALLBACK,
  ORDER_STATISTICS_TOP_PRODUCTS_LIMIT,
} from "@apps/backend/modules/statistics/constants/order-statistics.constants";
import {
  OrderStatisticsOverviewRequestDto,
  OrderStatisticsOverviewResponseDto,
  OrderStatisticsProductStatDto,
} from "@apps/backend/modules/statistics/dto/order-statistics-overview.dto";
import { loadOrderStatisticsTimeBuckets } from "@apps/backend/modules/statistics/utils/order-statistics-time-buckets.util";
import { kstYmdRangeToUtcBounds } from "@apps/backend/modules/statistics/utils/statistics-datetime.util";

/**
 * 스토어 단위 주문 통계.
 * 픽업 완료 주문만 대상으로 기간·상품 랭킹·요일·시간대를 집계합니다.
 * 기간 경계는 `statistics-datetime.util`, 요일·시간 버킷은 DB 집계(`order-statistics-time-buckets.util`)에서 처리합니다.
 */
@Injectable()
export class OrderStatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 판매자용 주문 통계 개요 (GET /statistics/orders/overview).
   * 스토어 소유권을 확인한 뒤, 기간 내 `created_at` + 상태 필터로 주문을 모읍니다.
   */
  async getOverviewForSeller(
    query: OrderStatisticsOverviewRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<OrderStatisticsOverviewResponseDto> {
    const { storeId, startDate, endDate } = query;

    if (startDate > endDate) {
      throw new BadRequestException("startDate는 endDate보다 이전이어야 합니다.");
    }

    const { start, end } = kstYmdRangeToUtcBounds(startDate, endDate);

    const store = await this.prisma.store.findFirst({
      where: { id: storeId, userId: user.sub },
      select: { id: true },
    });
    if (!store) {
      throw new ForbiddenException(ORDER_ERROR_MESSAGES.STORE_NOT_OWNED);
    }

    const where: Prisma.OrderWhereInput = {
      storeId,
      createdAt: { gte: start, lte: end },
      orderStatus: { in: ORDER_STATISTICS_INCLUDED_STATUSES },
    };

    const [aggregate, productGroups, timeBuckets] = await Promise.all([
      this.prisma.order.aggregate({
        where,
        _sum: { totalPrice: true },
        _count: { _all: true },
      }),
      this.prisma.order.groupBy({
        by: ["productId"],
        where,
        _sum: { totalPrice: true },
        _count: { _all: true },
        _max: { productName: true },
      }),
      loadOrderStatisticsTimeBuckets(this.prisma, {
        storeId,
        start,
        end,
        orderStatuses: ORDER_STATISTICS_INCLUDED_STATUSES,
      }),
    ]);

    const totalSales = aggregate._sum.totalPrice ?? 0;
    const totalOrders = aggregate._count._all;

    const productsMapped: OrderStatisticsProductStatDto[] = productGroups.map((g) => ({
      productId: g.productId,
      productName: g._max.productName ?? ORDER_STATISTICS_PRODUCT_NAME_FALLBACK,
      revenue: g._sum.totalPrice ?? 0,
      orderCount: g._count._all,
    }));

    const topProductsByRevenue = [...productsMapped]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, ORDER_STATISTICS_TOP_PRODUCTS_LIMIT);

    const topProductsByOrders = [...productsMapped]
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, ORDER_STATISTICS_TOP_PRODUCTS_LIMIT);

    const {
      weekdaySales,
      weekdayOrders,
      hourlyOrders,
      weekdayPickupSales,
      weekdayPickupOrders,
      hourlyPickupOrders,
    } = timeBuckets;

    return {
      includedOrderStatuses: ORDER_STATISTICS_INCLUDED_STATUSES.map(String),
      totalSales,
      totalOrders,
      topProductsByRevenue,
      topProductsByOrders,
      weekdaySales,
      weekdayOrders,
      hourlyOrders,
      weekdayPickupSales,
      weekdayPickupOrders,
      hourlyPickupOrders,
    };
  }
}
