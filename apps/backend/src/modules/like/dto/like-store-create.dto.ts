import { ApiProperty } from "@nestjs/swagger";
import { LIKE_SUCCESS_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";

/**
 * 스토어 좋아요 추가 응답 DTO
 */
export class LikeStoreResponseDto {
  @ApiProperty({
    description: "응답 메시지",
    example: LIKE_SUCCESS_MESSAGES.STORE_LIKE_ADDED,
  })
  message: string;
}
