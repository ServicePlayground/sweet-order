import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/apps/web-user/features/cart/apis/cart.api";
import { cartQueryKeys } from "@/apps/web-user/features/cart/constants/cartQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useAddCartItem() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: cartApi.addCartItem,
    onSuccess: (data) => {
      // 장바구니 목록 쿼리 무효화 (추후 장바구니 목록 조회 시 최신 데이터 가져오기)
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.list() });

      // 성공 메시지 표시
      showAlert({
        type: "success",
        title: "성공",
        message: getApiMessage.success(data),
      });
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

