import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import {
  Review,
  ReviewListResponse,
  MyReviewListResponse,
  WritableReviewListResponse,
  CreateReviewRequest,
  GetProductReviewsParams,
  GetStoreReviewsParams,
} from "@/apps/web-user/features/review/types/review.type";

export const reviewApi = {
  // 상품 후기 목록 조회
  getProductReviews: async ({
    productId,
    ...params
  }: GetProductReviewsParams): Promise<ReviewListResponse> => {
    const response = await consumerClient.get(`/review/product/${productId}`, { params });
    return response.data.data;
  },

  // 스토어 후기 목록 조회
  getStoreReviews: async ({
    storeId,
    ...params
  }: GetStoreReviewsParams): Promise<ReviewListResponse> => {
    const response = await consumerClient.get(`/review/store/${storeId}`, { params });
    return response.data.data;
  },

  // 스토어 후기 단일 조회
  getStoreReview: async (storeId: string, reviewId: string): Promise<Review> => {
    const response = await consumerClient.get(`/review/store/${storeId}/${reviewId}`);
    return response.data.data;
  },

  // 내가 작성한 후기 목록 조회
  getMyReviews: async (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
  }): Promise<MyReviewListResponse> => {
    const response = await consumerClient.get(`/mypage/reviews`, { params });
    return response.data.data;
  },

  // 작성 가능한 후기 목록 조회
  getWritableReviews: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<WritableReviewListResponse> => {
    const response = await consumerClient.get(`/mypage/reviews/writable`, { params });
    return response.data.data;
  },

  // 후기 작성
  createReview: async (data: CreateReviewRequest): Promise<void> => {
    await consumerClient.post(`/mypage/reviews`, data);
  },

  // 내가 작성한 후기 삭제
  deleteMyReview: async (reviewId: string): Promise<void> => {
    await consumerClient.delete(`/mypage/reviews/${reviewId}`);
  },
};
