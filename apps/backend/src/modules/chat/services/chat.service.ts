import { Injectable } from "@nestjs/common";
import { CreateChatRoomRequestDto } from "@apps/backend/modules/chat/dto/chat-request.dto";
import {
  ChatRoomResponseDto,
  ChatRoomForSellerResponseDto,
} from "@apps/backend/modules/chat/dto/chat-response.dto";
import {
  MessageResponseDto,
  MessageListResponseDto,
} from "@apps/backend/modules/chat/dto/message-response.dto";
import { ChatRoomService } from "./chat-room.service";
import { ChatMessageService } from "./chat-message.service";

/**
 * 채팅 서비스 (Facade)
 *
 * 채팅 관련 모든 기능을 통합하여 제공하는 메인 서비스입니다.
 * ChatRoomService와 ChatMessageService를 조합하여 사용합니다.
 */
@Injectable()
export class ChatService {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  /**
   * 채팅방 생성 또는 조회
   */
  async createOrGetChatRoom(userId: string, createChatRoomDto: CreateChatRoomRequestDto) {
    return await this.chatRoomService.createOrGetChatRoom(userId, createChatRoomDto);
  }

  /**
   * 사용자의 채팅방 목록 조회
   */
  async getChatRoomsByUserId(userId: string): Promise<{ chatRooms: ChatRoomResponseDto[] }> {
    return await this.chatRoomService.getChatRoomsByUserId(userId);
  }

  /**
   * 스토어의 채팅방 목록 조회 (판매자용)
   */
  async getChatRoomsByStoreId(
    storeId: string,
    userId: string,
  ): Promise<{ chatRooms: ChatRoomForSellerResponseDto[] }> {
    return await this.chatRoomService.getChatRoomsByStoreId(storeId, userId);
  }

  /**
   * 채팅방 읽음 처리
   */
  async markChatRoomAsRead(roomId: string, readerId: string, readerType: "user" | "store") {
    return await this.chatRoomService.markChatRoomAsRead(roomId, readerId, readerType);
  }

  /**
   * 메시지 전송
   */
  async sendMessage(
    roomId: string,
    text: string,
    senderId: string,
    senderType: "user" | "store",
  ): Promise<MessageResponseDto> {
    return await this.chatMessageService.sendMessage(roomId, text, senderId, senderType);
  }

  /**
   * 채팅방 메시지 목록 조회 (페이지 기반 페이지네이션)
   */
  async getMessages(
    roomId: string,
    userId: string,
    userType: "user" | "store",
    page: number = 1,
    limit: number = 50,
  ): Promise<MessageListResponseDto> {
    return await this.chatMessageService.getMessages(roomId, userId, userType, page, limit);
  }
}
