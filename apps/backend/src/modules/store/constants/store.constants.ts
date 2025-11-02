export const STORE_ERROR_MESSAGES = {
  BUSINESS_REGISTRATION_NUMBER_MISMATCH:
    "1단계(사업자등록번호 진위확인)와 2단계(통신판매사업자 등록상세 조회)의 사업자등록번호가 일치하지 않습니다.",
  STORE_ALREADY_EXISTS_WITH_SAME_BUSINESS_INFO:
    "같은 사업자등록번호와 인허가관리번호(통신판매사업자 신고번호) 조합으로 이미 스토어가 존재합니다.",
} as const;

export const STORE_SUCCESS_MESSAGES = {
  STORE_CREATED: "스토어가 생성되었습니다.",
} as const;

export const SWAGGER_EXAMPLES = {
  id: "QXZw02vBqVXNQ29c4w9n9ZdG",
  NAME: "스위트오더 스토어",
  DESCRIPTION: "맛있는 케이크를 판매하는 스토어입니다.",
  LOGO_IMAGE_URL: "https://example.com/logo.png",
  CREATED_AT: new Date("2024-01-01T00:00:00.000Z"),
};

export const SWAGGER_RESPONSE_EXAMPLES = {
  STORE_CREATED_RESPONSE: {
    id: "QXZw02vBqVXNQ29c4w9n9ZdG",
  },
};
