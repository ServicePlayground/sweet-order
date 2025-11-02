import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { storeApi } from "@/apps/web-seller/features/store/apis/store.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { ICreateStoreRequest } from "@/apps/web-seller/features/store/types/store.type";
import { STORE_SUCCESS_MESSAGES } from "@/apps/web-seller/features/store/constants/store.constant";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { storeQueryKeys } from "../../constants/storeQueryKeys.constant";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { useStoreStore } from "@/apps/web-seller/features/store/store/store.store";

// 스토어 생성 뮤테이션
export function useCreateStore() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: ICreateStoreRequest) => storeApi.createStore(request),
    onSuccess: () => {
      addAlert({
        severity: "success",
        message: STORE_SUCCESS_MESSAGES.STORE_CREATED,
      });
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 스토어 목록 조회 쿼리
export function useStoreList() {
  const { isAuthenticated } = useAuthStore();
  const { setStores } = useStoreStore();
  const { addAlert } = useAlertStore();

  const query = useQuery({
    queryKey: storeQueryKeys.list,
    queryFn: storeApi.getStoreList,
    enabled: false, // 기본적으로 비활성화 (로그인 후 활성화)
  });

  useEffect(() => {
    if (query.isSuccess) {
      setStores(query.data);
    }
  }, [query.isSuccess, query.data, setStores]);

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
