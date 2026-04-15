import { useInfiniteQuery } from "@tanstack/react-query";
import { orderApi } from "@/apps/web-user/features/order/apis/order.api";
import { orderQueryKeys } from "@/apps/web-user/features/order/constants/orderQueryKeys.constant";
import { MyOrdersResponse } from "@/apps/web-user/features/order/types/order.type";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";

const DEFAULT_LIMIT = 10;

export function useMyOrders(params?: { type?: "UPCOMING" | "PAST"; limit?: number }) {
  const { isAuthenticated } = useAuthStore();
  const limit = params?.limit ?? DEFAULT_LIMIT;

  return useInfiniteQuery<MyOrdersResponse>({
    queryKey: orderQueryKeys.mypage(params?.type),
    queryFn: ({ pageParam = 1 }) =>
      orderApi.getMyOrders({ type: params?.type, page: pageParam as number, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
    enabled: isAuthenticated,
  });
}
