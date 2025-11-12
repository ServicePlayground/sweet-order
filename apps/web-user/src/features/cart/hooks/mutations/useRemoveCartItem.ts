import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/apps/web-user/features/cart/apis/cart.api";
import { cartQueryKeys } from "@/apps/web-user/features/cart/constants/cartQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: (cartItemId: string) => cartApi.removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.list() });
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
