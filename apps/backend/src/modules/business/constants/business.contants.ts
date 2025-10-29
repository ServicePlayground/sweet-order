export const BUSINESS_ERROR_MESSAGES = {
  BUSINESS_VALIDATION_FAILED: "사업자등록번호 진위확인에 실패했습니다.",
  BUSINESS_REGISTRATION_NUMBER_INVALID_FORMAT: "사업자등록번호는 하이픈 없는 10자리 숫자이며 유효한 번호여야 합니다.",
  OPENING_DATE_INVALID_FORMAT: "개업일자는 YYYYMMDD 형식의 유효한 날짜여야 합니다.",
} as const;

export const BUSINESS_SUCCESS_MESSAGES = {
  BUSINESS_VALIDATION_SUCCESS: "사업자등록번호 진위확인이 완료되었습니다.",
} as const;

export const SWAGGER_EXAMPLES = {
  BUSINESS_REGISTRATION_NUMBER: "1234567891",
  REPRESENTATIVE_NAME: "홍길동",
  OPENING_DATE: "20230101",
} as const;

export const SWAGGER_DESCRIPTIONS = {
  BUSINESS_REGISTRATION_NUMBER: "사업자등록번호 (10자리 숫자, 하이픈 제거)",
  REPRESENTATIVE_NAME: "대표자명",
  OPENING_DATE: "개업일자 (YYYYMMDD 형식)",
} as const;