export const PATTERNS = {
  USER_ID_PATTERN: /^[a-zA-Z0-9_]{4,20}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE_PATTERN: /^01[0-9]\d{7,8}$/, // 한국 휴대폰 번호 패턴: 010, 011, 016, 017, 018, 019로 시작하는 10-11자리
  VERIFICATION_CODE_PATTERN: /^\d{6}$/, // 6자리 숫자 패턴
  BUSINESS_NO_PATTERN: /^\d{10}$/, // 사업자등록번호: 10자리 숫자
  START_DATE_PATTERN: /^\d{8}$/, // 개업일: YYYYMMDD 8자리 숫자
  PERMISSION_MANAGEMENT_NUMBER_PATTERN: /^\d{4}-[가-힣]+-\d{4}$/, // 인허가관리번호: YYYY-한글지역명-숫자4자리
} as const;

export const isValidUserId = (userId: string) => PATTERNS.USER_ID_PATTERN.test(userId);
export const isValidPassword = (password: string) => PATTERNS.PASSWORD_PATTERN.test(password);
export const isValidPhone = (phone: string) => PATTERNS.PHONE_PATTERN.test(phone);
export const isValidVerificationCode = (verificationCode: string) =>
  PATTERNS.VERIFICATION_CODE_PATTERN.test(verificationCode);

export const isValidBusinessNo = (businessNo: string) =>
  PATTERNS.BUSINESS_NO_PATTERN.test(businessNo);
export const isValidStartDateYmd = (ymd: string) => PATTERNS.START_DATE_PATTERN.test(ymd);

/**
 * 인허가관리번호 유효성 검증
 * 형식: YYYY-한글지역명-숫자4자리 (예: 2021-서울강동-0422)
 */
export const isValidPermissionManagementNumber = (prmmiMnno: string): boolean => {
  if (!prmmiMnno || typeof prmmiMnno !== "string") {
    return false;
  }

  // 인허가관리번호 형식: YYYY-한글지역명-숫자4자리
  if (!PATTERNS.PERMISSION_MANAGEMENT_NUMBER_PATTERN.test(prmmiMnno)) {
    return false;
  }

  // 연도 검증 (1900년부터 현재 연도까지)
  const parts = prmmiMnno.split("-");
  if (parts.length !== 3) {
    return false;
  }

  const year = parseInt(parts[0]);
  const currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear) {
    return false;
  }

  // 지역명이 한글로만 이루어져 있는지 확인
  const regionName = parts[1];
  if (!/^[가-힣]+$/.test(regionName)) {
    return false;
  }

  // 마지막 숫자 4자리 검증
  const number = parts[2];
  if (!/^\d{4}$/.test(number)) {
    return false;
  }

  return true;
};
