import { useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { storeApi } from "@/apps/web-seller/features/store/apis/store.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import {
  IGetStoresRequest,
  IGetStoresParams,
  IStoreListResponse,
} from "@/apps/web-seller/features/store/types/store.type";
import { storeQueryKeys } from "../../constants/storeQueryKeys.constant";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";

// 스토어 목록 조회 쿼리 (무한 스크롤)
export function useStoreList({ limit = 100, search, sortBy }: Partial<IGetStoresParams> = {}) {
  const { addAlert } = useAlertStore();
  const { isAuthenticated } = useAuthStore();

  const query = useInfiniteQuery<IStoreListResponse>({
    queryKey: storeQueryKeys.list({ limit, search, sortBy }),
    queryFn: ({ pageParam = 1 }) => {
      const params: IGetStoresRequest = {
        page: pageParam as number,
        limit,
      };
      if (search !== undefined && search !== "") params.search = search;
      if (sortBy !== undefined) params.sortBy = sortBy;
      return storeApi.getStoreList(params);
    },
    // 반환된 값은 다음 API 요청의 queryFn의 pageParam으로 전달됩니다.
    // 이 값은 hasNextPage에도 영향을 줍니다.
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNext) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: isAuthenticated, // 인증된 경우에만 자동으로 호출
  });

  useEffect(() => {
    if (query.isError) {
      addAlert({
        severity: "error",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, addAlert]);

  return query;
}

// 스토어 상세 조회 쿼리
export function useStoreDetail(storeId: string) {
  const { addAlert } = useAlertStore();

  const query = useQuery({
    queryKey: storeQueryKeys.detail(storeId),
    queryFn: () => storeApi.getStoreDetail(storeId),
    enabled: !!storeId,
  });

  useEffect(() => {
    if (query.isError) {
      addAlert({
        severity: "error",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError, query.error, addAlert]);

  return query;
}
