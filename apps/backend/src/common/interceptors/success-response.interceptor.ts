import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { map } from "rxjs/operators";
import { randomUUID } from "crypto";
import { randomBytes } from "crypto";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * Success Response Interceptor
 * 모든 성공적인 API 응답을 통일된 형태로 변환합니다.
 *
 * 사용법:
 * 1. 전역 적용: app.module.ts에서 APP_INTERCEPTOR로 등록
 */

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Response ID 생성 (성공 응답 구분자 포함)
    const responseId = `${Date.now()}-success-${randomUUID()}-${randomBytes(4).toString("hex")}`;

    // Response 헤더에 추가 (클라이언트가 추적할 수 있도록)
    response.setHeader("X-Response-ID", responseId);

    // 현재는 모든 응답을 변환 (필요시 특정 메서드 제외 로직 추가 가능)

    return next.handle().pipe(
      map((data: object) => {
        LoggerUtil.log(
          `[${responseId}] Success: ${request.method} ${request.url} - ${response.statusCode}`,
        );

        // 통일된 응답 형태로 변환
        return {
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
          statusCode: response.statusCode,
          responseId: responseId,
        };
      }),
    );
  }
}
