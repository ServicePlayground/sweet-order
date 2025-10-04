import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { HTTP_STATUS_MESSAGES } from "../constants/app.constants";
import { SWAGGER_EXAMPLES } from "@web-user/backend/modules/auth/constants/auth.constants";

/**
 * Swagger 응답을 위한 커스텀 데코레이터
 */
export function SwaggerResponse(statusCode: number, dataExample: object, description?: string) {
  const success = statusCode >= 200 && statusCode < 300;
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      description: description || HTTP_STATUS_MESSAGES[statusCode] || "",
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
          success: success,
          data: dataExample,
          timestamp: SWAGGER_EXAMPLES.USER_DATA.createdAt,
          statusCode: statusCode,
        },
      },
    }),
  );
}
