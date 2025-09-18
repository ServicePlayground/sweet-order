import { ApiProperty } from "@nestjs/swagger";

/**
 * 에러 응답 DTO
 * Swagger 문서 생성을 위한 에러 응답 클래스
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: "요청 성공 여부",
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: "에러 정보",
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "에러 메시지",
        example: "요청을 처리할 수 없습니다.",
      },
      statusCode: {
        type: "number",
        description: "HTTP 상태 코드",
        example: 400,
      },
      timestamp: {
        type: "string",
        description: "에러 발생 시간",
        example: "2024-01-01T00:00:00.000Z",
      },
      path: {
        type: "string",
        description: "요청 경로",
        example: "/api/health",
      },
      method: {
        type: "string",
        description: "HTTP 메서드",
        example: "GET",
      },
    },
  })
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    method?: string;
  };
}
