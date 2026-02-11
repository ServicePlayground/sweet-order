import { ApiProperty } from "@nestjs/swagger";

/**
 * 좋아요 응답 DTO
 */
export class LikeResponseDto {
  @ApiProperty({
    description: "응답 메시지",
    example: "상품에 좋아요를 추가했습니다.",
  })
  message: string;
}
