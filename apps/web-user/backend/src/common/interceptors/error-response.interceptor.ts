import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ErrorResponseDto } from "@web-user/backend/common/dto/error-response.dto";

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
    const response = ctx.getResponse<Response>();

    // HTTP 상태 코드 결정
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 에러 메시지 추출
    const message = exception instanceof HttpException ? exception.getResponse() : "";

    // 메시지 처리 로직 개선
    let errorMessage: string | object;
    if (typeof message === "string") {
      errorMessage = message;
    } else if (typeof message === "object" && message !== null) {
      // 객체인 경우 그대로 전달
      errorMessage = message;
    } else {
      errorMessage = "요청 처리 중 오류가 발생했습니다.";
    }

    // 통일된 에러 응답 객체 생성
    const errorResponse: ErrorResponseDto = {
      success: false,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      statusCode: status,
    };

    // 클라이언트에게 통일된 JSON 형태로 에러 응답 전송
    response.status(status).json(errorResponse);
  }
}
