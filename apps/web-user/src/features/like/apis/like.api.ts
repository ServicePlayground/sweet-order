import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import { MessageResponse, PaginationMeta } from "@/apps/web-user/common/types/api.type";
import { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import { Product } from "@/apps/web-user/features/product/types/product.type";

export interface LikedStoresResponse {
  data: StoreInfo[];
  meta: PaginationMeta;
}

export interface LikedProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export const likeApi = {
  // 좋아요한 스토어 목록 조회
  getLikedStores: async (params: {
    page: number;
    limit: number;
    sortBy: string;
  }): Promise<LikedStoresResponse> => {
    const response = await consumerClient.get("/mypage/likes/stores", { params });
    return response.data.data;
  },
  // 좋아요한 상품 목록 조회
  getLikedProducts: async (params: {
    page: number;
    limit: number;
    sortBy: string;
  }): Promise<LikedProductsResponse> => {
    const response = await consumerClient.get("/mypage/likes/products", { params });
    return response.data.data;
  },
  // 상품 좋아요 추가
  addProductLike: async (productId: string): Promise<MessageResponse> => {
    const response = await consumerClient.post(`/products/${productId}/like`);
    return response.data.data;
  },
  // 상품 좋아요 삭제
  removeProductLike: async (productId: string): Promise<MessageResponse> => {
    const response = await consumerClient.delete(`/products/${productId}/like`);
    return response.data.data;
  },
  // 스토어 좋아요 추가
  addStoreLike: async (storeId: string): Promise<MessageResponse> => {
    const response = await consumerClient.post(`/store/${storeId}/like`);
    return response.data.data;
  },
  // 스토어 좋아요 삭제
  removeStoreLike: async (storeId: string): Promise<MessageResponse> => {
    const response = await consumerClient.delete(`/store/${storeId}/like`);
    return response.data.data;
  },
};
