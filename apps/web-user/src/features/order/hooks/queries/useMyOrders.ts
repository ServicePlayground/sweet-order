import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/apps/web-user/features/order/apis/order.api";
import { orderQueryKeys } from "@/apps/web-user/features/order/constants/orderQueryKeys.constant";
import { MyOrdersResponse } from "@/apps/web-user/features/order/types/order.type";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";

export function useMyOrders(params?: { type?: "UPCOMING" | "PAST" }) {
  const { isAuthenticated } = useAuthStore();

  return useQuery<MyOrdersResponse>({
    queryKey: orderQueryKeys.mypage(params?.type),
    queryFn: () => orderApi.getMyOrders(params),
    enabled: isAuthenticated,
  });
}
