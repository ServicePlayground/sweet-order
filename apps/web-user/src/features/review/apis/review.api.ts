import { userClient } from "@/apps/web-user/common/config/axios.config";
import {
  ReviewListResponse,
  GetReviewsParams,
} from "@/apps/web-user/features/review/types/review.type";

export const reviewApi = {
  // 상품 후기 목록 조회
  getProductReviews: async ({
    productId,
    ...params
  }: GetReviewsParams): Promise<ReviewListResponse> => {
    const response = await userClient.get(`/product/${productId}/review`, { params });
    return response.data.data;
  },
};
