/**
 * 채팅 API 타입 (백엔드 chat DTO와 1:1 정합)
 * - 채팅방 목록: GetChatRoomsRequestDto, ChatRoomListForSellerResponseDto
 * - 메시지 목록: GetMessagesRequestDto, MessageListResponseDto (data + meta)
 */

import type { ListResponseDto } from "@/apps/web-seller/common/types/api.dto";

export interface ChatRoomUserResponseDto {
  id: string;
  nickname: string | null;
  profileImageUrl: string | null;
}

export interface ChatRoomForSellerResponseDto {
  id: string;
  user: ChatRoomUserResponseDto;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  userUnread: number;
  storeUnread: number;
  createdAt: Date;
  updatedAt: Date;
}

/** 스토어별 채팅방 목록 조회 요청 (page, limit) */
export interface GetChatRoomsRequestDto {
  page: number;
  limit: number;
}

export type ChatRoomListForSellerResponseDto = ListResponseDto<ChatRoomForSellerResponseDto>;

/** 메시지 목록 조회 요청 */
export interface GetMessagesRequestDto {
  page: number;
  limit: number;
}

export type MessageSenderType = "user" | "store";

/** 메시지 단일 항목 (공통 MessageResponseDto와 구분) */
export interface ChatMessageResponseDto {
  id: string;
  roomId: string;
  text: string;
  senderId: string;
  senderType: MessageSenderType;
  createdAt: Date;
}

/** 메시지 목록 응답 (백엔드: data + meta) */
export type MessageListResponseDto = ListResponseDto<ChatMessageResponseDto>;
