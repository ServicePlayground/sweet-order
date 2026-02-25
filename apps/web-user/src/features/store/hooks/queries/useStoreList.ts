import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { storeApi } from "@/apps/web-user/features/store/apis/store.api";
import { storeQueryKeys } from "@/apps/web-user/features/store/constants/storeQueryKeys.constant";
import { StoreListResponse } from "@/apps/web-user/features/store/types/store.type";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

export function useStoreList({ search, limit = 20 }: { search?: string; limit?: number } = {}) {
  const { showAlert } = useAlertStore();

  const query = useInfiniteQuery<StoreListResponse>({
    queryKey: storeQueryKeys.list({ search }),
    queryFn: ({ pageParam = 1 }) =>
      storeApi.getList({ search, page: pageParam as number, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.currentPage + 1 : undefined,
    initialPageParam: 1,
    enabled: !!search?.trim(),
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
