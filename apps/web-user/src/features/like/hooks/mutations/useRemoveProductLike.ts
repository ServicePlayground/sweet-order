import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeApi } from "@/apps/web-user/features/like/apis/like.api";
import { productQueryKeys } from "@/apps/web-user/features/product/constants/productQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useRemoveProductLike() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: (productId: string) => likeApi.removeProductLike(productId),
    onSuccess: (_, productId) => {
      // 상품 상세 쿼리 무효화 (좋아요 개수 업데이트)
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(productId) });
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
