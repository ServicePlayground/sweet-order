import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { reviewApi } from "@/apps/web-user/features/review/apis/review.api";
import { reviewQueryKeys } from "@/apps/web-user/features/review/constants/reviewQueryKeys.constant";
import {
  ReviewListResponse,
  ReviewSortBy,
} from "@/apps/web-user/features/review/types/review.type";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";

interface UseStoreReviewsParams {
  storeId: string;
  limit?: number;
  sortBy?: ReviewSortBy;
}

export function useStoreReviews({
  storeId,
  limit = 20,
  sortBy = ReviewSortBy.LATEST,
}: UseStoreReviewsParams) {
  const { showAlert } = useAlertStore();

  const query = useInfiniteQuery<ReviewListResponse>({
    queryKey: reviewQueryKeys.storeReviews(storeId, 1, limit, sortBy),
    queryFn: ({ pageParam = 1 }) =>
      reviewApi.getStoreReviews({ storeId, page: pageParam as number, limit, sortBy }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNext) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!storeId,
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
