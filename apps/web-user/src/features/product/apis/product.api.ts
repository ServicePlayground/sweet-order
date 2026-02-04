import { userClient } from "@/apps/web-user/common/config/axios.config";
import {
  ProductListResponse,
  GetProductsParams,
  Product,
  ReviewListResponse,
  GetReviewsParams,
} from "@/apps/web-user/features/product/types/product.type";
import { MessageResponse } from "@/apps/web-user/common/types/api.type";

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
  // 상품 좋아요 추가
  addProductLike: async (productId: string): Promise<MessageResponse> => {
    const response = await userClient.post(`/products/${productId}/like`);
    return response.data.data;
  },
  // 상품 좋아요 삭제
  removeProductLike: async (productId: string): Promise<MessageResponse> => {
    const response = await userClient.delete(`/products/${productId}/like`);
    return response.data.data;
  },
  // 상품 좋아요 여부 확인
  getProductIsLiked: async (productId: string): Promise<{ isLiked: boolean }> => {
    const response = await userClient.get(`/products/${productId}/is-liked`);
    return response.data.data;
  },
  // 상품 후기 목록 조회
  getProductReviews: async ({
    productId,
    ...params
  }: GetReviewsParams): Promise<ReviewListResponse> => {
    const response = await userClient.get(`/products/${productId}/reviews`, { params });
    return response.data.data;
  },
};
