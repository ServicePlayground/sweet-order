const AUTH_ERROR_MESSAGES = {
  PHONE_VERIFICATION_REQUIRED: "휴대폰 인증이 필요합니다.",
  PHONE_INVALID_FORMAT: "올바른 휴대폰번호 형식을 입력해주세요. (예: 01012345678)",
  VERIFICATION_CODE_INVALID_FORMAT: "올바른 인증번호 형식을 입력해주세요. (예: 123456)",
  NAME_REQUIRED: "이름을 입력해주세요.",
  NAME_MAX_LENGTH: "이름은 50자 이하로 입력해주세요.",
} as const;

export { AUTH_ERROR_MESSAGES };
