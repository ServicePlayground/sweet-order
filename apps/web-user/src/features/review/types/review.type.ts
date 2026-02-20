import { PaginationMeta } from "@/apps/web-user/common/types/api.type";

/**
 * 후기 정렬 옵션
 */
export enum ReviewSortBy {
  LATEST = "latest", // 최신순
  RATING_DESC = "rating_desc", // 별점 높은 순
  RATING_ASC = "rating_asc", // 별점 낮은 순
}

/**
 * 후기 정보
 */
export interface Review {
  id: string;
  productId: string;
  storeId: string;
  storeName: string;
  userId: string;
  rating: number;
  content: string;
  imageUrls: string[];
  userNickname: string | null;
  userProfileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 후기 목록 응답
 */
export interface ReviewListResponse {
  data: Review[];
  meta: PaginationMeta;
}

/**
 * 상품 후기 목록 조회 요청 파라미터
 */
export interface GetProductReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
  sortBy?: ReviewSortBy;
}

/**
 * 스토어 후기 목록 조회 요청 파라미터
 */
export interface GetStoreReviewsParams {
  storeId: string;
  page?: number;
  limit?: number;
  sortBy?: ReviewSortBy;
}

/**
 * @deprecated Use GetProductReviewsParams instead
 */
export interface GetReviewsParams {
  productId: string;
  page: number;
  limit: number;
  sortBy: ReviewSortBy;
}
