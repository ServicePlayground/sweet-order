import { ChatRoom, Message } from "@apps/backend/infra/database/prisma/generated/client";
import {
  ChatRoomResponseDto,
  ChatRoomForSellerResponseDto,
} from "@apps/backend/modules/chat/dto/chat-response.dto";
import { MessageResponseDto } from "@apps/backend/modules/chat/dto/message-response.dto";

/**
 * 채팅 매핑 유틸리티
 * Prisma 엔티티를 응답 DTO로 변환하는 공통 로직을 제공합니다.
 */
export class ChatMapperUtil {
  /**
   * Prisma Message 엔티티를 MessageResponseDto로 변환
   * @param message - Prisma Message 엔티티
   * @returns MessageResponseDto 객체
   */
  static mapToMessageResponseDto(message: Message): MessageResponseDto {
    return {
      id: message.id,
      roomId: message.roomId,
      text: message.text,
      senderId: message.senderId,
      senderType: message.senderType.toLowerCase() as "user" | "store",
      createdAt: message.createdAt,
    };
  }

  /**
   * Prisma ChatRoom 엔티티를 ChatRoomResponseDto로 변환 (사용자용)
   * @param chatRoom - Prisma ChatRoom 엔티티 (store 포함)
   * @returns ChatRoomResponseDto 객체
   */
  static mapToChatRoomResponseDto(
    chatRoom: ChatRoom & {
      store: {
        id: string;
        name: string;
        logoImageUrl: string | null;
      };
    },
  ): ChatRoomResponseDto {
    return {
      id: chatRoom.id,
      storeId: chatRoom.storeId,
      store: {
        id: chatRoom.store.id,
        name: chatRoom.store.name,
        logoImageUrl: chatRoom.store.logoImageUrl,
      },
      lastMessage: chatRoom.lastMessage,
      lastMessageAt: chatRoom.lastMessageAt,
      userUnread: chatRoom.userUnread,
      storeUnread: chatRoom.storeUnread,
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
    };
  }

  /**
   * Prisma ChatRoom 엔티티를 ChatRoomForSellerResponseDto로 변환 (판매자용)
   * @param chatRoom - Prisma ChatRoom 엔티티 (user 포함)
   * @returns ChatRoomForSellerResponseDto 객체
   */
  static mapToChatRoomForSellerResponseDto(
    chatRoom: ChatRoom & {
      user: {
        id: string;
        nickname: string | null;
        profileImageUrl: string | null;
      };
    },
  ): ChatRoomForSellerResponseDto {
    return {
      id: chatRoom.id,
      userId: chatRoom.userId,
      storeId: chatRoom.storeId,
      user: {
        id: chatRoom.user.id,
        nickname: chatRoom.user.nickname,
        profileImageUrl: chatRoom.user.profileImageUrl,
      },
      lastMessage: chatRoom.lastMessage,
      lastMessageAt: chatRoom.lastMessageAt,
      userUnread: chatRoom.userUnread,
      storeUnread: chatRoom.storeUnread,
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
    };
  }
}
