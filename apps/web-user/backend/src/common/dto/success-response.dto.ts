import { ApiProperty } from "@nestjs/swagger";

/**
 * 성공 응답 DTO
 * Swagger 문서 생성을 위한 성공 응답 클래스
 */
export class SuccessResponseDto<T = any> {
  @ApiProperty({
    description: "요청 성공 여부",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "응답 데이터",
  })
  data: T;
}
