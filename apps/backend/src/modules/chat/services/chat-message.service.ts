import { Injectable, BadRequestException, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  MessageResponseDto,
  MessageListResponseDto,
  MessagePaginationMetaResponseDto,
} from "@apps/backend/modules/chat/dto/message-response.dto";
import { ChatRoomService } from "./chat-room.service";
import { ChatPermissionUtil } from "@apps/backend/modules/chat/utils/chat-permission.util";
import { ChatGateway } from "../gateways/chat.gateway";
import { ChatMapperUtil } from "@apps/backend/modules/chat/utils/chat-mapper.util";

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
    @Inject(forwardRef(() => ChatGateway)) // forwardRef: ChatGateway가 ChatMessageService에서 사용되므로 순환 의존성 방지
    private readonly chatGateway: ChatGateway,
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

    const messageDto = ChatMapperUtil.mapToMessageResponseDto(message);

    // WebSocket으로 메시지 브로드캐스트 (REST API로 전송된 메시지도 실시간으로 전달)
    this.chatGateway.broadcastMessage(roomId, messageDto);

    return messageDto;
  }

  /**
   * 채팅방 메시지 목록 조회 (페이지 기반 페이지네이션)
   */
  async getMessages(
    roomId: string,
    userId: string,
    userType: "user" | "store",
    page: number = 1,
    limit: number = ChatMessageService.DEFAULT_LIMIT,
  ): Promise<MessageListResponseDto> {
    // 채팅방 조회 및 권한 확인
    const chatRoom = await this.chatRoomService.findChatRoomById(roomId);
    await ChatPermissionUtil.verifyChatRoomAccess(chatRoom, userId, userType, this.prisma);

    // limit 검증 및 정규화
    const validatedLimit = this.validateLimit(limit);
    const validatedPage = Math.max(1, page);

    // 전체 메시지 수 조회
    const totalItems = await this.prisma.message.count({
      where: { roomId },
    });

    // 페이지네이션 계산
    const skip = (validatedPage - 1) * validatedLimit;

    // 메시지 조회 (최신 메시지가 먼저 오도록 desc 정렬)
    const messages = await this.prisma.message.findMany({
      where: { roomId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: validatedLimit,
    });

    // 메시지 순서를 reverse하여 오래된 메시지 -> 최신 메시지 순서로 변환
    const reversedMessages = messages
      .reverse()
      .map((msg) => ChatMapperUtil.mapToMessageResponseDto(msg));

    // 페이지네이션 메타 정보 계산
    const totalPages = Math.ceil(totalItems / validatedLimit);
    const hasNext = validatedPage < totalPages;
    const hasPrev = validatedPage > 1;

    const meta: MessagePaginationMetaResponseDto = {
      currentPage: validatedPage,
      limit: validatedLimit,
      totalItems,
      totalPages,
      hasNext,
      hasPrev,
    };

    return {
      messages: reversedMessages,
      meta,
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
    return Math.min(Math.max(ChatMessageService.MIN_LIMIT, limit), ChatMessageService.MAX_LIMIT);
  }
}
