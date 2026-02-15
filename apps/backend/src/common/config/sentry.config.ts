import * as Sentry from "@sentry/nestjs";

/**
 * Sentry 초기화 설정
 * - 개발 환경: Sentry 비활성화
 * - 검증 환경(staging): Sentry 활성화
 * - 상용 환경(production): Sentry 활성화
 */
const nodeEnv = process.env.NODE_ENV || "development";
const sentryDsn = process.env.SENTRY_DSN;

// 검증(staging) 또는 상용(production) 환경에서만 Sentry 초기화
if ((nodeEnv === "staging" || nodeEnv === "production") && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: nodeEnv, // 환경 태그 추가
    // 샘플링 비율 설정 (100% = 모든 에러 전송, 비용 절감을 위해 조정 가능)
    tracesSampleRate: nodeEnv === "production" ? 0.1 : 1.0, // 상용: 10%, 검증: 100%
    // 기본 PII 데이터 수집 비활성화 (개인정보 보호)
    sendDefaultPii: false,
    // 에러 필터링 비활성화 - 모든 에러를 Sentry로 전송
    // (ErrorResponseInterceptor에서 이미 400 이상만 필터링하므로 여기서는 모든 에러 전송)
    ignoreErrors: [],
    beforeSend(event) {
      // 모든 에러를 전송 (필터링하지 않음)
      // ErrorResponseInterceptor에서 이미 400 이상만 전송하도록 필터링했으므로
      // 여기서는 추가 필터링 없이 모든 에러를 전송
      return event;
    },
  });
}

