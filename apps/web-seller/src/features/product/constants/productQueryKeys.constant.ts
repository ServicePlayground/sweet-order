import { ProductListQueryParams } from "@/apps/web-seller/features/product/types/product.type";

export const productQueryKeys = {
  list: (params: ProductListQueryParams) => ["product", "list", params] as const,
} as const;




