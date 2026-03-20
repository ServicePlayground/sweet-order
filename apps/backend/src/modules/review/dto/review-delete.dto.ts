import { ApiProperty } from "@nestjs/swagger";
import { REVIEW_SUCCESS_MESSAGES } from "@apps/backend/modules/review/constants/review.constants";

/**
 * 후기 삭제 응답 DTO
 */
export class ReviewDeleteResponseDto {
  @ApiProperty({
    description: "응답 메시지",
    example: REVIEW_SUCCESS_MESSAGES.REVIEW_DELETED,
  })
  message: string;
}
