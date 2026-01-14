import { sellerClient, userClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ICreateProductRequest,
  ICreateProductResponse,
  ProductListResponse,
  GetProductsParams,
} from "@/apps/web-seller/features/product/types/product.type";

export const productApi = {
  // 상품 등록
  createProduct: async (request: ICreateProductRequest): Promise<ICreateProductResponse> => {
    const response = await sellerClient.post("/products", request);
    return response.data.data;
  },
  // 상품 목록 조회 (무한 스크롤)
  getProducts: async (params: GetProductsParams): Promise<ProductListResponse> => {
    const response = await userClient.get("/products", { params });
    return response.data.data;
  },
};
