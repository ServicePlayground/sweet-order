import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/apps/web-seller/features/order/apis/order.api";
import { orderQueryKeys } from "@/apps/web-seller/features/order/constants/orderQueryKeys.constant";
import {
  IUpdateOrderStatusRequest,
  IUpdateOrderStatusResponse,
} from "@/apps/web-seller/features/order/types/order.type";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";

// 주문 상태 변경 뮤테이션
export function useUpdateOrderStatus() {
  const { addAlert } = useAlertStore();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IUpdateOrderStatusResponse,
    Error,
    { orderId: string; request: IUpdateOrderStatusRequest }
  >({
    mutationFn: ({ orderId, request }) => orderApi.updateOrderStatus(orderId, request),
    onSuccess: () => {
      addAlert({
        severity: "success",
        message: "주문 상태가 변경되었습니다.",
      });
      // 주문 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });

  return mutation;
}
