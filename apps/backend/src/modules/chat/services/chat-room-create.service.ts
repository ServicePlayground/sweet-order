import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import { CreateChatRoomRequestDto } from "@apps/backend/modules/chat/dto/chat-room-create.dto";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 채팅방 생성 서비스
 * 채팅방 생성 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatRoomCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 채팅방 생성 또는 조회 (사용자용)
   * 기존 채팅방이 있으면 반환하고, 없으면 생성합니다.
   */
  async createOrGetChatRoomForUser(userId: string, createChatRoomDto: CreateChatRoomRequestDto) {
    const { storeId } = createChatRoomDto;

    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      LoggerUtil.log(`채팅방 생성 실패: 스토어 없음 - userId: ${userId}, storeId: ${storeId}`);
      throw new NotFoundException(CHAT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    try {
      // 기존 채팅방 조회 또는 생성
      const chatRoom = await this.prisma.chatRoom.upsert({
        where: {
          userId_storeId: {
            userId,
            storeId,
          },
        },
        update: {},
        create: {
          userId,
          storeId,
        },
      });

      return { id: chatRoom.id };
    } catch (error: unknown) {
      LoggerUtil.log(
        `채팅방 생성 실패: 트랜잭션 에러 - userId: ${userId}, storeId: ${storeId}, error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
