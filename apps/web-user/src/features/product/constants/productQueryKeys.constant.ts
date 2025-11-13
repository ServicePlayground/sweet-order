import { ProductListQueryParams } from "@/apps/web-user/features/product/types/product.type";

export const productQueryKeys = {
  list: (params: ProductListQueryParams) => ["product", "list", params] as const,
  detail: (productId: string) => ["product", "detail", productId] as const,
  isLiked: (productId: string) => ["product", "isLiked", productId] as const,
} as const;
