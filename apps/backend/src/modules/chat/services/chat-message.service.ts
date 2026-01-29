import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import { MessageResponseDto } from "@apps/backend/modules/chat/dto/message-response.dto";
import { ChatRoomService } from "./chat-room.service";
import { ChatPermissionUtil } from "@apps/backend/modules/chat/utils/chat-permission.util";

/**
 * 채팅 메시지 서비스
 *
 * 메시지 전송 및 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatMessageService {
  private static readonly MAX_MESSAGE_LENGTH = 1000;
  private static readonly MIN_LIMIT = 1;
  private static readonly MAX_LIMIT = 100;
  private static readonly DEFAULT_LIMIT = 50;

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  /**
   * 메시지 전송
   */
  async sendMessage(
    roomId: string,
    text: string,
    senderId: string,
    senderType: "user" | "store",
  ): Promise<MessageResponseDto> {
    // 채팅방 조회 및 권한 확인
    const chatRoom = await this.chatRoomService.findChatRoomById(roomId);
    await ChatPermissionUtil.verifyChatRoomAccess(chatRoom, senderId, senderType, this.prisma);

    // 메시지 검증
    const trimmedText = this.validateAndTrimMessage(text);

    // 마지막 메시지 미리보기 생성
    const lastMessagePreview = this.createLastMessagePreview(trimmedText);

    // 트랜잭션으로 메시지 생성과 채팅방 업데이트를 원자적으로 처리
    const message = await this.prisma.$transaction(async (tx) => {
      // 메시지 생성
      const createdMessage = await tx.message.create({
        data: {
          roomId,
          text: trimmedText,
          senderId,
          senderType: senderType.toUpperCase() as "USER" | "STORE",
        },
      });

      // 채팅방 메타데이터 업데이트
      await this.updateChatRoomMetadata(tx, roomId, lastMessagePreview, senderType);

      return createdMessage;
    });

    return this.mapToMessageResponseDto(message);
  }

  /**
   * 채팅방 메시지 목록 조회
   */
  async getMessages(
    roomId: string,
    userId: string,
    userType: "user" | "store",
    limit: number = ChatMessageService.DEFAULT_LIMIT,
    cursor?: string,
  ): Promise<{ messages: MessageResponseDto[]; nextCursor?: string }> {
    // 채팅방 조회 및 권한 확인
    const chatRoom = await this.chatRoomService.findChatRoomById(roomId);
    await ChatPermissionUtil.verifyChatRoomAccess(chatRoom, userId, userType, this.prisma);

    // limit 검증 및 정규화
    const validatedLimit = this.validateLimit(limit);

    // 메시지 조회
    const where = cursor ? { roomId, id: { lt: cursor } } : { roomId };

    const messages = await this.prisma.message.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: validatedLimit + 1, // 다음 페이지 존재 여부 확인을 위해 +1
    });

    // 페이지네이션 처리
    const hasNextPage = messages.length > validatedLimit;
    const messagesToReturn = hasNextPage ? messages.slice(0, validatedLimit) : messages;
    const nextCursor = hasNextPage ? messagesToReturn[messagesToReturn.length - 1].id : undefined;

    return {
      messages: messagesToReturn.reverse().map((msg) => this.mapToMessageResponseDto(msg)),
      nextCursor,
    };
  }

  /**
   * 메시지 검증 및 정리
   */
  private validateAndTrimMessage(text: string): string {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      throw new BadRequestException("메시지 내용이 비어있습니다.");
    }

    if (trimmedText.length > ChatMessageService.MAX_MESSAGE_LENGTH) {
      throw new BadRequestException(
        `메시지는 ${ChatMessageService.MAX_MESSAGE_LENGTH}자를 초과할 수 없습니다.`,
      );
    }

    return trimmedText;
  }

  /**
   * 마지막 메시지 미리보기 생성
   */
  private createLastMessagePreview(text: string): string {
    return text.length > ChatMessageService.MAX_MESSAGE_LENGTH
      ? text.substring(0, ChatMessageService.MAX_MESSAGE_LENGTH)
      : text;
  }

  /**
   * 채팅방 메타데이터 업데이트
   */
  private async updateChatRoomMetadata(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx: any,
    roomId: string,
    lastMessagePreview: string,
    senderType: "user" | "store",
  ): Promise<void> {
    const updateData = {
      lastMessage: lastMessagePreview,
      lastMessageAt: new Date(),
      ...(senderType === "user"
        ? { storeUnread: { increment: 1 } }
        : { userUnread: { increment: 1 } }),
    };

    await tx.chatRoom.update({
      where: { id: roomId },
      data: updateData,
    });
  }

  /**
   * limit 검증 및 정규화
   */
  private validateLimit(limit: number): number {
    return Math.min(
      Math.max(ChatMessageService.MIN_LIMIT, limit),
      ChatMessageService.MAX_LIMIT,
    );
  }

  /**
   * Prisma Message를 MessageResponseDto로 변환
   */
  private mapToMessageResponseDto(message: any): MessageResponseDto {
    return {
      id: message.id,
      roomId: message.roomId,
      text: message.text,
      senderId: message.senderId,
      senderType: (message.senderType.toLowerCase() as "user" | "store"),
      createdAt: message.createdAt,
    };
  }
}

