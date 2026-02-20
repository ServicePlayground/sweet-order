import { applyDecorators } from "@nestjs/common";
import { ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { HTTP_STATUS_MESSAGES } from "@apps/backend/common/constants/app.constants";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * Swagger 응답을 위한 커스텀 데코레이터
 * @param statusCode HTTP 상태 코드
 * @param options 응답 데이터 옵션 (dataDto 또는 dataExample 중 하나)
 * @param description 응답 설명 (선택)
 */
export function SwaggerResponse(
  statusCode: number,
  options: { dataDto?: new () => any; dataExample?: object },
  description?: string,
) {
  const success = statusCode >= 200 && statusCode < 300;
  const { dataDto, dataExample } = options;

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
          timestamp: {
            type: "string",
            description: "응답 시간 (ISO 8601)",
          },
          statusCode: {
            type: "number",
            description: "HTTP 상태 코드",
          },
          responseId: {
            type: "string",
            description: "응답 추적을 위한 고유 ID (형식: timestamp-{success|error}-uuid-hex)",
          },
          data: dataDto
            ? { $ref: getSchemaPath(dataDto), description: "응답 데이터" }
            : { type: "object", description: "응답 데이터" },
        },
        ...(dataExample && {
          example: {
            success,
            data: dataExample,
            timestamp: SWAGGER_EXAMPLES.USER_DATA.createdAt,
            statusCode,
            responseId: success
              ? "1735123456789-success-a1b2c3d4-e5f6-7890-abcd-ef1234567890-1a2b3c4d"
              : "1735123456789-error-a1b2c3d4-e5f6-7890-abcd-ef1234567890-1a2b3c4d",
          },
        }),
      },
    }),
  );
}
