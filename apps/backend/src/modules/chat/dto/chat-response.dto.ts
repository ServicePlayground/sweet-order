import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/chat/constants/chat.constants";

/**
 * 채팅방 스토어 정보 응답 DTO
 */
export class ChatRoomStoreResponseDto {
  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.STORE_ID,
  })
  id: string;

  @ApiProperty({
    description: "스토어 이름",
    example: "스위트오더 스토어",
  })
  name: string;

  @ApiPropertyOptional({
    description: "스토어 로고 이미지 URL",
    example: null,
  })
  logoImageUrl: string | null;
}

/**
 * 채팅방 사용자 정보 응답 DTO (판매자용)
 */
export class ChatRoomUserResponseDto {
  @ApiProperty({
    description: "사용자 ID",
    example: SWAGGER_EXAMPLES.USER_ID,
  })
  id: string;

  @ApiPropertyOptional({
    description: "사용자 닉네임",
    example: "홍길동",
  })
  nickname: string | null;

  @ApiPropertyOptional({
    description: "사용자 프로필 이미지 URL",
    example: null,
  })
  profileImageUrl: string | null;
}

/**
 * 채팅방 응답 DTO (사용자용)
 */
export class ChatRoomResponseDto {
  @ApiProperty({
    description: "채팅방 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;

  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.STORE_ID,
  })
  storeId: string;

  @ApiProperty({
    description: "스토어 정보",
    type: ChatRoomStoreResponseDto,
  })
  store: ChatRoomStoreResponseDto;

  @ApiPropertyOptional({
    description: "마지막 메시지",
    example: SWAGGER_EXAMPLES.LAST_MESSAGE,
  })
  lastMessage: string | null;

  @ApiPropertyOptional({
    description: "마지막 메시지 시간",
    example: SWAGGER_EXAMPLES.LAST_MESSAGE_AT,
  })
  lastMessageAt: Date | null;

  @ApiProperty({
    description: "사용자 읽지 않은 메시지 수",
    example: SWAGGER_EXAMPLES.USER_UNREAD,
  })
  userUnread: number;

  @ApiProperty({
    description: "판매자 읽지 않은 메시지 수",
    example: SWAGGER_EXAMPLES.STORE_UNREAD,
  })
  storeUnread: number;

  @ApiProperty({
    description: "생성일시",
    example: SWAGGER_EXAMPLES.CREATED_AT,
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정일시",
    example: SWAGGER_EXAMPLES.UPDATED_AT,
  })
  updatedAt: Date;
}

/**
 * 채팅방 응답 DTO (판매자용)
 */
export class ChatRoomForSellerResponseDto {
  @ApiProperty({
    description: "채팅방 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;

  @ApiProperty({
    description: "사용자 ID",
    example: SWAGGER_EXAMPLES.USER_ID,
  })
  userId: string;

  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.STORE_ID,
  })
  storeId: string;

  @ApiProperty({
    description: "사용자 정보",
    type: ChatRoomUserResponseDto,
  })
  user: ChatRoomUserResponseDto;

  @ApiPropertyOptional({
    description: "마지막 메시지",
    example: SWAGGER_EXAMPLES.LAST_MESSAGE,
  })
  lastMessage: string | null;

  @ApiPropertyOptional({
    description: "마지막 메시지 시간",
    example: SWAGGER_EXAMPLES.LAST_MESSAGE_AT,
  })
  lastMessageAt: Date | null;

  @ApiProperty({
    description: "사용자 읽지 않은 메시지 수",
    example: SWAGGER_EXAMPLES.USER_UNREAD,
  })
  userUnread: number;

  @ApiProperty({
    description: "판매자 읽지 않은 메시지 수",
    example: SWAGGER_EXAMPLES.STORE_UNREAD,
  })
  storeUnread: number;

  @ApiProperty({
    description: "생성일시",
    example: SWAGGER_EXAMPLES.CREATED_AT,
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정일시",
    example: SWAGGER_EXAMPLES.UPDATED_AT,
  })
  updatedAt: Date;
}

/**
 * 채팅방 목록 응답 DTO (사용자용)
 */
export class ChatRoomListResponseDto {
  @ApiProperty({
    description: "채팅방 목록",
    type: [ChatRoomResponseDto],
  })
  chatRooms: ChatRoomResponseDto[];
}

/**
 * 채팅방 목록 응답 DTO (판매자용)
 */
export class ChatRoomListForSellerResponseDto {
  @ApiProperty({
    description: "채팅방 목록",
    type: [ChatRoomForSellerResponseDto],
  })
  chatRooms: ChatRoomForSellerResponseDto[];
}

