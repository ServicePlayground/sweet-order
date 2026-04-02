export const sellerHomeQueryKeys = {
  all: ["sellerHome"] as const,
  dashboard: (storeId: string) => [...sellerHomeQueryKeys.all, "dashboard", storeId] as const,
};
