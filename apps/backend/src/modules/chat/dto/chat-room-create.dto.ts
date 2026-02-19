import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
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
 * 채팅방 생성 응답 DTO
 */
export class CreateChatRoomResponseDto {
  @ApiProperty({
    description: "채팅방 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;
}
