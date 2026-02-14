import { IGetOrdersListParams } from "@/apps/web-seller/features/order/types/order.type";

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (params: Partial<IGetOrdersListParams>) => [...orderQueryKeys.lists(), params] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
};
