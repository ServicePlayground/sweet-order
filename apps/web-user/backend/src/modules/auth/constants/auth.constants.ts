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
  INVALID_REFRESH_TOKEN: "유효하지 않은 리프레시 토큰입니다.",
  USER_NOT_FOUND: "사용자를 찾을 수 없습니다.",
  ID_PHONE_MISMATCH: "아이디와 휴대폰 번호가 일치하지 않습니다.",
  PHONE_VERIFICATION_EXPIRED: "인증번호가 만료되었습니다.",
  INVALID_TOKEN_TYPE: "유효하지 않은 토큰 타입입니다.",
  TOKEN_MISSING_REQUIRED_INFO: "토큰에 필수 정보가 누락되었습니다.",
  TOKEN_VERIFICATION_FAILED: "토큰 검증에 실패했습니다.",
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
} as const;

/**
 * 토큰 타입 상수
 */
export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;

/**
 * Swagger 예시 데이터
 * 실제 API 응답과 일치하는 예시 데이터를 제공합니다.
 */
export const SWAGGER_EXAMPLES = {
  USER_DATA: {
    id: "1",
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
  ACCESS_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicGhvbmUiOiIwMTAtMTIzNC01Njc4IiwibG9naW5UeXBlIjoiZ2VuZXJhbCIsImxvZ2luSWQiOiJ1c2VyMTIzIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNDA2NDAwMCwiZXhwIjoxNzA0MDY3NjAwfQ.example_signature",
  REFRESH_TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicGhvbmUiOiIwMTAtMTIzNC01Njc4IiwibG9naW5UeXBlIjoiZ2VuZXJhbCIsImxvZ2luSWQiOiJ1c2VyMTIzIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MDQwNjQwMDAsImV4cCI6MTcwNDY2ODgwMH0.example_signature",
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
    accessToken: SWAGGER_EXAMPLES.ACCESS_TOKEN,
    refreshToken: SWAGGER_EXAMPLES.REFRESH_TOKEN,
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
