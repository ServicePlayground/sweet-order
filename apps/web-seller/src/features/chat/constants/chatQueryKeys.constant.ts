import type {
  GetChatRoomsQueryParams,
  GetMessagesQueryParams,
} from "@/apps/web-seller/features/chat/types/chat.ui";

/**
 * Chat 관련 쿼리 키 상수
 */
export const chatQueryKeys = {
  all: ["chat"] as const,
  lists: () => ["chat", "list"] as const,
  list: (params: { storeId: string } & GetChatRoomsQueryParams) =>
    ["chat", "list", params] as const,
  details: () => ["chat", "detail"] as const,
  detail: (roomId: string) => ["chat", "detail", roomId] as const,
  messages: (roomId: string, params: GetMessagesQueryParams) =>
    ["chat", "detail", roomId, "messages", params] as const,
} as const;
