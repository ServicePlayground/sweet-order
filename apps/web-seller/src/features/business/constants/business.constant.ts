const BUSINESS_ERROR_MESSAGES = {
  BUSINESS_REGISTRATION_NUMBER_INVALID_FORMAT:
    "사업자등록번호는 하이픈 없는 10자리 숫자이며 유효한 번호여야 합니다.",
  OPENING_DATE_INVALID_FORMAT: "개업일자는 YYYYMMDD 형식의 유효한 날짜여야 합니다.",
  REPRESENTATIVE_NAME_REQUIRED: "대표자명을 입력해주세요.",
  BUSINESS_NAME_REQUIRED: "상호를 입력해주세요.",
  BUSINESS_SECTOR_REQUIRED: "업태를 입력해주세요.",
  BUSINESS_TYPE_REQUIRED: "종목을 입력해주세요.",
  PERMISSION_MANAGEMENT_NUMBER_INVALID_FORMAT:
    "인허가관리번호는 YYYY-한글지역명-숫자4자리 형식이어야 합니다. (예: 2021-서울강동-0422)",
  BUSINESS_VALIDATION_FAILED: "사업자등록번호 진위확인에 실패했습니다.",
  ONLINE_TRADING_COMPANY_DETAIL_VALIDATION_FAILED: "통신판매사업자 등록상세 조회에 실패했습니다.",
} as const;

export { BUSINESS_ERROR_MESSAGES };
