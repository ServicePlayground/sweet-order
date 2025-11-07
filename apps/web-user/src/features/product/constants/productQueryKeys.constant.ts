import { ProductListQueryParams } from "@/apps/web-user/features/product/types/product.type";

export const productQueryKeys = {
  list: (params: ProductListQueryParams) => ["product", "list", params] as const,
} as const;

