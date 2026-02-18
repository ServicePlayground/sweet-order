import { IGetOrdersListParams } from "@/apps/web-seller/features/order/types/order.type";

/**
 * Order 관련 쿼리 키 상수
 */
export const orderQueryKeys = {
  all: ["order"] as const,
  lists: () => ["order", "list"] as const,
  list: (params: Partial<IGetOrdersListParams>) => ["order", "list", params] as const,
  details: () => ["order", "detail"] as const,
  detail: (orderId: string) => ["order", "detail", orderId] as const,
} as const;
