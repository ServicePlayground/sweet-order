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
          },
        }),
      },
    }),
  );
}
