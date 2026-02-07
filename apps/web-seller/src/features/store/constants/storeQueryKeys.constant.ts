/**
 * Store 관련 쿼리 키 상수
 */
export const storeQueryKeys = {
  list: ["store", "list"] as const,
  detail: (storeId: string) => ["store", "detail", storeId] as const,
} as const;
