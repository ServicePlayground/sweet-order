import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { storeApi } from "@/apps/web-seller/features/store/apis/store.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import {
  ICreateStoreRequest,
  IUpdateStoreRequest,
  IGetStoresRequest,
  IGetStoresParams,
  IStoreListResponse,
} from "@/apps/web-seller/features/store/types/store.type";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { storeQueryKeys } from "../../constants/storeQueryKeys.constant";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";

// 스토어 생성 뮤테이션
export function useCreateStore() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ICreateStoreRequest) => storeApi.createStore(request),
    onSuccess: (response) => {
      addAlert({
        severity: "success",
        message: "스토어 등록이 완료되었습니다.",
      });
      // 스토어 목록 쿼리 무효화하여 사이드바에 새 스토어가 바로 반영되도록 함
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail(response.id) });
      navigate(ROUTES.STORE_DETAIL_HOME(response.id));
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 스토어 수정 뮤테이션
export function useUpdateStore() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, request }: { storeId: string; request: IUpdateStoreRequest }) =>
      storeApi.updateStore(storeId, request),
    onSuccess: (response, variables) => {
      addAlert({
        severity: "success",
        message: "스토어 수정이 완료되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail(variables.storeId) });
      navigate(ROUTES.STORE_DETAIL_HOME(variables.storeId));
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 스토어 목록 조회 쿼리 (무한 스크롤)
export function useStoreList({ limit = 20 }: Partial<IGetStoresParams> = {}) {
  const { addAlert } = useAlertStore();
  const { isAuthenticated } = useAuthStore();

  const query = useInfiniteQuery<IStoreListResponse>({
    queryKey: storeQueryKeys.list({ limit }),
    queryFn: ({ pageParam = 1 }) => {
      const params: IGetStoresRequest = {
        page: pageParam as number,
        limit,
      };
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
