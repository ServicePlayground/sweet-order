export const storeQueryKeys = {
  all: ["store"] as const,
  detail: (storeId: string) => ["store", "detail", storeId] as const,
  list: (params: { search?: string }) => ["store", "list", params] as const,
} as const;
