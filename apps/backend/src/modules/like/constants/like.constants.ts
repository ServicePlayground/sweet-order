/**
 * 좋아요 관련 에러 메시지
 */
export const LIKE_ERROR_MESSAGES = {
  PRODUCT_LIKE_ALREADY_EXISTS: "이미 좋아요한 상품입니다.",
  PRODUCT_LIKE_NOT_FOUND: "좋아요한 상품이 아닙니다.",
  STORE_LIKE_ALREADY_EXISTS: "이미 좋아요한 스토어입니다.",
  STORE_LIKE_NOT_FOUND: "좋아요한 스토어가 아닙니다.",
} as const;

/**
 * 좋아요 관련 성공 메시지 상수
 */
export const LIKE_SUCCESS_MESSAGES = {
  PRODUCT_LIKE_ADDED: "상품에 좋아요를 추가했습니다.",
  PRODUCT_LIKE_REMOVED: "상품 좋아요를 취소했습니다.",
  STORE_LIKE_ADDED: "스토어에 좋아요를 추가했습니다.",
  STORE_LIKE_REMOVED: "스토어 좋아요를 취소했습니다.",
} as const;

/**
 * 좋아요 타입 enum
 */
export enum LikeType {
  PRODUCT = "PRODUCT", // 상품 좋아요
  STORE = "STORE", // 스토어 좋아요
}
