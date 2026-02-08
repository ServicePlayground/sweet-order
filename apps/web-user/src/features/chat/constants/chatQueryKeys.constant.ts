import { GetChatRoomsParams } from "@/apps/web-user/features/chat/types/chat.type";
import { GetMessagesParams } from "@/apps/web-user/features/chat/types/chat.type";

export const chatQueryKeys = {
  all: ["chat"] as const,
  lists: () => ["chat", "list"] as const,
  list: (params: GetChatRoomsParams) => ["chat", "list", params] as const,
  details: () => ["chat", "detail"] as const,
  detail: (roomId: string) => ["chat", "detail", roomId] as const,
  messages: (roomId: string, params: GetMessagesParams) =>
    ["chat", "detail", roomId, "messages", params] as const,
};
