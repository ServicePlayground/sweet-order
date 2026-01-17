import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ICreateProductRequest,
  ICreateProductResponse,
  IUpdateProductRequest,
  ProductListResponse,
  IGetProductsListParams,
  IProductDetail,
} from "@/apps/web-seller/features/product/types/product.type";
import { MessageResponse } from "@/apps/web-seller/common/types/api.type";

export const productApi = {
  // 상품 등록
  createProduct: async (request: ICreateProductRequest): Promise<ICreateProductResponse> => {
    const response = await sellerClient.post("/products", request);
    return response.data.data;
  },
  // 판매자용 상품 목록 조회 (무한 스크롤)
  getProducts: async (params: IGetProductsListParams): Promise<ProductListResponse> => {
    const response = await sellerClient.get("/products", { params });
    return response.data.data;
  },
  // 판매자용 상품 상세 조회
  getProductDetail: async (productId: string): Promise<IProductDetail> => {
    const response = await sellerClient.get(`/products/${productId}`);
    return response.data.data;
  },
  // 판매자용 상품 수정
  updateProduct: async (
    productId: string,
    request: IUpdateProductRequest,
  ): Promise<ICreateProductResponse> => {
    const response = await sellerClient.put(`/products/${productId}`, request);
    return response.data.data;
  },
  // 판매자용 상품 삭제
  deleteProduct: async (productId: string): Promise<MessageResponse> => {
    const response = await sellerClient.delete(`/products/${productId}`);
    return response.data.data;
  },
};
