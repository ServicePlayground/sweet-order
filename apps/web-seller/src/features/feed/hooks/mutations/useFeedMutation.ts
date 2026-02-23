import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { feedApi } from "@/apps/web-seller/features/feed/apis/feed.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import {
  CreateFeedRequestDto,
  UpdateFeedRequestDto,
} from "@/apps/web-seller/features/feed/types/feed.dto";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { feedQueryKeys } from "@/apps/web-seller/features/feed/constants/feedQueryKeys.constant";

// 피드 생성 뮤테이션
export function useCreateFeed() {
  const { addAlert } = useAlertStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, request }: { storeId: string; request: CreateFeedRequestDto }) =>
      feedApi.createFeed(storeId, request),
    onSuccess: (_response, variables) => {
      addAlert({
        severity: "success",
        message: "피드가 등록되었습니다.",
      });
      // 피드 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      feedId,
      request,
    }: {
      storeId: string;
      feedId: string;
      request: UpdateFeedRequestDto;
    }) => feedApi.updateFeed(storeId, feedId, request),
    onSuccess: (_response, variables) => {
      addAlert({
        severity: "success",
        message: "피드가 수정되었습니다.",
      });
      // 피드 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, feedId }: { storeId: string; feedId: string }) =>
      feedApi.deleteFeed(storeId, feedId),
    onSuccess: (_response, variables) => {
      addAlert({
        severity: "success",
        message: "피드가 삭제되었습니다.",
      });
      // 피드 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
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
