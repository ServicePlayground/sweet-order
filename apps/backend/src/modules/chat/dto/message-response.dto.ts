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
 * 페이지네이션 메타 정보 응답 DTO
 */
export class MessagePaginationMetaResponseDto {
  @ApiProperty({
    description: "현재 페이지 번호",
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: "페이지당 항목 수",
    example: 50,
  })
  limit: number;

  @ApiProperty({
    description: "전체 항목 수",
    example: 150,
  })
  totalItems: number;

  @ApiProperty({
    description: "전체 페이지 수",
    example: 3,
  })
  totalPages: number;

  @ApiProperty({
    description: "다음 페이지 존재 여부",
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: "이전 페이지 존재 여부",
    example: false,
  })
  hasPrev: boolean;
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
    type: MessagePaginationMetaResponseDto,
  })
  meta: MessagePaginationMetaResponseDto;
}
