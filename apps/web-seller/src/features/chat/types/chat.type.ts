import { PaginationMeta } from "@/apps/web-seller/common/types/api.type";

// 채팅방 사용자 정보 (판매자용)
export interface ChatRoomUser {
  id: string;
  nickname: string | null;
  profileImageUrl: string | null;
}

// 채팅방 정보 (판매자용)
export interface ChatRoomForSeller {
  id: string;
  userId: string;
  storeId: string;
  user: ChatRoomUser;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  userUnread: number;
  storeUnread: number;
  createdAt: Date;
  updatedAt: Date;
}

// 채팅방 목록 응답 (판매자용)
export interface ChatRoomListForSellerResponse {
  data: ChatRoomForSeller[];
  meta: PaginationMeta;
}

/**
 * 채팅방 목록 조회 쿼리 키용 파라미터 (page 제외)
 */
export interface GetChatRoomsParams {
  limit: number;
}

/**
 * 채팅방 목록 조회 요청 파라미터
 */
export interface GetChatRoomsRequest extends GetChatRoomsParams {
  page: number;
}

/**
 * 메시지 목록 조회 쿼리 키용 파라미터 (page 제외)
 */
export interface GetMessagesParams {
  limit: number;
}

/**
 * 메시지 목록 조회 요청 파라미터
 */
export interface GetMessagesRequest extends GetMessagesParams {
  page: number;
}

// 메시지 정보
export interface Message {
  id: string;
  roomId: string;
  text: string;
  senderId: string;
  senderType: "user" | "store";
  createdAt: Date;
}

// 페이지네이션 메타 정보
export interface MessagePaginationMeta {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 메시지 목록 응답
export interface MessageListResponse {
  messages: Message[];
  meta: MessagePaginationMeta;
}

// 메시지 전송 요청
export interface SendMessageRequest {
  text: string;
}
