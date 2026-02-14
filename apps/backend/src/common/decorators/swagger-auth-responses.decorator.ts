import { applyDecorators } from "@nestjs/common";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { AUTH_ERROR_MESSAGES } from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 인증 관련 401 응답을 자동으로 추가하는 데코레이터
 * 로그인이 필요한 엔드포인트에서 사용합니다.
 */
export function SwaggerAuthResponses() {
  return applyDecorators(
    SwaggerResponse(401, {
      dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
    }),
    SwaggerResponse(401, {
      dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
    }),
    SwaggerResponse(401, {
      dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
    }),
    SwaggerResponse(401, {
      dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
    }),
  );
}
