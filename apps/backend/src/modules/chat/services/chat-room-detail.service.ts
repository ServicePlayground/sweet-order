import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 채팅방 상세 서비스
 * 채팅방 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatRoomDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 채팅방 조회 (내부용)
   */
  async findChatRoomById(roomId: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!chatRoom) {
      LoggerUtil.log(`채팅방 조회 실패: 채팅방 없음 - roomId: ${roomId}`);
      throw new NotFoundException(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND);
    }

    return chatRoom;
  }
}
