export const likeQueryKeys = {
  productIsLiked: (productId: string) => ["like", "product", "isLiked", productId] as const,
  storeIsLiked: (storeId: string) => ["like", "store", "isLiked", storeId] as const,
} as const;
