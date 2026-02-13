import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/apps/web-user/features/order/apis/order.api";
import { orderQueryKeys } from "@/apps/web-user/features/order/constants/orderQueryKeys.constant";
import { OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { useEffect } from "react";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";

export function useOrderDetail(orderId: string) {
  const { showAlert } = useAlertStore();

  const query = useQuery<OrderResponse>({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (query.isError) {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, showAlert]);

  return query;
}
