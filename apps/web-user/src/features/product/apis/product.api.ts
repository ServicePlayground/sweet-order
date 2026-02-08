import { userClient } from "@/apps/web-user/common/config/axios.config";
import {
  ProductListResponse,
  GetProductsParams,
  Product,
} from "@/apps/web-user/features/product/types/product.type";

export const productApi = {
  // 상품 목록 조회 (무한 스크롤)
  getProducts: async (params: GetProductsParams): Promise<ProductListResponse> => {
    const response = await userClient.get("/products", { params });
    return response.data.data;
  },
  // 상품 상세 조회
  getProductDetail: async (productId: string): Promise<Product> => {
    const response = await userClient.get(`/products/${productId}`);
    return response.data.data;
  },
};
