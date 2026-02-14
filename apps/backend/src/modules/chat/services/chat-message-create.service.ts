import { Injectable, BadRequestException, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { MessageResponseDto } from "@apps/backend/modules/chat/dto/chat-message-list.dto";
import { ChatRoomDetailService } from "./chat-room-detail.service";
import { ChatPermissionUtil } from "@apps/backend/modules/chat/utils/chat-permission.util";
import { ChatGateway } from "../gateways/chat.gateway";
import { ChatMapperUtil } from "@apps/backend/modules/chat/utils/chat-mapper.util";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 채팅 메시지 생성 서비스
 * 메시지 전송 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatMessageCreateService {
  private static readonly MAX_MESSAGE_LENGTH = 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRoomDetailService: ChatRoomDetailService,
    @Inject(forwardRef(() => ChatGateway)) // forwardRef: ChatGateway가 ChatMessageCreateService에서 사용되므로 순환 의존성 방지
    private readonly chatGateway: ChatGateway,
  ) {}

  /**
   * 메시지 전송 (공통)
   */
  async sendMessage(
    roomId: string,
    text: string,
    senderId: string,
    senderType: "user" | "store",
  ): Promise<MessageResponseDto> {
    // 채팅방 조회 및 권한 확인
    const chatRoom = await this.chatRoomDetailService.findChatRoomById(roomId);
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

    const messageDto = ChatMapperUtil.mapToMessageResponseDto(message);

    // WebSocket으로 메시지 브로드캐스트 (REST API로 전송된 메시지도 실시간으로 전달)
    this.chatGateway.broadcastMessage(roomId, messageDto);

    return messageDto;
  }

  /**
   * 메시지 검증 및 정리
   */
  private validateAndTrimMessage(text: string): string {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      throw new BadRequestException("메시지 내용이 비어있습니다.");
    }

    if (trimmedText.length > ChatMessageCreateService.MAX_MESSAGE_LENGTH) {
      throw new BadRequestException(
        `메시지는 ${ChatMessageCreateService.MAX_MESSAGE_LENGTH}자를 초과할 수 없습니다.`,
      );
    }

    return trimmedText;
  }

  /**
   * 마지막 메시지 미리보기 생성
   */
  private createLastMessagePreview(text: string): string {
    return text.length > ChatMessageCreateService.MAX_MESSAGE_LENGTH
      ? text.substring(0, ChatMessageCreateService.MAX_MESSAGE_LENGTH)
      : text;
  }

  /**
   * 채팅방 메타데이터 업데이트
   */
  private async updateChatRoomMetadata(
    tx: Prisma.TransactionClient,
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
}
