import { Logger } from "@nestjs/common";
import * as Sentry from "@sentry/nestjs";

/**
 * Sentry 유틸리티
 * 에러 로깅 및 모니터링을 위한 공통 유틸리티
 */
export class SentryUtil {
  private static readonly logger = new Logger(SentryUtil.name);

  /**
   * 에러를 Sentry로 전송해야 하는지 판단
   * @param statusCode HTTP 상태 코드
   */
    static shouldSendToSentry(
      statusCode: number,
    ): boolean {
      // 5xx 에러는 항상 전송
      if (statusCode >= 400) {
        return true;
      }
  
      // 그 외 4xx 에러는 전송하지 않음 (노이즈 방지)
      return false;
    }

  /**
   * 에러 레벨 결정
   * @param statusCode HTTP 상태 코드
   */
  static getErrorLevel(
    statusCode: number,
  ): Sentry.SeverityLevel {
    // HTTP 상태 코드 기반 레벨 결정
    let level: Sentry.SeverityLevel = "error";
    if (statusCode >= 500) {
      level = "error";
    } else if (statusCode >= 400) {
      level = "warning";
    } else {
      level = "info";
    }
    return level;
  }

  /**
   * 예외를 Sentry로 전송
   * @param exception 예외 객체
   * @param level 에러 레벨
   * @param tags Sentry 태그 (예: { responseId: "xxx" })
   */
  static captureException(
    exception: unknown,
    level: Sentry.SeverityLevel,
    tags?: Record<string, string>,
  ): void {
    try {
      // 예외 전송
      Sentry.captureException(exception, {
        level,
        tags,
      });
    } catch (error) {
      // Sentry 전송 실패 시 로그만 기록
      this.logger.error("Sentry 예외 전송 실패", error);
    }
  }
}