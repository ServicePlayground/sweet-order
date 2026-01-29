import { ApiProperty } from "@nestjs/swagger";

/**
 * 메시지 응답 DTO
 */
export class MessageResponseDto {
  @ApiProperty({
    description: "메시지 ID",
    example: "cm1234567890",
  })
  id: string;

  @ApiProperty({
    description: "채팅방 ID",
    example: "cm0987654321",
  })
  roomId: string;

  @ApiProperty({
    description: "메시지 내용",
    example: "안녕하세요, 케이크 주문하고 싶어요.",
  })
  text: string;

  @ApiProperty({
    description: "발신자 ID",
    example: "user123",
  })
  senderId: string;

  @ApiProperty({
    description: "발신자 타입",
    example: "user",
    enum: ["user", "store"],
  })
  senderType: "user" | "store";

  @ApiProperty({
    description: "생성일시",
    example: "2024-01-01T12:00:00.000Z",
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
  messages: MessageResponseDto[];

  @ApiProperty({
    description: "다음 페이지 커서 (페이지네이션용)",
    example: "cm1234567890",
    required: false,
  })
  nextCursor?: string;
}

