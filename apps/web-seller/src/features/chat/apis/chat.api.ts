import { sellerClient } from "@/apps/web-seller/common/config/axios.config";
import {
  ChatRoomListForSellerResponseDto,
  MessageListResponseDto,
  GetMessagesRequestDto,
  GetChatRoomsRequestDto,
} from "@/apps/web-seller/features/chat/types/chat.dto";

export const chatApi = {
  // 스토어의 채팅방 목록 조회 (무한 스크롤)
  getChatRoomsByStore: async (
    storeId: string,
    params: GetChatRoomsRequestDto,
  ): Promise<ChatRoomListForSellerResponseDto> => {
    const response = await sellerClient.get(`/chat-room/store/${storeId}`, { params });
    return response.data.data;
  },

  // 메시지 목록 조회 (무한 스크롤)
  getMessages: async (
    roomId: string,
    params: GetMessagesRequestDto,
  ): Promise<MessageListResponseDto> => {
    const response = await sellerClient.get(`/chat-room/${roomId}/messages`, { params });
    return response.data.data;
  },

  // 채팅방 읽음 처리
  markChatRoomAsRead: async (roomId: string): Promise<{ success: boolean }> => {
    const response = await sellerClient.post(`/chat-room/${roomId}/read`);
    return response.data.data;
  },
};
