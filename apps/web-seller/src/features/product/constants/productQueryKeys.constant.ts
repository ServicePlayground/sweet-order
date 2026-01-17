import { IGetProductsListParams } from "@/apps/web-seller/features/product/types/product.type";

export const productQueryKeys = {
  list: (params: IGetProductsListParams) => ["product", "list", params] as const,
  detail: (productId: string) => ["product", "detail", productId] as const,
} as const;
