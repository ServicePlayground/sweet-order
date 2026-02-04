import { ProductListQueryParams, ReviewSortBy } from "@/apps/web-user/features/product/types/product.type";

export const productQueryKeys = {
  list: (params: ProductListQueryParams) => ["product", "list", params] as const,
  detail: (productId: string) => ["product", "detail", productId] as const,
  isLiked: (productId: string) => ["product", "isLiked", productId] as const,
  reviews: (productId: string, page: number, limit: number, sortBy: ReviewSortBy) =>
    ["product", "reviews", productId, page, limit, sortBy] as const,
} as const;
