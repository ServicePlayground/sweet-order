export const likeQueryKeys = {
  all: ["like"] as const,
  likedStores: () => ["like", "stores"] as const,
  likedProducts: () => ["like", "products"] as const,
} as const;
