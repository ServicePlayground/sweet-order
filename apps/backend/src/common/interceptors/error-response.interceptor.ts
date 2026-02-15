import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { SensitiveDataUtil } from "@apps/backend/common/utils/sensitive-data.util";

/**
 * Error Response Interceptor
 * 모든 예외를 통일된 응답 형태로 처리합니다.
 *
 */
@Catch()
export class ErrorResponseInterceptor implements ExceptionFilter {
  private readonly logger = new Logger(ErrorResponseInterceptor.name);

  /**
   * 예외를 처리하고 클라이언트에게 응답을 전송합니다.
   * @param exception - 발생한 예외 객체
   * @param host - ArgumentsHost 객체 (요청/응답 정보 포함)
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    // HTTP 상태 코드 결정
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 에러 메시지 추출
    const data = exception instanceof HttpException ? exception.getResponse() : "";

    // 통일된 에러 응답 객체 생성
    const errorResponse = {
      success: false,
      data: data,
      timestamp: new Date().toISOString(),
      statusCode: status,
    };

    // 운영 환경에서도 에러 로깅 (민감 정보 제거)
    const sanitizedError = SensitiveDataUtil.sanitizeError(exception);
    const sanitizedData = SensitiveDataUtil.maskSensitiveFields(data);

    // 로그에 민감 정보가 포함되지 않도록 마스킹 처리
    this.logger.error(
      `Error: ${request.method} ${request.url} - ${status}`,
      JSON.stringify(sanitizedData, null, 2),
    );

    // 개발 환경에서만 상세 에러 정보 로깅
    if (process.env.NODE_ENV === "development") {
      this.logger.debug("Error details:", sanitizedError);
    }

    // 클라이언트에게 통일된 JSON 형태로 에러 응답 전송
    response.status(status).json(errorResponse);
  }
}
