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
  PHONE_VERIFICATION_CODE_GENERATION_FAILED:
    "인증번호 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
  PHONE_VERIFICATION_FAILED: "인증번호가 올바르지 않습니다.",
  VERIFICATION_CODE_INVALID_FORMAT: "인증번호는 6자리 숫자여야 합니다.",
  ACCOUNT_NOT_FOUND: "해당 아이디로 등록된 계정이 없습니다.",
  ACCOUNT_NOT_FOUND_BY_PHONE: "해당 휴대폰 번호로 등록된 계정이 없습니다.",
  ACCOUNT_INACTIVE: "비활성화된 계정입니다.",
  GOOGLE_REGISTER_FAILED: "구글 로그인 회원가입에 실패했습니다.",
  /* --------------------------------- 토큰 관련 에러 메시지 --------------------------------- */
  REFRESH_TOKEN_EXPIRED:
    "[REFRESH_TOKEN_INVALID] 리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.",
  REFRESH_TOKEN_INVALID:
    "[REFRESH_TOKEN_INVALID] 리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
  REFRESH_TOKEN_MISSING: "[REFRESH_TOKEN_INVALID] 리프레시 토큰이 없습니다. 다시 로그인해주세요.",
  REFRESH_TOKEN_WRONG_TYPE:
    "[REFRESH_TOKEN_INVALID] 리프레시 토큰의 타입이 올바르지 않습니다. 다시 로그인해주세요.",
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
 * 휴대폰 인증 목적 enum
 */
export enum PhoneVerificationPurpose {
  REGISTRATION = "registration", // 회원가입
  GOOGLE_REGISTRATION = "google_registration", // 구글 회원가입
  PASSWORD_RECOVERY = "password_recovery", // 비밀번호 찾기/변경
  ID_FIND = "id_find", // 아이디 찾기
  PHONE_CHANGE = "phone_change", // 휴대폰 번호 변경
}

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
  ACCESS_TOKEN: "90d",
  REFRESH_TOKEN: "90d",
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
  // 로그인/회원가입 응답: 토큰만 반환
  TOKEN_RESPONSE: {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicGhvbmUiOiIwMTAtMTIzNC01Njc4IiwibG9naW5UeXBlIjoiZ2VuZXJhbCIsImxvZ2luSWQiOiJ1c2VyMTIzIiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjE3MDQ2NzIwMDB9.example",
    refreshToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicGhvbmUiOiIwMTAtMTIzNC01Njc4IiwibG9naW5UeXBlIjoiZ2VuZXJhbCIsImxvZ2luSWQiOiJ1c2VyMTIzIiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiUkVGUkVTSCIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxNzA2OTY3MjAwfQ.example",
  },
  // /me 엔드포인트 응답: 토큰과 사용자 정보 함께 반환
  USER_DATA_RESPONSE: {
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicGhvbmUiOiIwMTAtMTIzNC01Njc4IiwibG9naW5UeXBlIjoiZ2VuZXJhbCIsImxvZ2luSWQiOiJ1c2VyMTIzIiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjE3MDQ2NzIwMDB9.example",
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
  PHONE_VERIFICATION_PURPOSE: "인증 목적",
} as const;

/**
 * Seed용 사용자/휴대폰 인증 상수
 * 값은 prisma seed에서 사용하는 값과 동일하게 유지한다.
 */
export const SEED_USERS = {
  USER1: {
    USER_ID: "user001",
    ROLE: "SELLER",
    PHONE: "01012345678",
    PASSWORD: "Password123!",
    NAME: "김철수",
    NICKNAME: "철수킹",
    EMAIL: "kimcs@example.com",
    PROFILE_IMAGE_URL:
      "https://static-staging.sweetorders.com/uploads/2__1770124158308_b45059e5.jpeg",
    CREATED_AT: new Date("2024-01-15T10:30:00Z"),
    LAST_LOGIN_AT: new Date("2024-01-20T14:25:00Z"),
  },
  USER2: {
    USER_ID: "user002",
    PHONE: "01023456789",
    PASSWORD: "Password456!",
    CREATED_AT: new Date("2024-01-16T09:15:00Z"),
  },
  USER3: {
    PHONE: "01034567890",
    GOOGLE_ID: "google_123456789",
    GOOGLE_EMAIL: "john.doe@gmail.com",
    CREATED_AT: new Date("2024-01-17T16:45:00Z"),
  },
  USER4: {
    USER_ID: "user004",
    PHONE: "01078901234",
    PASSWORD: "Password123!",
    GOOGLE_ID: "google_987654321",
    GOOGLE_EMAIL: "jane.smith@gmail.com",
    CREATED_AT: new Date("2023-12-01T10:00:00Z"),
  },
} as const;

export const SEED_PHONE_VERIFICATIONS = [
  {
    phone: "01012345678",
    verificationCode: "123456",
    expiresAt: new Date("2024-01-15T11:00:00Z"),
    isVerified: true,
    purpose: "registration",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:35:00Z"),
  },
  {
    phone: "01023456789",
    verificationCode: "234567",
    expiresAt: new Date("2024-01-16T10:00:00Z"),
    isVerified: true,
    purpose: "registration",
    createdAt: new Date("2024-01-16T09:15:00Z"),
    updatedAt: new Date("2024-01-16T09:20:00Z"),
  },
  {
    phone: "01012345678",
    verificationCode: "999999",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    isVerified: false,
    purpose: "password_recovery",
    createdAt: new Date(),
  },
  {
    phone: "01023456789",
    verificationCode: "888888",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    isVerified: false,
    purpose: "id_find",
    createdAt: new Date(),
  },
  {
    phone: "01078901234",
    verificationCode: "555555",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    isVerified: false,
    purpose: "registration",
    createdAt: new Date(),
  },
  {
    phone: "01078901234",
    verificationCode: "777777",
    expiresAt: new Date("2024-01-01T00:00:00Z"),
    isVerified: false,
    purpose: "registration",
    createdAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    phone: "01078901234",
    verificationCode: "666666",
    expiresAt: new Date("2024-01-02T00:00:00Z"),
    isVerified: false,
    purpose: "registration",
    createdAt: new Date("2024-01-02T00:00:00Z"),
  },
  {
    phone: "01099999999",
    verificationCode: "111111",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    isVerified: false,
    purpose: "registration",
    createdAt: new Date(),
  },
  {
    phone: "01099999999",
    verificationCode: "222222",
    expiresAt: new Date("2024-01-20T00:00:00Z"),
    isVerified: false,
    purpose: "registration",
    createdAt: new Date("2024-01-20T00:00:00Z"),
  },
] as const;
