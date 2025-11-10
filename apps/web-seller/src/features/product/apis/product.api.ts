import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ICreateProductRequest,
  ICreateProductResponse,
} from "@/apps/web-seller/features/product/types/product.type";

export const productApi = {
  // 상품 등록
  createProduct: async (request: ICreateProductRequest): Promise<ICreateProductResponse> => {
    const response = await sellerClient.post("/products", request);
    return response.data.data;
  },
};

