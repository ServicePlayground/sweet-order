import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { HTTP_STATUS_MESSAGES } from "../constants/app.constants";

/**
 * 에러 응답을 위한 커스텀 데코레이터
 */
// ErrorResponseDto 형식과 동일하게 사용
export function ApiErrorResponse(statusCode: number, message?: string, description?: string): any {
  const errorMessage =
    message || (HTTP_STATUS_MESSAGES as any)[statusCode] || "요청 처리 중 오류가 발생했습니다.";

  return applyDecorators(
    ApiResponse({
      status: statusCode,
      description: description || (HTTP_STATUS_MESSAGES as any)[statusCode] || "요청 실패",
      schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "요청 성공 여부",
          },
          message: {
            type: "string",
            description: "에러 메시지",
          },
          timestamp: {
            type: "string",
            description: "응답 시간 (ISO 8601)",
          },
          statusCode: {
            type: "number",
            description: "HTTP 상태 코드",
          },
        },
        example: {
          success: false,
          message: errorMessage,
          timestamp: "2024-01-01T00:00:00.000Z",
          statusCode: statusCode,
        },
      },
    }),
  );
}
