import type {
  OrderStatisticsHourlyDto,
  OrderStatisticsWeekdayDto,
} from "@/apps/web-seller/features/statistics/types/statistics.dto";

/** API `hourlyOrders` 등 → `HourlyOrderChart`용 길이 24 배열 */
export function hourlyOrdersToValues24(
  hourly: OrderStatisticsHourlyDto[] | undefined | null,
): number[] {
  const values = Array.from({ length: 24 }, () => 0);
  if (!hourly?.length) {
    return values;
  }
  for (const row of hourly) {
    if (row.hour >= 0 && row.hour <= 23) {
      values[row.hour] = row.count;
    }
  }
  return values;
}

/** 요일별 막대: 합계가 0인 요일은 제외해 표시 */
export function weekdayRowsToMetricItems(
  rows: OrderStatisticsWeekdayDto[] | undefined | null,
  filterZeroTotals = true,
): { label: string; value: number }[] {
  if (!rows?.length) {
    return [];
  }
  const list = filterZeroTotals ? rows.filter((r) => r.total > 0) : rows;
  return list.map((r) => ({ label: r.label, value: r.total }));
}
