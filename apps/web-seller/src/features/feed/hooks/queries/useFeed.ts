import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { feedApi } from "@/apps/web-seller/features/feed/apis/feed.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import {
  ICreateFeedRequest,
  IUpdateFeedRequest,
  IGetFeedsRequest,
  IFeed,
  IFeedListResponse,
} from "@/apps/web-seller/features/feed/types/feed.type";
import { feedQueryKeys } from "@/apps/web-seller/features/feed/constants/feedQueryKeys.constant";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";

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

// 피드 생성 뮤테이션
export function useCreateFeed() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ storeId, request }: { storeId: string; request: ICreateFeedRequest }) =>
      feedApi.createFeed(storeId, request),
    onSuccess: (response, variables) => {
      addAlert({
        severity: "success",
        message: "피드가 등록되었습니다.",
      });
      // 피드 목록으로 이동
      navigate(ROUTES.STORE_DETAIL_FEED_LIST(variables.storeId));
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 피드 수정 뮤테이션
export function useUpdateFeed() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      storeId,
      feedId,
      request,
    }: {
      storeId: string;
      feedId: string;
      request: IUpdateFeedRequest;
    }) => feedApi.updateFeed(storeId, feedId, request),
    onSuccess: (response, variables) => {
      addAlert({
        severity: "success",
        message: "피드가 수정되었습니다.",
      });
      // 피드 목록으로 이동
      navigate(ROUTES.STORE_DETAIL_FEED_LIST(variables.storeId));
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}

// 피드 삭제 뮤테이션
export function useDeleteFeed() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ storeId, feedId }: { storeId: string; feedId: string }) =>
      feedApi.deleteFeed(storeId, feedId),
    onSuccess: (response, variables) => {
      addAlert({
        severity: "success",
        message: "피드가 삭제되었습니다.",
      });
      // 피드 목록으로 이동
      navigate(ROUTES.STORE_DETAIL_FEED_LIST(variables.storeId));
    },
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}
