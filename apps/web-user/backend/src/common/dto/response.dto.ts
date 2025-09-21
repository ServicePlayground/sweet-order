import { ApiProperty } from "@nestjs/swagger";

/**
 * 통일된 API 응답 구조
 * 모든 API 응답이 동일한 형태를 가지도록 보장
 */
export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: "요청 성공 여부",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "응답 데이터",
    example: null,
  })
  data: T;

  @ApiProperty({
    description: "응답 시간 (ISO 8601)",
    example: "2024-01-01T00:00:00.000Z",
  })
  timestamp: string;

  @ApiProperty({
    description: "HTTP 상태 코드",
    example: 200,
  })
  statusCode: number;
}
