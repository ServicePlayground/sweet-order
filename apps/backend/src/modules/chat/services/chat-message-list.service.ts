import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { MessageListResponseDto } from "@apps/backend/modules/chat/dto/chat-message-list.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { ChatRoomDetailService } from "./chat-room-detail.service";
import { ChatPermissionUtil } from "@apps/backend/modules/chat/utils/chat-permission.util";
import { ChatMapperUtil } from "@apps/backend/modules/chat/utils/chat-mapper.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";

/**
 * 채팅 메시지 목록 서비스
 * 메시지 목록 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatMessageListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRoomDetailService: ChatRoomDetailService,
  ) {}

  /**
   * 채팅방 메시지 목록 조회 (공통)
   * 페이지 기반 페이지네이션을 지원합니다.
   */
  async getMessages(
    roomId: string,
    userId: string,
    userType: "user" | "store",
    query: PaginationRequestDto,
  ): Promise<MessageListResponseDto> {
    // 채팅방 조회 및 권한 확인
    const chatRoom = await this.chatRoomDetailService.findChatRoomById(roomId);
    await ChatPermissionUtil.verifyChatRoomAccess(chatRoom, userId, userType, this.prisma);

    const { page, limit } = query;

    // 전체 메시지 수 조회
    const totalItems = await this.prisma.message.count({
      where: { roomId },
    });

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 메시지 조회 (최신 메시지가 먼저 오도록 desc 정렬)
    const messages = await this.prisma.message.findMany({
      where: { roomId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: limit,
    });

    // 메시지 순서를 reverse하여 오래된 메시지 -> 최신 메시지 순서로 변환
    const reversedMessages = messages
      .reverse()
      .map((msg) => ChatMapperUtil.mapToMessageResponseDto(msg));

    // 페이지네이션 메타 정보 계산
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: reversedMessages,
      meta,
    };
  }
}
