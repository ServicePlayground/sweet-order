const STORE_ERROR_MESSAGES = {
  NAME_REQUIRED: "스토어 이름을 입력해주세요.",
  NAME_TOO_LONG: "스토어 이름은 100자 이하여야 합니다.",
  DESCRIPTION_TOO_LONG: "스토어 설명은 500자 이하여야 합니다.",
  LOGO_IMAGE_URL_INVALID: "올바른 이미지 URL 형식이 아닙니다.",
} as const;

const STORE_SUCCESS_MESSAGES = {
  STORE_CREATED: "스토어가 생성되었습니다.",
} as const;

export { STORE_ERROR_MESSAGES, STORE_SUCCESS_MESSAGES };

