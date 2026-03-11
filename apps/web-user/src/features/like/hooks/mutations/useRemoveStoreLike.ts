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
    onSuccess: () => {
      // 스토어 관련 쿼리 전체 무효화 (목록/상세/마이페이지 등 isLiked, likeCount 반영)
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.all });
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
