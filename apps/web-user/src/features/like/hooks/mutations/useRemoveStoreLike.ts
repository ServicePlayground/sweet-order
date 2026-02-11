import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeApi } from "@/apps/web-user/features/like/apis/like.api";
import { storeQueryKeys } from "@/apps/web-user/features/store/constants/storeQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useRemoveStoreLike() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: (storeId: string) => likeApi.removeStoreLike(storeId),
    onSuccess: (_, storeId) => {
      // 스토어 상세 쿼리 무효화 (좋아요 개수 업데이트)
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail(storeId) });
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
