const AUTH_ERROR_MESSAGES = {
  USER_ID_INVALID_FORMAT: "아이디는 4-20자의 영문, 숫자, 언더스코어만 사용할 수 있습니다.",
  USER_ID_REQUIRED: "아이디를 입력해주세요.",
  USER_ID_ALREADY_EXISTS: "이미 사용 중인 아이디입니다.",
  USER_ID_AVAILABLE: "사용 가능한 아이디입니다.",
  PASSWORD_INVALID_FORMAT:
    "비밀번호는 8자 이상의 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 포함해야 합니다.",
  PASSWORD_NOT_MATCHED: "비밀번호가 일치하지 않습니다.",
  PASSWORD_MIN_LENGTH: "비밀번호는 최소 8자 이상이어야 합니다.",
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  INVALID_CREDENTIALS: "아이디 또는 비밀번호가 올바르지 않습니다.",
  PHONE_INVALID_FORMAT: "올바른 휴대폰번호 형식을 입력해주세요. (예: 01012345678)",
  PHONE_REQUIRED: "휴대폰번호를 입력해주세요.",
  VERIFICATION_CODE_REQUIRED: "인증번호를 입력해주세요.",
  PHONE_VERIFICATION_REQUIRED: "휴대폰 인증을 완료해주세요.",
  VERIFICATION_CODE_INVALID_FORMAT: "올바른 인증번호 형식을 입력해주세요. (예: 123456)",
} as const;

export { AUTH_ERROR_MESSAGES };
