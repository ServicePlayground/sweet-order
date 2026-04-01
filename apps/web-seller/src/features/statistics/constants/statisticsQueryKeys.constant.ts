import type { OrderStatisticsOverviewQueryParams } from "@/apps/web-seller/features/statistics/types/statistics.dto";

export const statisticsQueryKeys = {
  all: ["statistics"] as const,
  overview: (
    params: Pick<OrderStatisticsOverviewQueryParams, "storeId" | "startDate" | "endDate">,
  ) => ["statistics", "overview", params.storeId, params.startDate, params.endDate] as const,
} as const;
