import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/apps/web-user/features/review/apis/review.api";
import { CreateReviewRequest } from "@/apps/web-user/features/review/types/review.type";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review", "my"] });
      queryClient.invalidateQueries({ queryKey: ["review", "writable"] });
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
