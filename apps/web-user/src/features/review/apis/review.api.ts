import { userClient } from "@/apps/web-user/common/config/axios.config";
import {
  Review,
  ReviewListResponse,
  GetProductReviewsParams,
  GetStoreReviewsParams,
} from "@/apps/web-user/features/review/types/review.type";

export const reviewApi = {
  // 상품 후기 목록 조회
  getProductReviews: async ({
    productId,
    ...params
  }: GetProductReviewsParams): Promise<ReviewListResponse> => {
    const response = await userClient.get(`/review/product/${productId}`, { params });
    return response.data.data;
  },

  // 스토어 후기 목록 조회
  getStoreReviews: async ({
    storeId,
    ...params
  }: GetStoreReviewsParams): Promise<ReviewListResponse> => {
    const response = await userClient.get(`/review/store/${storeId}`, { params });
    return response.data.data;
  },

  // 스토어 후기 단일 조회
  getStoreReview: async (storeId: string, reviewId: string): Promise<Review> => {
    const response = await userClient.get(`/review/store/${storeId}/${reviewId}`);
    return response.data.data;
  },
};
