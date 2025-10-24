/**
 * 인증 관련 에러 메시지 상수
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "아이디 또는 비밀번호가 올바르지 않습니다.",
  USER_ID_INVALID_FORMAT: "아이디는 4-20자의 영문, 숫자, 언더스코어만 사용할 수 있습니다.",
  USER_ID_ALREADY_EXISTS: "이미 사용 중인 아이디입니다.",
  PASSWORD_INVALID_FORMAT:
    "비밀번호는 8자 이상의 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 포함해야 합니다.",
  PHONE_INVALID_FORMAT: "올바른 한국 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)",
  PHONE_ALREADY_EXISTS: "이미 사용 중인 휴대폰 번호입니다.",
  PHONE_VERIFICATION_REQUIRED: "휴대폰 인증이 필요합니다.",
  PHONE_VERIFICATION_FAILED: "인증번호가 올바르지 않습니다.",
  VERIFICATION_CODE_INVALID_FORMAT: "인증번호는 6자리 숫자여야 합니다.",
  ACCOUNT_NOT_FOUND: "해당 아이디로 등록된 계정이 없습니다.",
  ACCOUNT_NOT_FOUND_BY_PHONE: "해당 휴대폰 번호로 등록된 계정이 없습니다.",
  GOOGLE_REGISTER_FAILED: "구글 로그인 회원가입에 실패했습니다.",
  /* --------------------------------- 토큰 관련 에러 메시지 --------------------------------- */
  REFRESH_TOKEN_EXPIRED: "[REFRESH_TOKEN_INVALID] 리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.",
  REFRESH_TOKEN_INVALID: "[REFRESH_TOKEN_INVALID] 리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
  REFRESH_TOKEN_MISSING: "[REFRESH_TOKEN_INVALID] 리프레시 토큰이 없습니다. 다시 로그인해주세요.",
  REFRESH_TOKEN_WRONG_TYPE: "[REFRESH_TOKEN_INVALID] 리프레시 토큰의 타입이 올바르지 않습니다. 다시 로그인해주세요.",
  REFRESH_TOKEN_MISSING_REQUIRED_INFO:
    "[REFRESH_TOKEN_INVALID] 리프레시 토큰에 필수 정보가 누락되었습니다. 다시 로그인해주세요.",
  ACCESS_TOKEN_EXPIRED: "[ACCESS_TOKEN_INVALID] 액세스 토큰이 만료되었습니다.",
  ACCESS_TOKEN_INVALID: "[ACCESS_TOKEN_INVALID] 액세스 토큰이 유효하지 않습니다.",
  ACCESS_TOKEN_MISSING: "[ACCESS_TOKEN_INVALID] 액세스 토큰이 없습니다.",
  ACCESS_TOKEN_WRONG_TYPE: "[ACCESS_TOKEN_INVALID] 액세스 토큰의 타입이 올바르지 않습니다.",
  ACCESS_TOKEN_MISSING_REQUIRED_INFO:
    "[ACCESS_TOKEN_INVALID] 액세스 토큰에 필수 정보가 누락되었습니다. 다시 로그인해주세요.",
  /* ----------------------------------------------------------------------------------- */
  ROLE_NOT_AUTHORIZED: "권한(Role)이 없는 사용자입니다.",
  USER_NOT_FOUND: "사용자를 찾을 수 없습니다.",
  ID_PHONE_MISMATCH: "아이디와 휴대폰 번호가 일치하지 않습니다.",
  PHONE_VERIFICATION_EXPIRED: "인증번호가 만료되었습니다.",
  PHONE_MULTIPLE_ACCOUNTS: "해당 휴대폰 번호로 일반 로그인과 구글 로그인 계정이 모두 존재합니다.",
  PHONE_GENERAL_ACCOUNT_EXISTS: "해당 휴대폰 번호로 일반 로그인 계정이 존재합니다.",
  PHONE_GOOGLE_ACCOUNT_EXISTS: "해당 휴대폰 번호로 구글 로그인 계정이 존재합니다.",
  GOOGLE_ID_ALREADY_EXISTS: "이미 사용 중인 구글 계정입니다.",
  GOOGLE_OAUTH_TOKEN_EXCHANGE_FAILED: "구글 OAuth 토큰 교환 실패",
  THROTTLE_LIMIT_EXCEEDED: "ThrottlerException: Too Many Requests",
  UNAUTHORIZED: "Unauthorized",
} as const;

