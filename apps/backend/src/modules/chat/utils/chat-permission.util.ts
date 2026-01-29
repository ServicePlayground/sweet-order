import { UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";

interface ChatRoom {
  id: string;
  userId: string;
  storeId: string;
}

/**
 * 채팅방 권한 확인 유틸리티
 */
export class ChatPermissionUtil {
  /**
   * 사용자 또는 스토어가 채팅방에 접근할 권한이 있는지 확인
   * @param chatRoom 채팅방 정보
   * @param userId 사용자 ID
   * @param userType 사용자 타입 ("user" | "store")
   * @param prisma PrismaService 인스턴스
   * @throws UnauthorizedException 권한이 없을 경우
   */
  static async verifyChatRoomAccess(
    chatRoom: ChatRoom,
    userId: string,
    userType: "user" | "store",
    prisma: PrismaService,
  ): Promise<void> {
    if (userType === "user") {
      if (chatRoom.userId !== userId) {
        throw new UnauthorizedException(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND);
      }
    } else {
      // store 타입인 경우, 스토어 소유권 확인
      const store = await prisma.store.findUnique({
        where: { id: chatRoom.storeId },
      });
      if (!store || store.userId !== userId) {
        throw new UnauthorizedException(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND);
      }
    }
  }
}

