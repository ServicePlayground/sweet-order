export const STORE_ERROR_MESSAGES = {
  BUSINESS_REGISTRATION_NUMBER_MISMATCH:
    "1단계(사업자등록번호 진위확인)와 2단계(통신판매사업자 등록상세 조회)의 사업자등록번호가 일치하지 않습니다.",
  STORE_ALREADY_EXISTS_WITH_SAME_BUSINESS_INFO:
    "같은 사업자등록번호와 인허가관리번호(통신판매사업자 신고번호) 조합으로 이미 스토어가 존재합니다.",
  NOT_FOUND: "스토어를 찾을 수 없습니다.",
  FORBIDDEN: "스토어를 수정할 권한이 없습니다.",
  LIKE_ALREADY_EXISTS: "이미 좋아요한 스토어입니다.",
  LIKE_NOT_FOUND: "좋아요한 스토어가 아닙니다.",
} as const;

export const STORE_SUCCESS_MESSAGES = {
  STORE_CREATED: "스토어가 생성되었습니다.",
  LIKE_ADDED: "스토어에 좋아요를 추가했습니다.",
  LIKE_REMOVED: "스토어 좋아요를 취소했습니다.",
} as const;

/**
 * 스토어 목록 정렬 enum
 */
export enum StoreSortBy {
  LATEST = "latest", // 최신순(생성일 내림차순)
  POPULAR = "popular", // 인기순(좋아요 수 내림차순)
}

export const SWAGGER_EXAMPLES = {
  ID: "QXZw02vBqVXNQ29c4w9n9ZdG",
  NAME: "스위트오더 스토어",
  DESCRIPTION: "맛있는 케이크를 판매하는 스토어입니다.",
  CREATED_AT: new Date("2024-01-01T00:00:00.000Z"),
  // 주소/위치 정보
  ADDRESS: "서울특별시 강남구 역삼동 456-789",
  ROAD_ADDRESS: "서울특별시 강남구 테헤란로 123",
  DETAIL_ADDRESS: "101호",
  ZONECODE: "06234",
  LATITUDE: 37.5665,
  LONGITUDE: 126.978,
};
