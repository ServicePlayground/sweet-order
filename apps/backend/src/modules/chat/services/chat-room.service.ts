import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import { CreateChatRoomRequestDto } from "@apps/backend/modules/chat/dto/chat-request.dto";
import {
  ChatRoomResponseDto,
  ChatRoomForSellerResponseDto,
} from "@apps/backend/modules/chat/dto/chat-response.dto";
import { ChatPermissionUtil } from "@apps/backend/modules/chat/utils/chat-permission.util";

/**
 * 채팅방 서비스
 *
 * 채팅방 생성, 조회, 읽음 처리 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatRoomService {
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

  /**
   * 사용자의 채팅방 목록 조회
   */
  async getChatRoomsByUserId(userId: string): Promise<{ chatRooms: ChatRoomResponseDto[] }> {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: { userId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logoImageUrl: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: {
          sort: "desc",
          nulls: "last",
        },
      },
    });

    return {
      chatRooms: chatRooms.map((chatRoom) => ({
        id: chatRoom.id,
        storeId: chatRoom.storeId,
        store: {
          id: chatRoom.store.id,
          name: chatRoom.store.name,
          logoImageUrl: chatRoom.store.logoImageUrl,
        },
        lastMessage: chatRoom.lastMessage,
        lastMessageAt: chatRoom.lastMessageAt,
        userUnread: chatRoom.userUnread,
        storeUnread: chatRoom.storeUnread,
        createdAt: chatRoom.createdAt,
        updatedAt: chatRoom.updatedAt,
      })),
    };
  }

  /**
   * 스토어의 채팅방 목록 조회 (판매자용)
   */
  async getChatRoomsByStoreId(
    storeId: string,
    userId: string,
  ): Promise<{ chatRooms: ChatRoomForSellerResponseDto[] }> {
    // 스토어 존재 여부 및 소유권 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(CHAT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    if (store.userId !== userId) {
      throw new UnauthorizedException(CHAT_ERROR_MESSAGES.STORE_NOT_OWNED);
    }

    const chatRooms = await this.prisma.chatRoom.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: {
          sort: "desc",
          nulls: "last",
        },
      },
    });

    return {
      chatRooms: chatRooms.map((chatRoom) => ({
        id: chatRoom.id,
        userId: chatRoom.userId,
        storeId: chatRoom.storeId,
        user: {
          id: chatRoom.user.id,
          nickname: chatRoom.user.nickname,
          profileImageUrl: chatRoom.user.profileImageUrl,
        },
        lastMessage: chatRoom.lastMessage,
        lastMessageAt: chatRoom.lastMessageAt,
        userUnread: chatRoom.userUnread,
        storeUnread: chatRoom.storeUnread,
        createdAt: chatRoom.createdAt,
        updatedAt: chatRoom.updatedAt,
      })),
    };
  }

  /**
   * 채팅방 읽음 처리
   */
  async markChatRoomAsRead(roomId: string, readerId: string, readerType: "user" | "store") {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!chatRoom) {
      throw new NotFoundException(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND);
    }

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

  /**
   * 채팅방 조회 (내부용)
   */
  async findChatRoomById(roomId: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (!chatRoom) {
      throw new NotFoundException(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND);
    }

    return chatRoom;
  }
}
