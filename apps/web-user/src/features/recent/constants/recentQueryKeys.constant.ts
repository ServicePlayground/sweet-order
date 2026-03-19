export const recentQueryKeys = {
  all: ["recent"] as const,
  recentProducts: () => ["recent", "products"] as const,
} as const;
