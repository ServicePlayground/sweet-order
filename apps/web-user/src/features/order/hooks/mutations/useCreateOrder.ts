import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orderApi } from "@/apps/web-user/features/order/apis/order.api";
import { CreateOrderRequest, OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useCreateOrder() {
  const { showAlert } = useAlertStore();
  const router = useRouter();

  return useMutation<Pick<OrderResponse, "id">, Error, CreateOrderRequest>({
    mutationFn: (data: CreateOrderRequest) => orderApi.createOrder(data),
    onSuccess: (response) => {
      // 주문 ID를 쿼리 파라미터로 전달하여 완료 페이지로 이동
      router.push(`/reservation/complete?orderId=${response.id}`);
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "주문 실패",
        message: getApiMessage.error(error),
      });
    },
  });
}
