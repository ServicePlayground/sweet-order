import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "@/apps/web-user/features/review/apis/review.api";
import { reviewQueryKeys } from "@/apps/web-user/features/review/constants/reviewQueryKeys.constant";
import {
  ReviewListResponse,
  ReviewSortBy,
} from "@/apps/web-user/features/review/types/review.type";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import { useEffect } from "react";

interface UseProductReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
  sortBy?: ReviewSortBy;
}

export function useProductReviews({
  productId,
  page = 1,
  limit = 20,
  sortBy = ReviewSortBy.LATEST,
}: UseProductReviewsParams) {
  const { showAlert } = useAlertStore();

  const query = useQuery<ReviewListResponse>({
    queryKey: reviewQueryKeys.productReviews(productId, page, limit, sortBy),
    queryFn: () => reviewApi.getProductReviews({ productId, page, limit, sortBy }),
    enabled: !!productId,
  });

  useEffect(() => {
    if (query.isError) {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, showAlert]);

  return query;
}
