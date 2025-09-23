import { ApiProperty } from "@nestjs/swagger";

/**
 * 기본 에러 응답 DTO 클래스
 * 인터셉터에서 사용하기 위한 기본 클래스
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: "요청 성공 여부",
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: "에러 메시지",
    example: "요청 처리 중 오류가 발생했습니다.",
  })
  message: string;

  @ApiProperty({
    description: "응답 시간 (ISO 8601)",
    example: "2024-01-01T00:00:00.000Z",
  })
  timestamp: string;

  @ApiProperty({
    description: "HTTP 상태 코드",
    example: 500,
  })
  statusCode: number;
}
