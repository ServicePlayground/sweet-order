export const storeQueryKeys = {
  detail: (storeId: string) => ["store", "detail", storeId] as const,
} as const;
