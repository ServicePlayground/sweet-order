/**
 * GET `/v1/seller/statistics/orders/overview` 응답 본문(`data` 필드).
 * 접수일(created_at)이 기간에 들어가고 상태가 `includedOrderStatuses`인 주문만 집계.
 */

export interface OrderStatisticsProductStatDto {
  productId: string;
  productName: string;
  revenue: number;
  orderCount: number;
}

export interface OrderStatisticsWeekdayDto {
  weekday: number;
  label: string;
  total: number;
}

export interface OrderStatisticsHourlyDto {
  hour: number;
  count: number;
}

export interface OrderStatisticsOverviewResponseDto {
  includedOrderStatuses: string[];
  totalSales: number;
  totalOrders: number;
  topProductsByRevenue: OrderStatisticsProductStatDto[];
  topProductsByOrders: OrderStatisticsProductStatDto[];
  weekdaySales: OrderStatisticsWeekdayDto[];
  weekdayOrders: OrderStatisticsWeekdayDto[];
  hourlyOrders: OrderStatisticsHourlyDto[];
  /** 픽업 예정일시(Asia/Seoul) 기준, 픽업일 없는 주문 제외 */
  weekdayPickupSales: OrderStatisticsWeekdayDto[];
  weekdayPickupOrders: OrderStatisticsWeekdayDto[];
  hourlyPickupOrders: OrderStatisticsHourlyDto[];
}

export interface OrderStatisticsOverviewQueryParams {
  storeId: string;
  startDate: string;
  endDate: string;
}
