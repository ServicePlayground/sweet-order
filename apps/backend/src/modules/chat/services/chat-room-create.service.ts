import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import { CreateChatRoomRequestDto } from "@apps/backend/modules/chat/dto/chat-request.dto";

/**
 * 채팅방 생성 서비스
 * 채팅방 생성 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatRoomCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 채팅방 생성 또는 조회
   * 기존 채팅방이 있으면 반환하고, 없으면 생성합니다.
   */
  async createOrGetChatRoom(userId: string, createChatRoomDto: CreateChatRoomRequestDto) {
    const { storeId } = createChatRoomDto;

    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(CHAT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

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
  }
}
