import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * 전역 예외 필터
 * Express의 errorHandler 미들웨어를 NestJS 예외 필터로 마이그레이션
 *
 * 주요 기능:
 * - 모든 예외를 일관된 형식으로 처리
 * - 에러 로깅 (서버 콘솔에 상세 정보 출력)
 * - 클라이언트에게 일관된 에러 응답 형식 제공
 * - HTTP 상태 코드 자동 매핑
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * 예외를 처리하고 클라이언트에게 응답을 전송합니다.
   * @param exception - 발생한 예외 객체
   * @param host - ArgumentsHost 객체 (요청/응답 정보 포함)
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HTTP 상태 코드 결정
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 에러 메시지 추출
    const message =
      exception instanceof HttpException ? exception.getResponse() : "Internal Server Error";

    // 에러 응답 객체 생성
    const errorResponse = {
      success: false,
      error: {
        message: typeof message === "string" ? message : (message as any).message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    };

    // 서버 콘솔에 에러 정보 로깅 (Express의 errorHandler와 동일)
    this.logger.error(
      `Error: ${JSON.stringify({
        message: typeof message === "string" ? message : (message as any).message,
        stack: exception instanceof Error ? exception.stack : undefined,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      })}`,
    );

    // 클라이언트에게 JSON 형태로 에러 응답 전송
    response.status(status).json(errorResponse);
  }
}
