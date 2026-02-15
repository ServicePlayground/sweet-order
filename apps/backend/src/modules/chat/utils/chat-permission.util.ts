import { ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import { ChatRoom } from "@apps/backend/infra/database/prisma/generated/client";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

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
   * @throws ForbiddenException 권한이 없을 경우
   */
  static async verifyChatRoomAccess(
    chatRoom: ChatRoom,
    userId: string,
    userType: "user" | "store",
    prisma: PrismaService,
  ): Promise<void> {
    if (userType === "user") {
      if (chatRoom.userId !== userId) {
        LoggerUtil.log(
          `채팅방 접근 권한 없음: 사용자 타입 - userId: ${userId}, chatRoomId: ${chatRoom.id}, chatRoomUserId: ${chatRoom.userId}`,
        );
        throw new ForbiddenException(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND);
      }
    } else {
      // store 타입인 경우, 스토어 소유권 확인
      const store = await prisma.store.findUnique({
        where: { id: chatRoom.storeId },
        select: { userId: true },
      });
      if (!store || store.userId !== userId) {
        LoggerUtil.log(
          `채팅방 접근 권한 없음: 스토어 타입 - userId: ${userId}, chatRoomId: ${chatRoom.id}, storeId: ${chatRoom.storeId}, storeUserId: ${store?.userId || "없음"}`,
        );
        throw new ForbiddenException(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND);
      }
    }
  }
}
