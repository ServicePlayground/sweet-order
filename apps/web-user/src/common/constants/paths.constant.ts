/**
 * 애플리케이션 경로 상수 관리
 * - 모든 라우팅 경로를 중앙에서 관리
 * - 경로 변경 시 한 곳에서만 수정하면 됨
 */

export const PATHS = {
  // 메인 페이지
  HOME: "/",

  // 스토어 관련 경로
  STORE: {
    DETAIL: (storeId: string) => `/store/${storeId}`,
  },

  // 상품 관련 경로
  PRODUCT: {
    DETAIL: (productId: string) => `/product/${productId}`,
  },

  // 검색 관련 경로
  SEARCH: "/search",

  // 장바구니 관련 경로
  CART: "/cart",

  // 지도 페이지
  MAP: "/map",

  // 저장 페이지
  SAVED: "/saved",

  // 마이페이지
  MYPAGE: "/mypage",

  // QA/테스트 전용 페이지
  QA: "/qa",
} as const;
