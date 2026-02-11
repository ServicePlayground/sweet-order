import { Controller, Get, Post, Param, Request, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { ChatService } from "@apps/backend/modules/chat/chat.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { AuthenticatedUser, JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { CHAT_ERROR_MESSAGES } from "@apps/backend/modules/chat/constants/chat.constants";
import {
  GetMessagesRequestDto,
  GetChatRoomsRequestDto,
} from "@apps/backend/modules/chat/dto/chat-request.dto";
import {
  ChatRoomListForSellerResponseDto,
  ChatRoomForSellerResponseDto,
} from "@apps/backend/modules/chat/dto/chat-response.dto";
import { MessageListResponseDto } from "@apps/backend/modules/chat/dto/message-response.dto";

/**
 * 채팅 관련 컨트롤러 (판매자용)
 * 채팅방과 메시지 관리를 통합적으로 처리합니다.
 */
@ApiTags("채팅")
@ApiExtraModels(
  ChatRoomListForSellerResponseDto,
  ChatRoomForSellerResponseDto,
  MessageListResponseDto,
)
@Controller(`${USER_ROLES.SELLER}/chat-room`)
@Auth({ isPublic: false, roles: ["SELLER", "ADMIN"] })
export class SellerChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * 스토어의 채팅방 목록 조회 API
   * 특정 스토어의 모든 채팅방 목록을 조회합니다.
   */
  @Get("store/:storeId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 스토어의 채팅방 목록 조회",
    description:
      "특정 스토어의 모든 채팅방 목록을 조회합니다. 마지막 메시지 시간 기준으로 정렬됩니다. 자신이 소유한 스토어만 조회 가능합니다. 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: ChatRoomListForSellerResponseDto })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(403, {
    dataExample: createMessageObject(CHAT_ERROR_MESSAGES.STORE_NOT_OWNED),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject(CHAT_ERROR_MESSAGES.STORE_NOT_FOUND) })
  async getChatRoomsByStore(
    @Param("storeId") storeId: string,
    @Request() req: { user: JwtVerifiedPayload },
    @Query() query: GetChatRoomsRequestDto,
  ) {
    return await this.chatService.getChatRoomsByStoreId(storeId, req.user.sub, query);
  }

  /**
   * 채팅방 읽음 처리 API (판매자용)
   * 채팅방 입장 시 판매자의 읽지 않은 메시지 수를 초기화합니다.
   */
  @Post(":roomId/read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 채팅방 읽음 처리",
    description: "채팅방 입장 시 판매자의 읽지 않은 메시지 수를 0으로 초기화합니다.",
  })
  @SwaggerResponse(200, { dataExample: { success: true } })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND),
  })
  async markAsRead(@Param("roomId") roomId: string, @Request() req: { user: AuthenticatedUser }) {
    return await this.chatService.markChatRoomAsRead(roomId, req.user.sub, "store");
  }

  /**
   * 메시지 목록 조회 API
   */
  @Get(":roomId/messages")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 메시지 목록 조회",
    description: "채팅방의 메시지 목록을 조회합니다. 페이지 기반 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: MessageListResponseDto })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(CHAT_ERROR_MESSAGES.CHAT_ROOM_NOT_FOUND),
  })
  async getMessages(
    @Param("roomId") roomId: string,
    @Query() query: GetMessagesRequestDto,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return await this.chatService.getMessages(roomId, req.user.sub, "store", query);
  }
}
