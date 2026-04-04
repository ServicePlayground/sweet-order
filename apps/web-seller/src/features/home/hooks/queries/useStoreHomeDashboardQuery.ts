/**
 * GET `/v1/seller/store/:storeId/home`. 스토어별 대시보드 쿼리 키 분리.
 */
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { sellerHomeApi } from "@/apps/web-seller/features/home/apis/home.api";
import { SELLER_HOME_DASHBOARD_STALE_TIME_MS } from "@/apps/web-seller/features/home/constants/sellerHome.constant";
import { sellerHomeQueryKeys } from "@/apps/web-seller/features/home/constants/sellerHomeQueryKeys.constant";
import type { SellerHomeDashboardDto } from "@/apps/web-seller/features/home/types/seller-home.dto";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";

export function useStoreHomeDashboardQuery(storeId: string) {
  const { addAlert } = useAlertStore();

  const query = useQuery<SellerHomeDashboardDto>({
    queryKey: sellerHomeQueryKeys.dashboard(storeId),
    queryFn: () => sellerHomeApi.getDashboard(storeId),
    enabled: !!storeId,
    staleTime: SELLER_HOME_DASHBOARD_STALE_TIME_MS,
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
