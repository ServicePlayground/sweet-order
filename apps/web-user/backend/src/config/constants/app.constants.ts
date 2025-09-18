/**
 * 애플리케이션 상수 정의
 * 전역적으로 사용되는 상수들을 중앙 집중식으로 관리합니다.
 */

// 서비스 정보
export const SERVICE_INFO = {
  NAME: "web-user-backend",
  VERSION: "1.0.0",
  DESCRIPTION: "Sweet Order 웹 사용자 백엔드 API",
} as const;

// API 접두사
export const API_PREFIX = "/v1" as const;

// API 경로
export const API_PATHS = {
  DOCS: `${API_PREFIX}/docs`,
  HEALTH: `${API_PREFIX}/health`,
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NOT_FOUND: "Not Found",
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
} as const;

// .env 환경 변수 키
export const CONFIG_KEYS = {
  PORT: "PORT",
  NODE_ENV: "NODE_ENV",
  CORS_ORIGIN: "CORS_ORIGIN",
  CORS_CREDENTIALS: "CORS_CREDENTIALS",
  CORS_METHODS: "CORS_METHODS",
  CORS_ALLOWED_HEADERS: "CORS_ALLOWED_HEADERS",
  CORS_MAX_AGE: "CORS_MAX_AGE",
} as const;
