import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { HTTP_STATUS_MESSAGES } from "../constants/app.constants";

/**
 * 성공 응답을 위한 커스텀 데코레이터
 */
// SuccessResponseDto 형식과 동일하게 사용
export function ApiSuccessResponse<T = any>(
  statusCode: number,
  dataExample?: T,
  description?: string,
): any {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      description: description || (HTTP_STATUS_MESSAGES as any)[statusCode] || "요청 성공",
      schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "요청 성공 여부",
          },
          data: {
            type: "object",
            description: "응답 데이터",
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
          success: true,
          data: dataExample,
          timestamp: "2024-01-01T00:00:00.000Z",
          statusCode: statusCode,
        },
      },
    }),
  );
}
