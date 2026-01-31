import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ChatRoomListForSellerResponse,
  MessageListResponse,
  Message,
  SendMessageRequest,
  GetMessagesRequest,
} from "@/apps/web-seller/features/chat/types/chat.type";

export const chatApi = {
  // 스토어의 채팅방 목록 조회
  getChatRoomsByStore: async (storeId: string): Promise<ChatRoomListForSellerResponse> => {
    const response = await sellerClient.get(`/chat-room/store/${storeId}`);
    return response.data.data;
  },

  // 메시지 목록 조회 (무한 스크롤)
  getMessages: async (roomId: string, params: GetMessagesRequest): Promise<MessageListResponse> => {
    const response = await sellerClient.get(`/chat-room/${roomId}/messages`, { params });
    return response.data.data;
  },

  // 채팅방 읽음 처리
  markChatRoomAsRead: async (roomId: string): Promise<{ success: boolean }> => {
    const response = await sellerClient.post(`/chat-room/${roomId}/read`);
    return response.data.data;
  },

  // 메시지 전송
  sendMessage: async (roomId: string, request: SendMessageRequest): Promise<Message> => {
    const response = await sellerClient.post(`/chat-room/${roomId}/messages`, request);
    return response.data.data;
  },
};
