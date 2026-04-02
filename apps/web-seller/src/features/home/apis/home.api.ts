import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import type { SellerHomeDashboardDto } from "@/apps/web-seller/features/home/types/seller-home.dto";

/**
 * GET `/v1/seller/store/:storeId/home`
 * 최근 주문·오늘(Asia/Seoul) 픽업 예정·알림·피드를 한 번에 조회합니다.
 */
export const sellerHomeApi = {
  getDashboard: async (storeId: string): Promise<SellerHomeDashboardDto> => {
    const response = await sellerClient.get<{ data: SellerHomeDashboardDto }>(
      `/store/${storeId}/home`,
    );
    return response.data.data;
  },
};
