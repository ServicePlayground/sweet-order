import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Reflector } from "@nestjs/core";
import { ApiResponseDto } from "@web-user/backend/common/dto/response.dto";

/**
 * Success Response Interceptor
 * 모든 성공적인 API 응답을 통일된 형태로 변환합니다.
 *
 * 사용법:
 * 1. 전역 적용: app.module.ts에서 APP_INTERCEPTOR로 등록
 * 2. 특정 메서드에서 제외: @SkipResponseTransform() 데코레이터 사용
 */

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // SkipResponseTransform 데코레이터가 있는 경우 변환하지 않음
    const skipTransform = this.reflector.get<boolean>(
      "skipResponseTransform",
      context.getHandler(),
    );
    if (skipTransform) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
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

  /**
   * Response 변환을 건너뛰는 데코레이터
   * 특정 엔드포인트에서 기본 응답 형태를 유지하고 싶을 때 사용
   */
  SkipResponseTransform = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      Reflect.defineMetadata("skipResponseTransform", true, descriptor.value);
      return descriptor;
    };
  };
}
