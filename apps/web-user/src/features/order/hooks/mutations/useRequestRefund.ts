import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/apps/web-user/features/order/apis/order.api";
import { orderQueryKeys } from "@/apps/web-user/features/order/constants/orderQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useRequestRefund() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      bankName,
      bankAccountNumber,
      accountHolderName,
    }: {
      orderId: string;
      reason: string;
      bankName: string;
      bankAccountNumber: string;
      accountHolderName: string;
    }) =>
      orderApi.requestRefund(orderId, {
        reason,
        bankName,
        bankAccountNumber,
        accountHolderName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(error),
      });
    },
  });
}
