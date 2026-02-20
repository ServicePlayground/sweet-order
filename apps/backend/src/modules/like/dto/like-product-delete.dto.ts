import { ApiProperty } from "@nestjs/swagger";
import { LIKE_SUCCESS_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";

/**
 * 상품 좋아요 삭제 응답 DTO
 */
export class LikeProductDeleteResponseDto {
  @ApiProperty({
    description: "응답 메시지",
    example: LIKE_SUCCESS_MESSAGES.PRODUCT_LIKE_REMOVED,
  })
  message: string;
}
