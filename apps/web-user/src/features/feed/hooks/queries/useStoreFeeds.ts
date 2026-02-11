import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { feedApi } from "@/apps/web-user/features/feed/apis/feed.api";
import { feedQueryKeys } from "@/apps/web-user/features/feed/constants/feedQueryKeys.constant";
import { FeedListResponse } from "@/apps/web-user/features/feed/types/feed.type";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import getApiMessage from "@/apps/web-user/common/utils/getApiMessage";

interface UseStoreFeedsParams {
  storeId: string;
  page?: number;
  limit?: number;
}

export function useStoreFeeds({
  storeId,
  page = 1,
  limit = 20,
}: UseStoreFeedsParams) {
  const { showAlert } = useAlertStore();

  const query = useQuery<FeedListResponse>({
    queryKey: feedQueryKeys.storeFeeds(storeId, page, limit),
    queryFn: () => feedApi.getStoreFeeds({ storeId, page, limit }),
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
  }, [query.isError, query.error, showAlert]);

  return query;
}
