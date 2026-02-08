import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeApi } from "@/apps/web-user/features/like/apis/like.api";
import { likeQueryKeys } from "@/apps/web-user/features/like/constants/likeQueryKeys.constant";
import { productQueryKeys } from "@/apps/web-user/features/product/constants/productQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useAddProductLike() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: (productId: string) => likeApi.addProductLike(productId),
    onSuccess: (data, productId) => {
      // 상품 상세 쿼리 무효화 (좋아요 개수 업데이트)
      queryClient.invalidateQueries({ queryKey: productQueryKeys.detail(productId) });

      // 좋아요 여부 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: likeQueryKeys.productIsLiked(productId) });

      // 상품 목록 쿼리도 무효화 (좋아요 개수 업데이트)
      queryClient.invalidateQueries({ queryKey: ["product", "list"] });
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
