export const STORE_ERROR_MESSAGES = {
  BUSINESS_REGISTRATION_NUMBER_MISMATCH:
    "1단계(사업자등록번호 진위확인)와 2단계(통신판매사업자 등록상세 조회)의 사업자등록번호가 일치하지 않습니다.",
  STORE_ALREADY_EXISTS_WITH_SAME_BUSINESS_INFO:
    "같은 사업자등록번호와 인허가관리번호(통신판매사업자 신고번호) 조합으로 이미 스토어가 존재합니다.",
  NOT_FOUND: "스토어를 찾을 수 없습니다.",
  LIKE_ALREADY_EXISTS: "이미 좋아요한 스토어입니다.",
  LIKE_NOT_FOUND: "좋아요한 스토어가 아닙니다.",
} as const;

export const STORE_SUCCESS_MESSAGES = {
  STORE_CREATED: "스토어가 생성되었습니다.",
  LIKE_ADDED: "스토어에 좋아요를 추가했습니다.",
  LIKE_REMOVED: "스토어 좋아요를 취소했습니다.",
} as const;

export const SWAGGER_EXAMPLES = {
  ID: "QXZw02vBqVXNQ29c4w9n9ZdG",
  NAME: "스위트오더 스토어",
  DESCRIPTION: "맛있는 케이크를 판매하는 스토어입니다.",
  CREATED_AT: new Date("2024-01-01T00:00:00.000Z"),
  // 주소/위치 정보
  ADDRESS: "서울특별시 강남구 역삼동 456-789",
  ROAD_ADDRESS: "서울특별시 강남구 테헤란로 123",
  ZONECODE: "06234",
  LATITUDE: 37.5665,
  LONGITUDE: 126.978,
};

export const SWAGGER_RESPONSE_EXAMPLES = {
  STORE_CREATED_RESPONSE: {
    id: SWAGGER_EXAMPLES.ID,
  },
};

/**
 * Seed용 스토어 상수
 * 값은 prisma seed에서 사용하는 값과 동일하게 유지한다.
 */
export const SEED_STORES = {
  STORE1: {
    NAME: "스위트오더 스토어",
    DESCRIPTION: "맛있는 케이크를 판매하는 스토어입니다.",
    LOGO_IMAGE_URL:
      "https://static-staging.sweetorders.com/uploads/NYenL1720090515_1770124331535_5b9aa552.png",
    ADDRESS: "서울특별시 강동구 천호동 123-45",
    ROAD_ADDRESS: "서울특별시 강동구 천호대로 100",
    ZONECODE: "05278",
    LATITUDE: 37.5386,
    LONGITUDE: 127.1259,
    BUSINESS_NO: "1198288946",
    REPRESENTATIVE_NAME: "홍길동",
    OPENING_DATE: "20230101",
    BUSINESS_NAME: "스위트오더",
    BUSINESS_SECTOR: "도매 및 소매업",
    BUSINESS_TYPE: "전자상거래 소매 중개업",
    PERMISSION_MANAGEMENT_NUMBER: "2021-서울강동-0422",
    LIKE_COUNT: 15,
    CREATED_AT: new Date("2024-01-15T10:30:00Z"),
    UPDATED_AT: new Date("2024-01-15T10:30:00Z"),
  },
  STORE2: {
    NAME: "디저트 파라다이스",
    DESCRIPTION: "다양한 디저트를 판매하는 스토어입니다.",
    LOGO_IMAGE_URL:
      "https://static-staging.sweetorders.com/uploads/.png_1770124350794_a40b9a07",
    ADDRESS: "서울특별시 강남구 역삼동 456-78",
    ROAD_ADDRESS: "서울특별시 강남구 테헤란로 200",
    ZONECODE: "06234",
    LATITUDE: 37.4981,
    LONGITUDE: 127.0276,
    BUSINESS_NO: "1198288947",
    REPRESENTATIVE_NAME: "홍길동",
    OPENING_DATE: "20230201",
    BUSINESS_NAME: "디저트 파라다이스",
    BUSINESS_SECTOR: "도매 및 소매업",
    BUSINESS_TYPE: "전자상거래 소매 중개업",
    PERMISSION_MANAGEMENT_NUMBER: "2021-서울강동-0423",
    LIKE_COUNT: 8,
    CREATED_AT: new Date("2024-01-16T10:30:00Z"),
    UPDATED_AT: new Date("2024-01-16T10:30:00Z"),
  },
} as const;
