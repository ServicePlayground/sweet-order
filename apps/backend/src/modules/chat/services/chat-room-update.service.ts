import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { ChatPermissionUtil } from "@apps/backend/modules/chat/utils/chat-permission.util";
import { ChatRoomDetailService } from "./chat-room-detail.service";

/**
 * 채팅방 수정 서비스
 * 채팅방 읽음 처리 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatRoomUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRoomDetailService: ChatRoomDetailService,
  ) {}

  /**
   * 채팅방 읽음 처리 (공통)
   */
  async markChatRoomAsRead(roomId: string, readerId: string, readerType: "user" | "store") {
    const chatRoom = await this.chatRoomDetailService.findChatRoomById(roomId);

    // 권한 확인
    await ChatPermissionUtil.verifyChatRoomAccess(chatRoom, readerId, readerType, this.prisma);

    // 읽지 않은 메시지 수 초기화
    const updateData = readerType === "user" ? { userUnread: 0 } : { storeUnread: 0 };

    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: updateData,
    });

    return { success: true };
  }
}
