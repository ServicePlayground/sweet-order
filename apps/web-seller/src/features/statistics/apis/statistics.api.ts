import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  OrderStatisticsOverviewQueryParams,
  OrderStatisticsOverviewResponseDto,
} from "@/apps/web-seller/features/statistics/types/statistics.dto";

/**
 * GET `/v1/seller/statistics/orders/overview`
 * 쿼리: storeId, startDate, endDate (YYYY-MM-DD, Asia/Seoul 달력). 픽업 완료 주문만 집계.
 */
export const statisticsApi = {
  getOverview: async (
    params: OrderStatisticsOverviewQueryParams,
  ): Promise<OrderStatisticsOverviewResponseDto> => {
    const response = await sellerClient.get<{ data: OrderStatisticsOverviewResponseDto }>(
      "/statistics/orders/overview",
      { params },
    );
    return response.data.data;
  },
};
