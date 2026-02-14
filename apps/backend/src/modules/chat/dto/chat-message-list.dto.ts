import { ApiProperty } from "@nestjs/swagger";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import {
  SWAGGER_EXAMPLES,
  MessageSenderType,
} from "@apps/backend/modules/chat/constants/chat.constants";

/**
 * 메시지 응답 DTO
 */
export class MessageResponseDto {
  @ApiProperty({
    description: "메시지 ID",
    example: SWAGGER_EXAMPLES.MESSAGE_ID,
  })
  id: string;

  @ApiProperty({
    description: "채팅방 ID",
    example: SWAGGER_EXAMPLES.ROOM_ID,
  })
  roomId: string;

  @ApiProperty({
    description: "메시지 내용",
    example: SWAGGER_EXAMPLES.LAST_MESSAGE,
  })
  text: string;

  @ApiProperty({
    description: "발신자 ID",
    example: SWAGGER_EXAMPLES.USER_ID,
  })
  senderId: string;

  @ApiProperty({
    description: "발신자 타입",
    enum: MessageSenderType,
    example: MessageSenderType.USER,
  })
  senderType: MessageSenderType;

  @ApiProperty({
    description: "생성일시",
    example: SWAGGER_EXAMPLES.CREATED_AT,
  })
  createdAt: Date;
}

/**
 * 메시지 목록 응답 DTO
 */
export class MessageListResponseDto {
  @ApiProperty({
    description: "메시지 목록",
    type: [MessageResponseDto],
  })
  data: MessageResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
