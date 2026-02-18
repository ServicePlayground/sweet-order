import { useMutation } from "@tanstack/react-query";
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

// 통신판매사업자 등록상세 조회 뮤테이션
export function useGetOnlineTradingCompanyDetail() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: businessApi.getOnlineTradingCompanyDetail,
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}
