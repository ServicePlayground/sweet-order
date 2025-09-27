import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { map } from "rxjs/operators";

/**
 * Success Response Interceptor
 * 모든 성공적인 API 응답을 통일된 형태로 변환합니다.
 *
 * 사용법:
 * 1. 전역 적용: app.module.ts에서 APP_INTERCEPTOR로 등록
 */

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T> {
  private readonly logger = new Logger(SuccessResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // 현재는 모든 응답을 변환 (필요시 특정 메서드 제외 로직 추가 가능)

    return next.handle().pipe(
      map((data: string | object) => {
        if (process.env.NODE_ENV === "development") {
          this.logger.debug(`Success: ${request.method} ${request.url} - ${response.statusCode}`);
        }

        // 통일된 응답 형태로 변환
        return {
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
          statusCode: response.statusCode,
        };
      }),
    );
  }
}
