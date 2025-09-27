/**
 * 테스트 상수 정의
 * 테스트에서 자주 사용되는 상수들을 중앙 집중화
 */

export const TEST_CONSTANTS = {
  // HTTP 상태 코드
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  },

  // 테스트 타임아웃 (밀리초)
  TIMEOUT: {
    DEFAULT: 30000,
    LONG: 60000,
    SHORT: 10000,
  },

  // 테스트 데이터
  TEST_DATA: {
    // 기본 사용자 데이터
    DEFAULT_USER: {
      userId: "testuser123",
      password: "Test123!@#",
      phone: "01012345678",
    },

    // 기본 구글 사용자 데이터
    DEFAULT_GOOGLE_USER: {
      googleId: "google123456789",
      googleEmail: "test@gmail.com",
      phone: "01087654321",
    },

    // 테스트용 인증번호
    VERIFICATION_CODE: "123456",

    // 테스트용 구글 코드
    GOOGLE_CODE: "valid_google_code",

    // 테스트용 토큰
    MOCK_ACCESS_TOKEN: "mock_access_token",
    MOCK_REFRESH_TOKEN: "mock_refresh_token",
  },

  // 에러 메시지
  ERROR_MESSAGES: {
    // 유효성 검증 에러
    VALIDATION: {
      USER_ID_INVALID: "사용자 ID",
      PASSWORD_INVALID: "비밀번호",
      PHONE_INVALID: "휴대폰",
      VERIFICATION_CODE_INVALID: "인증번호",
      GOOGLE_CODE_INVALID: "구글 코드",
    },

    // 비즈니스 로직 에러
    BUSINESS: {
      USER_NOT_FOUND: "계정을 찾을 수 없습니다",
      USER_ALREADY_EXISTS: "이미 존재",
      PHONE_ALREADY_EXISTS: "휴대폰",
      PHONE_VERIFICATION_REQUIRED: "휴대폰 인증",
      INVALID_CREDENTIALS: "잘못된 인증 정보",
      INVALID_REFRESH_TOKEN: "유효하지 않은",
      GOOGLE_LOGIN_FAILED: "구글 로그인 실패",
      GOOGLE_REGISTER_FAILED: "구글 회원가입 실패",
      ID_PHONE_MISMATCH: "일치하지 않습니다",
      PHONE_VERIFICATION_LIMIT_EXCEEDED: "제한",
    },

    // 인증 에러
    AUTH: {
      TOKEN_REQUIRED: "인증이 필요합니다",
      TOKEN_INVALID: "유효하지 않은 토큰",
      TOKEN_EXPIRED: "만료된 토큰",
    },
  },

  // 성공 메시지
  SUCCESS_MESSAGES: {
    USER_REGISTERED: "회원가입이 완료되었습니다",
    USER_LOGGED_IN: "로그인이 완료되었습니다",
    PASSWORD_CHANGED: "비밀번호가 변경되었습니다",
    PHONE_CHANGED: "휴대폰 번호가 변경되었습니다",
    PHONE_VERIFICATION_SENT: "인증번호가 발송되었습니다",
    PHONE_VERIFICATION_CONFIRMED: "인증이 완료되었습니다",
    ACCOUNT_FOUND: "계정을 찾았습니다",
    TOKEN_REFRESHED: "토큰이 갱신되었습니다",
  },

  // 테스트 시나리오
  SCENARIOS: {
    // 성공 시나리오
    SUCCESS: {
      GENERAL_REGISTRATION: "일반 회원가입 성공",
      GOOGLE_REGISTRATION: "구글 회원가입 성공",
      GENERAL_LOGIN: "일반 로그인 성공",
      GOOGLE_LOGIN: "구글 로그인 성공",
      PASSWORD_CHANGE: "비밀번호 변경 성공",
      PHONE_CHANGE: "휴대폰 번호 변경 성공",
      ACCOUNT_FIND: "계정 찾기 성공",
      TOKEN_REFRESH: "토큰 갱신 성공",
    },

    // 실패 시나리오
    FAILURE: {
      DUPLICATE_USER_ID: "중복된 사용자 ID",
      DUPLICATE_PHONE: "중복된 휴대폰 번호",
      INVALID_CREDENTIALS: "잘못된 인증 정보",
      PHONE_NOT_VERIFIED: "휴대폰 인증 미완료",
      USER_NOT_FOUND: "사용자 없음",
      INVALID_TOKEN: "유효하지 않은 토큰",
      GOOGLE_AUTH_FAILED: "구글 인증 실패",
    },
  },

  // 테스트 환경 설정
  ENVIRONMENT: {
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test_db",
    JWT_SECRET: "test_jwt_secret",
    JWT_EXPIRES_IN: "1h",
    JWT_REFRESH_EXPIRES_IN: "7d",
  },

  // API 엔드포인트
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/auth/register",
      LOGIN: "/auth/login",
      GOOGLE_LOGIN: "/auth/google/login",
      GOOGLE_REGISTER: "/auth/google/register",
      CHECK_USER_ID: "/auth/check-user-id",
      FIND_ACCOUNT: "/auth/find-account",
      CHANGE_PASSWORD: "/auth/change-password",
      CHANGE_PHONE: "/auth/change-phone",
      REFRESH_TOKEN: "/auth/refresh",
      SEND_VERIFICATION_CODE: "/auth/send-verification-code",
      VERIFY_PHONE_CODE: "/auth/verify-phone-code",
    },
  },

  // 테스트 데이터 생성기
  DATA_GENERATORS: {
    // 랜덤 사용자 ID 생성
    generateRandomUserId: (prefix: string = "testuser"): string => {
      return `${prefix}${Math.random().toString(36).substring(2, 8)}`;
    },

    // 랜덤 휴대폰 번호 생성
    generateRandomPhone: (): string => {
      const prefix = "010";
      const suffix = Math.random().toString().slice(2, 10);
      return `${prefix}${suffix}`;
    },

    // 랜덤 구글 ID 생성
    generateRandomGoogleId: (): string => {
      return `google${Math.random().toString(36).substring(2, 15)}`;
    },

    // 랜덤 이메일 생성
    generateRandomEmail: (domain: string = "gmail.com"): string => {
      const username = Math.random().toString(36).substring(2, 10);
      return `${username}@${domain}`;
    },

    // 랜덤 비밀번호 생성
    generateRandomPassword: (): string => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    },
  },

  // 테스트 헬퍼
  HELPERS: {
    // 배열에서 랜덤 요소 선택
    getRandomElement: <T>(array: T[]): T => {
      return array[Math.floor(Math.random() * array.length)];
    },

    // 랜덤 숫자 생성 (min, max 포함)
    getRandomNumber: (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 랜덤 문자열 생성
    getRandomString: (length: number): string => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    // 지연 함수
    delay: (ms: number): Promise<void> => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // 배열을 청크로 나누기
    chunkArray: <T>(array: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    },
  },
} as const;
