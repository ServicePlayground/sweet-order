export const PATTERNS = {
  USER_ID_PATTERN: /^[a-zA-Z0-9_]{4,20}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_PATTERN: /^01[0-9]\d{7,8}$/, // 한국 휴대폰 번호 패턴: 010, 011, 016, 017, 018, 019로 시작하는 10-11자리
  VERIFICATION_CODE_PATTERN: /^\d{6}$/, // 6자리 숫자 패턴
  BUSINESS_NO_PATTERN: /^\d{10}$/, // 사업자등록번호: 10자리 숫자
  START_DATE_PATTERN: /^\d{8}$/, // 개업일: YYYYMMDD 8자리 숫자
} as const;

export const isValidUserId = (userId: string) => PATTERNS.USER_ID_PATTERN.test(userId);
export const isValidPassword = (password: string) => PATTERNS.PASSWORD_PATTERN.test(password);
export const isValidPhone = (phone: string) => PATTERNS.PHONE_PATTERN.test(phone);
export const isValidVerificationCode = (verificationCode: string) =>
  PATTERNS.VERIFICATION_CODE_PATTERN.test(verificationCode);

export const isValidBusinessNo = (businessNo: string) =>
  PATTERNS.BUSINESS_NO_PATTERN.test(businessNo);
export const isValidStartDateYmd = (ymd: string) => PATTERNS.START_DATE_PATTERN.test(ymd);
