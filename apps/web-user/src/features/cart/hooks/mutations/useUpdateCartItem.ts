import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/apps/web-user/features/cart/apis/cart.api";
import { cartQueryKeys } from "@/apps/web-user/features/cart/constants/cartQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { UpdateCartItemRequest } from "@/apps/web-user/features/cart/types/cart.type";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: ({ cartItemId, data }: { cartItemId: string; data: UpdateCartItemRequest }) =>
      cartApi.updateCartItem(cartItemId, data),
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
