/**
 * GET `/v1/seller/statistics/orders/overview`. 기간·스토어마다 쿼리 키 분리, 기간만 바꿀 때는 이전 데이터 유지(`keepPreviousData`).
 */
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { statisticsApi } from "@/apps/web-seller/features/statistics/apis/statistics.api";
import { STATISTICS_OVERVIEW_STALE_TIME_MS } from "@/apps/web-seller/features/statistics/constants/statistics.constant";
import { statisticsQueryKeys } from "@/apps/web-seller/features/statistics/constants/statisticsQueryKeys.constant";
import type { OrderStatisticsOverviewResponseDto } from "@/apps/web-seller/features/statistics/types/statistics.dto";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";

export function useStatisticsOverviewQuery(params: {
  storeId: string;
  startDate: string;
  endDate: string;
}) {
  const { addAlert } = useAlertStore();
  const { storeId, startDate, endDate } = params;

  const query = useQuery<OrderStatisticsOverviewResponseDto>({
    queryKey: statisticsQueryKeys.overview({ storeId, startDate, endDate }),
    queryFn: () => statisticsApi.getOverview({ storeId, startDate, endDate }),
    // 잘못된 구간이면 요청 생략(백엔드와 동일하게 start ≤ end 가정)
    enabled: !!storeId && !!startDate && !!endDate && startDate <= endDate,
    staleTime: STATISTICS_OVERVIEW_STALE_TIME_MS,
    placeholderData: keepPreviousData,
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
