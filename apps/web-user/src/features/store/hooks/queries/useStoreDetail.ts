import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/apps/web-user/features/store/apis/store.api";
import { storeQueryKeys } from "@/apps/web-user/features/store/constants/storeQueryKeys.constant";
import { StoreInfo } from "@/apps/web-user/features/store/types/store.type";
import { useEffect } from "react";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";

export function useStoreDetail(storeId: string) {
  const { showAlert } = useAlertStore();

  const query = useQuery<StoreInfo>({
    queryKey: storeQueryKeys.detail(storeId),
    queryFn: () => storeApi.getDetail(storeId),
    enabled: !!storeId,
  });

  useEffect(() => {
    if (query.isError) {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiMessage.error(query.error),
      });
    }
  }, [query.isError]);

  return query;
}
