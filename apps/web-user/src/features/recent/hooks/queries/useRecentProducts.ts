import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { recentApi, RecentProductsResponse } from "@/apps/web-user/features/recent/apis/recent.api";
import { recentQueryKeys } from "@/apps/web-user/features/recent/constants/recentQueryKeys.constant";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useRecentProducts({ limit = 20 }: { limit?: number } = {}) {
  const { showAlert } = useAlertStore();

  const query = useInfiniteQuery<RecentProductsResponse>({
    queryKey: recentQueryKeys.recentProducts(),
    queryFn: ({ pageParam = 1 }) =>
      recentApi.getRecentProducts({ page: pageParam as number, limit, sortBy: "latest" }),
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
