import { apiClient } from "@/apps/web-user/common/config/axios.config";
import {
  ProductListResponse,
  GetProductsParams,
} from "@/apps/web-user/features/product/types/product.type";

export const productApi = {
  // 상품 목록 조회 (무한 스크롤)
  getProducts: async (params: GetProductsParams): Promise<ProductListResponse> => {
    const response = await apiClient.get("/products", { params });
    return response.data.data;
  },
};