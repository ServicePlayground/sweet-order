import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";

/**
 * 주문 상태 변경 발생 경로 (훅·로그·향후 알림/아웃박스에서 구분).
 *
 * - **AUTOMATION_BATCH**: 앱 기동 직후 및 주기 배치(예: 5분)에서 일괄 전환
 * - **AUTOMATION_SYNC**: 상세·목록 조회 시 `syncOrderLifecycleById`로 즉시 전환 (배치 주기 사이 갭 보정)
 * - **SELLER_STATUS_UPDATE**: 판매자 주문 상태 PATCH
 * - **USER_ACTION**: 사용자 입금완료·입금 전 취소·취소환불 요청 등
 * - **ORDER_CREATE**: 주문 생성 직후 초기 `orderStatus` 설정
 *
 * `BATCH`와 `SYNC`를 합치지 않은 이유: 알림 정책(예: 야간 배치는 묶음 처리 vs 조회 시 전환은 즉시 안내)을 나눌 때 필요합니다.
 */
export const ORDER_STATUS_TRANSITION_SOURCE = {
  AUTOMATION_BATCH: "AUTOMATION_BATCH",
  AUTOMATION_SYNC: "AUTOMATION_SYNC",
  SELLER_STATUS_UPDATE: "SELLER_STATUS_UPDATE",
  USER_ACTION: "USER_ACTION",
  ORDER_CREATE: "ORDER_CREATE",
} as const;

export type OrderStatusTransitionSource =
  (typeof ORDER_STATUS_TRANSITION_SOURCE)[keyof typeof ORDER_STATUS_TRANSITION_SOURCE];

/**
 * 주문 `orderStatus`가 실제로 바뀐 뒤 발행되는 페이로드.
 */
export interface OrderStatusTransitionPayload {
  orderId: string;
  /** 주문 최초 생성 시에만 null (이전 상태 없음) */
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  source: OrderStatusTransitionSource;
}
