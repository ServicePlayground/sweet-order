/**
 * 스토어 홈 대시보드 API에서 한 번에 내려줄 목록 길이·조회 상한.
 * (`SellerHomeService.getDashboard`)
 */

/** 접수일 최신순으로 보여 줄 최근 주문 개수 */
export const SELLER_HOME_RECENT_ORDER_LIMIT = 5;

/**
 * 오늘 픽업 예정 주문을 주문 목록 API로 가져올 때의 fetch 상한.
 * 목록은 접수 최신순이라, 서비스에서 픽업 시각 오름차순으로 다시 정렬한다.
 */
export const SELLER_HOME_TODAY_PICKUP_FETCH_LIMIT = 50;

/** 최근 알림 개수 */
export const SELLER_HOME_NOTIFICATION_LIMIT = 5;

/** 최근 피드 개수 */
export const SELLER_HOME_FEED_LIMIT = 5;
