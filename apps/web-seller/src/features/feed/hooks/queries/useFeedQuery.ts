import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { feedApi } from "@/apps/web-seller/features/feed/apis/feed.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import {
  IGetFeedsRequest,
  IFeed,
  IFeedListResponse,
} from "@/apps/web-seller/features/feed/types/feed.type";
import { feedQueryKeys } from "@/apps/web-seller/features/feed/constants/feedQueryKeys.constant";

// 피드 목록 조회 (무한 스크롤)
export function useFeedList(storeId: string, limit: number = 20) {
  const { addAlert } = useAlertStore();

  const query = useInfiniteQuery<IFeedListResponse>({
    queryKey: feedQueryKeys.list(storeId, { limit }),
    queryFn: ({ pageParam = 1 }) => {
      const params: IGetFeedsRequest = {
        page: pageParam as number,
        limit,
      };
      return feedApi.getFeeds(storeId, params);
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

// 피드 상세 조회
export function useFeedDetail(storeId: string, feedId: string) {
  const { addAlert } = useAlertStore();

  const query = useQuery<IFeed>({
    queryKey: feedQueryKeys.detail(feedId),
    queryFn: () => feedApi.getFeedDetail(storeId, feedId),
    enabled: !!storeId && !!feedId,
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
