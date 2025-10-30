import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/apps/web-seller/features/auth/store/auth.store";
import { authApi } from "@/apps/web-seller/features/auth/apis/auth.api";
import { authQueryKeys } from "@/apps/web-seller/features/auth/constants/authQueryKeys.constant";
import { businessApi } from "@/apps/web-seller/features/business/apis/business.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";

// 사업자등록번호 진위확인 뮤테이션
export function useVerifyBusinessRegistration() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: businessApi.verifyBusinessRegistration,
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}
