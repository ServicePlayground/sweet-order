import { applyDecorators, Type } from "@nestjs/common";
import { ApiResponse as SwaggerApiResponse } from "@nestjs/swagger";
import { ErrorResponseDto } from "@web-user/backend/common/dto/error-response.dto";

/**
 * API 응답 데코레이터
 * Swagger 문서 생성을 위한 표준화된 응답 데코레이터
 */
export function ApiResponse<T>(
  options: {
    success?: boolean;
    status?: number;
    description?: string;
    type?: Type<T>;
    isArray?: boolean;
  } = {},
): MethodDecorator {
  const { success = true, status = 200, description, type, isArray = false } = options;

  const decorators = [];

  // 성공 응답
  if (success) {
    decorators.push(
      SwaggerApiResponse({
        status,
        description: description || "요청이 성공적으로 처리되었습니다.",
        type: type ? (isArray ? [type] : type) : undefined,
      }),
    );
  }

  // 에러 응답들
  decorators.push(
    SwaggerApiResponse({
      status: 400,
      description: "잘못된 요청",
      type: ErrorResponseDto,
    }),
    SwaggerApiResponse({
      status: 404,
      description: "리소스를 찾을 수 없음",
      type: ErrorResponseDto,
    }),
    SwaggerApiResponse({
      status: 500,
      description: "서버 내부 오류",
      type: ErrorResponseDto,
    }),
  );

  return applyDecorators(...decorators);
}
