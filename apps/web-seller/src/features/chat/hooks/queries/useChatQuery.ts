import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { chatApi } from "@/apps/web-seller/features/chat/apis/chat.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";
import { chatQueryKeys } from "@/apps/web-seller/features/chat/constants/chatQueryKeys.constant";
import {
  MessageListResponseDto,
  GetMessagesRequestDto,
  ChatRoomListForSellerResponseDto,
  GetChatRoomsRequestDto,
} from "@/apps/web-seller/features/chat/types/chat.dto";

// 스토어의 채팅방 목록 조회 (무한 스크롤)
export function useChatRoomsByStore(storeId: string, limit: number = 20) {
  const { addAlert } = useAlertStore();

  const query = useInfiniteQuery<ChatRoomListForSellerResponseDto>({
    queryKey: chatQueryKeys.list({ storeId, limit }),
    queryFn: ({ pageParam = 1 }) => {
      const params: GetChatRoomsRequestDto = {
        page: pageParam as number,
        limit,
      };
      return chatApi.getChatRoomsByStore(storeId, params);
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

// 메시지 목록 조회 (무한스크롤)
export function useMessages(roomId: string, limit: number = 50) {
  const { addAlert } = useAlertStore();

  const query = useInfiniteQuery<MessageListResponseDto>({
    queryKey: chatQueryKeys.messages(roomId, { limit }),
    queryFn: ({ pageParam = 1 }) => {
      const params: GetMessagesRequestDto = {
        page: pageParam as number,
        limit,
      };
      return chatApi.getMessages(roomId, params);
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
    enabled: !!roomId,
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
