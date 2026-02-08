import { ReviewSortBy } from "@/apps/web-user/features/review/types/review.type";

export const reviewQueryKeys = {
  productReviews: (productId: string, page: number, limit: number, sortBy: ReviewSortBy) =>
    ["review", "product", productId, page, limit, sortBy] as const,
} as const;
