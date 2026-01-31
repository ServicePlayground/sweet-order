import { userClient } from "@/apps/web-user/common/config/axios.config";
import {
  ChatRoomListResponse,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  MessageListResponse,
  GetMessagesRequest,
} from "@/apps/web-user/features/chat/types/chat.type";

export const chatApi = {
  // 채팅방 목록 조회
  getChatRooms: async (): Promise<ChatRoomListResponse> => {
    const response = await userClient.get("/chat-room");
    return response.data.data;
  },

  // 채팅방 생성 또는 조회
  createOrGetChatRoom: async (request: CreateChatRoomRequest): Promise<CreateChatRoomResponse> => {
    const response = await userClient.post("/chat-room", request);
    return response.data.data;
  },

  // 메시지 목록 조회 (무한 스크롤)
  getMessages: async (roomId: string, params: GetMessagesRequest): Promise<MessageListResponse> => {
    const response = await userClient.get(`/chat-room/${roomId}/messages`, { params });
    return response.data.data;
  },

  // 채팅방 읽음 처리
  markChatRoomAsRead: async (roomId: string): Promise<{ success: boolean }> => {
    const response = await userClient.post(`/chat-room/${roomId}/read`);
    return response.data.data;
  },
};
