/**
 * 판매자용 주문 상태 안내 문구.
 * 입금 12시간·픽업 당일 자동 전환 등은 백엔드 `order-automation`·`order-datetime.util` 규칙과 맞춥니다.
 */
import { OrderStatus } from "@/apps/web-seller/features/order/types/order.dto";

/** 상태별 안내 문장 (상세 힌트·흐름 목록 공통) */
export const ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS: Record<OrderStatus, string> = {
  [OrderStatus.PAYMENT_PENDING]:
    "입금대기: 고객이 예약을 막 신청한 직후, 아직 입금 전인 단계입니다. 주문 생성 시각 기준 12시간 안에 고객이 입금 완료 처리를 하지 않으면 시스템이 자동으로 취소완료로 바꿉니다. 고객이 입금 완료를 누르거나, 판매자가 예약 확정·예약 취소로 이후 단계로 넘어갈 수 있어요.",
  [OrderStatus.PAYMENT_COMPLETED]:
    "입금완료: 입금대기 상태일 때 고객이 ‘입금 완료’ 처리를 한 단계입니다. 판매자는 여기서 예약 확정으로 넘기면 됩니다. 취소시에는 취소환불대기로 넘어갈 수 있어요.",
  [OrderStatus.CONFIRMED]:
    "예약확정: 입금대기 또는 입금완료 상태일 때 판매자가 ‘예약 확정’으로 바꾼 단계입니다. 제작·픽업 준비를 하시면 되고, 픽업일은 한국 시간(Asia/Seoul) 달력 기준 당일이 되면 시스템이 자동으로 픽업대기로 바꿉니다.",
  [OrderStatus.PICKUP_PENDING]:
    "픽업대기: 예약확정 상태였고, 픽업일이 한국 시간 달력상 당일이 되어 시스템이 자동 전환한 단계입니다. 고객 픽업이 끝나면 픽업 완료, 미수령이면 노쇼, 환불 절차가 필요하면 취소환불대기로 처리할 수 있어요.",
  [OrderStatus.PICKUP_COMPLETED]:
    "픽업완료: 픽업대기 상태일 때 판매자가 ‘픽업 완료’로 처리한 종료 상태입니다. 픽업 완료처리를 해야 사용자 리뷰 작성이 가능해요.",
  [OrderStatus.NO_SHOW]:
    "노쇼: 픽업대기 상태일 때 고객이 픽업하지 않은 경우, 판매자가 ‘노쇼’로 처리한 종료 상태입니다.",
  [OrderStatus.CANCEL_COMPLETED]:
    "취소완료: 입금대기였을 때 고객이 입금 전 예약을 취소했거나, 판매자가 예약을 취소한 경우, 또는 입금대기 12시간이 지나 시스템이 자동으로 취소한 경우 등으로 이 상태가 됩니다. (입금 전 취소·만료 취소 등, 환불 플로우와는 별도로 보시면 됩니다.)",
  [OrderStatus.CANCEL_REFUND_PENDING]:
    "취소환불대기: 입금완료·예약확정·픽업대기 상태일 때 고객이 취소·환불을 요청했거나, 판매자가 이 상태로 올린 단계입니다. 환불을 마친 뒤 취소환불완료로 바꾸면 됩니다.",
  [OrderStatus.CANCEL_REFUND_COMPLETED]:
    "취소환불완료: 취소환불대기 상태일 때 환불 처리까지 끝내고 판매자가 ‘취소환불 완료’로 마친 종료 상태입니다.",
};

/**
 * 전체 흐름 안내 (판매자 교육용, `<details>` 등)
 * 순서는 일반적인 진행 흐름 기준
 */
export const ORDER_STATUS_FLOW_LINES_FOR_SELLER: readonly string[] = [
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.PAYMENT_PENDING],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.PAYMENT_COMPLETED],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.CONFIRMED],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.PICKUP_PENDING],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.PICKUP_COMPLETED],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.NO_SHOW],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.CANCEL_COMPLETED],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.CANCEL_REFUND_PENDING],
  ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[OrderStatus.CANCEL_REFUND_COMPLETED],
];

/** 현재 주문 상태에 대한 판매자용 안내 (`ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS`와 동일 문장) */
export function getOrderStatusSellerHint(status: OrderStatus): string {
  return ORDER_STATUS_SELLER_FLOW_LINE_BY_STATUS[status] ?? "";
}
