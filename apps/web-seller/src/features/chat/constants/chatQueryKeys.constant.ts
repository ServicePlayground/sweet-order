import { GetChatRoomsParams } from "@/apps/web-seller/features/chat/types/chat.type";
import { GetMessagesParams } from "@/apps/web-seller/features/chat/types/chat.type";

/**
 * Chat 관련 쿼리 키 상수
 */
export const chatQueryKeys = {
  all: ["chat"] as const,
  lists: () => ["chat", "list"] as const,
  list: (params: GetChatRoomsParams) => ["chat", "list", params] as const,
  details: () => ["chat", "detail"] as const,
  detail: (roomId: string) => ["chat", "detail", roomId] as const,
  messages: (roomId: string, params: GetMessagesParams) =>
    ["chat", "detail", roomId, "messages", params] as const,
} as const;
