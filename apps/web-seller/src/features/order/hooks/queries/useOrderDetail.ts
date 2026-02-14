import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { orderApi } from "@/apps/web-seller/features/order/apis/order.api";
import { orderQueryKeys } from "@/apps/web-seller/features/order/constants/orderQueryKeys.constant";
import { OrderResponse } from "@/apps/web-seller/features/order/types/order.type";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";

export function useOrderDetail(orderId: string) {
  const { addAlert } = useAlertStore();

  const query = useQuery<OrderResponse>({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => orderApi.getOrderDetail(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (query.isError) {
      addAlert({
        severity: "error",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, addAlert]);

  return query;
}