/**
 * 인증 관련 성공 메시지 상수
 */
export const AUTH_SUCCESS_MESSAGES = {
  PHONE_VERIFICATION_SENT: "인증번호가 발송되었습니다.",
  PHONE_VERIFICATION_CONFIRMED: "인증번호가 확인되었습니다.",
  PASSWORD_CHANGED: "비밀번호가 성공적으로 변경되었습니다.",
  PHONE_CHANGED: "휴대폰 번호가 변경되었습니다.",
  ACCESS_TOKEN_REFRESHED: "새로운 Access Token이 발급되었습니다.",
  LOGOUT_SUCCESS: "로그아웃이 완료되었습니다.",
} as const;

export const USER_ROLES = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
} as const;

/**
 * 토큰 타입 상수
 */
export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;

/**
 * JWT 토큰 만료 시간 상수
 */
export const JWT_EXPIRATION = {
  ACCESS_TOKEN: "7d",
  REFRESH_TOKEN: "30d",
} as const;

/**
 * 쿠키 설정 상수
 */
export const COOKIE_CONFIG = {
  ACCESS_TOKEN_NAME: "access_token",
  REFRESH_TOKEN_NAME: "refresh_token",
  DOMAIN: ".sweetorders.com", // 서브도메인 통합을 위한 도메인 // 개발환경 localhost는 도메인 제한이 없어서 배포 환경만 도메인 제한
  HTTP_ONLY: true, // JavaScript 접근 차단 (XSS 공격 방지)
  // SECURE는 configService를 통해 동적으로 설정
  SAME_SITE: "lax" as const, // CSRF 공격 방지 (lax: 서브도메인 간 쿠키 전송 허용)(strict: 서브도메인 간 쿠키 전송 불가)
  ACCESS_TOKEN_MAX_AGE: 604800, // 7일(JWT Access Token과 동일)
  REFRESH_TOKEN_MAX_AGE: 2592000, // 30일(JWT Refresh Token과 동일)
} as const;

/**
 * Swagger 예시 데이터
 * 실제 API 응답과 일치하는 예시 데이터를 제공합니다.
 */
export const SWAGGER_EXAMPLES = {
  USER_DATA: {
    id: "1",
    role: "USER",
    phone: "010-1234-5678",
    name: "홍길동",
    nickname: "홍길동",
    email: "user@example.com",
    profileImageUrl: "https://lh3.googleusercontent.com/a/example",
    isPhoneVerified: true,
    isActive: true,
    userId: "user123",
    googleId: "google123456789",
    googleEmail: "user@gmail.com",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    lastLoginAt: new Date("2024-01-01T00:00:00.000Z"),
  },
  PASSWORD: "Password123!",
  GOOGLE_CODE: "4/0AVGzR1BWFlPYjsU53FD39J4-JQPvDk5mcygFcOM0SBhus6Dw_8UsjZUxCvkKhtVIz92-1w",
  VERIFICATION_CODE: "123456",
} as const;

/**
 * Swagger 응답 예시 데이터
 * 복합 응답 구조를 위한 예시 데이터를 제공합니다.
 */
export const SWAGGER_RESPONSE_EXAMPLES = {
  USER_DATA_RESPONSE: {
    user: SWAGGER_EXAMPLES.USER_DATA,
  },
} as const;

/**
 * Swagger 필드 설명 상수
 * 실제 검증 로직과 일치하는 설명을 제공합니다.
 */
export const SWAGGER_DESCRIPTIONS = {
  USER_ID: "사용자 아이디 (4-20자의 영문, 숫자, 언더스코어만 사용 가능)",
  PASSWORD: "비밀번호 (8자 이상의 영문 대소문자, 숫자, 특수문자(@$!%*?&) 포함)",
  PHONE: "휴대폰 번호 (010, 011, 016, 017, 018, 019로 시작하는 10-11자리)",
  VERIFICATION_CODE: "인증번호 (6자리 숫자)",
  GOOGLE_CODE: "구글에서 받은 Authorization Code",
  GOOGLE_ID: "구글 ID",
  GOOGLE_EMAIL: "구글 이메일",
  REFRESH_TOKEN: "리프레시 토큰",
} as const;
