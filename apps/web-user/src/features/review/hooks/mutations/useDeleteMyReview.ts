import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/apps/web-user/features/review/apis/review.api";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useDeleteMyReview() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: (reviewId: string) => reviewApi.deleteMyReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review", "my"] });
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
