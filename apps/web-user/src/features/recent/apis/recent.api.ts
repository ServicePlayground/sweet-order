import { userClient } from "@/apps/web-user/common/config/axios.config";
import { PaginationMeta } from "@/apps/web-user/common/types/api.type";
import { Product } from "@/apps/web-user/features/product/types/product.type";

export interface RecentProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export const recentApi = {
  getRecentProducts: async (params: {
    page: number;
    limit: number;
    sortBy: string;
  }): Promise<RecentProductsResponse> => {
    const response = await userClient.get("/mypage/recent/products", { params });
    return response.data.data;
  },
};
