import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import {
  ChatRoomResponseDto,
  ChatRoomForSellerResponseDto,
} from "@apps/backend/modules/chat/dto/chat-room-list.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { ChatMapperUtil } from "@apps/backend/modules/chat/utils/chat-mapper.util";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";

/**
 * 채팅방 목록 서비스
 * 채팅방 목록 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class ChatRoomListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자의 채팅방 목록 조회 (사용자용)
   */
  async getChatRoomsByUserIdForUser(
    userId: string,
    query: PaginationRequestDto,
  ): Promise<{ data: ChatRoomResponseDto[]; meta: any }> {
    const { page, limit } = query;

    // 전체 개수 조회
    const totalItems = await this.prisma.chatRoom.count({
      where: { userId },
    });

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    const chatRooms = await this.prisma.chatRoom.findMany({
      where: { userId },
      include: {
        store: {
          select: ChatMapperUtil.STORE_INFO_SELECT,
        },
      },
      orderBy: {
        lastMessageAt: {
          sort: "desc",
          nulls: "last",
        },
      },
      skip,
      take: limit,
    });

    // 페이지네이션 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: chatRooms.map((chatRoom) => ChatMapperUtil.mapToChatRoomResponseDto(chatRoom)),
      meta,
    };
  }

  /**
   * 스토어의 채팅방 목록 조회 (판매자용)
   */
  async getChatRoomsByStoreIdForSeller(
    storeId: string,
    userId: string,
    query: PaginationRequestDto,
  ): Promise<{ data: ChatRoomForSellerResponseDto[]; meta: any }> {
    // 스토어 존재 여부 및 소유권 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: {
        userId: true,
      },
    });

    if (!store) {
      throw new NotFoundException(CHAT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    if (store.userId !== userId) {
      throw new UnauthorizedException(CHAT_ERROR_MESSAGES.STORE_NOT_OWNED);
    }

    const { page, limit } = query;

    // 전체 개수 조회
    const totalItems = await this.prisma.chatRoom.count({
      where: { storeId },
    });

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    const chatRooms = await this.prisma.chatRoom.findMany({
      where: { storeId },
      include: {
        user: {
          select: ChatMapperUtil.USER_INFO_SELECT,
        },
      },
      orderBy: {
        lastMessageAt: {
          sort: "desc",
          nulls: "last",
        },
      },
      skip,
      take: limit,
    });

    // 페이지네이션 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: chatRooms.map((chatRoom) => ChatMapperUtil.mapToChatRoomForSellerResponseDto(chatRoom)),
      meta,
    };
  }
}
