export const PATTERNS = {
  PHONE_PATTERN: /^01[0-9]\d{7,8}$/, // 한국 휴대폰 번호 패턴: 010, 011, 016, 017, 018, 019로 시작하는 10-11자리
  VERIFICATION_CODE_PATTERN: /^\d{6}$/, // 6자리 숫자 패턴
} as const;

/** 백엔드 `PhoneUtil.normalizePhone` 과 동일 — 공백·하이픈·괄호 제거 */
export const normalizePhone = (phone: string): string => phone.replace(/[\s\-()]/g, "");

export const isValidPhone = (phone: string) => PATTERNS.PHONE_PATTERN.test(phone);
export const isValidVerificationCode = (verificationCode: string) =>
  PATTERNS.VERIFICATION_CODE_PATTERN.test(verificationCode);
