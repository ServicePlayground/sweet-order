import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { likeApi, LikedProductsResponse } from "@/apps/web-user/features/like/apis/like.api";
import { likeQueryKeys } from "@/apps/web-user/features/like/constants/likeQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useLikedProducts({ limit = 20 }: { limit?: number } = {}) {
  const { showAlert } = useAlertStore();

  const query = useInfiniteQuery<LikedProductsResponse>({
    queryKey: likeQueryKeys.likedProducts(),
    queryFn: ({ pageParam = 1 }) =>
      likeApi.getLikedProducts({ page: pageParam as number, limit, sortBy: "latest" }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
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
