import { IGetStoresParams } from "@/apps/web-seller/features/store/types/store.type";

/**
 * Store 관련 쿼리 키 상수
 */
export const storeQueryKeys = {
  list: (params: IGetStoresParams) => ["store", "list", params] as const,
  detail: (storeId: string) => ["store", "detail", storeId] as const,
} as const;
