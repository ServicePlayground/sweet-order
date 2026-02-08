import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";
import { StringToNumber } from "@apps/backend/common/decorators/transform.decorator";
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
  @ApiProperty({
    description: "(무한 스크롤 필수) 페이지 번호 (1부터 시작)",
    example: 1,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: "(무한 스크롤 필수) 조회할 항목 수",
    example: 50,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;
}

/**
 * 채팅방 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetChatRoomsRequestDto {
  @ApiProperty({
    description: "(무한 스크롤 필수) 페이지 번호 (1부터 시작)",
    example: 1,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: "(무한 스크롤 필수) 조회할 항목 수",
    example: 20,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;
}
