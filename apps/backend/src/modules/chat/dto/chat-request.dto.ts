import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from "class-validator";
import { OptionalStringToNumber } from "@apps/backend/common/decorators/transform.decorator";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/chat/constants/chat.constants";

/**
 * 채팅방 생성 요청 DTO
 */
export class CreateChatRoomRequestDto {
  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.STORE_ID,
  })
  @IsString()
  @IsNotEmpty()
  storeId: string;
}

/**
 * 메시지 목록 조회 요청 DTO (페이지 기반 페이지네이션)
 */
export class GetMessagesRequestDto {
  @ApiPropertyOptional({
    description: "(무한 스크롤) 페이지 번호 (1부터 시작, 기본값: 1)",
    example: 1,
    default: 1,
  })
  @OptionalStringToNumber()
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: "(무한 스크롤) 조회할 항목 수 (기본값: 50, 최소: 1, 최대: 100)",
    example: 50,
    default: 50,
  })
  @OptionalStringToNumber()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
