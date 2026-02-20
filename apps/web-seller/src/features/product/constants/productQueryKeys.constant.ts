import { IGetProductsListParams } from "@/apps/web-seller/features/product/types/product.type";

/**
 * Product 관련 쿼리 키 상수
 */
export const productQueryKeys = {
  all: ["product"] as const,
  lists: () => ["product", "list"] as const,
  list: (params: IGetProductsListParams) => ["product", "list", params] as const,
  details: () => ["product", "detail"] as const,
  detail: (productId: string) => ["product", "detail", productId] as const,
} as const;
