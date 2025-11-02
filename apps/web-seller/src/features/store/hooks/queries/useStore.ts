import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { storeApi } from "@/apps/web-seller/features/store/apis/store.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { ICreateStoreRequest } from "@/apps/web-seller/features/store/types/store.type";
import { STORE_SUCCESS_MESSAGES } from "@/apps/web-seller/features/store/constants/store.constant";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";

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
