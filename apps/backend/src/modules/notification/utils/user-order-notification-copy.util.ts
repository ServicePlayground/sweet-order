import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";
import { ORDER_STATUS_TRANSITION_SOURCE } from "@apps/backend/modules/order/types/order-lifecycle.types";
import type { OrderStatusTransitionPayload } from "@apps/backend/modules/order/types/order-lifecycle.types";

export type UserOrderNotificationCopy = { title: string; body: string };

/**
 * 구매자(USER) 주문 알림 문구.
 *
 * **서비스 주문 흐름(코드 기준 요약)**
 * 1. 주문 제출 → `RESERVATION_REQUESTED`(예약신청): 스토어 확인 대기
 * 2. 스토어가 확인 → `PAYMENT_PENDING`(입금대기): 계좌 안내, 입금대기 시작 시점부터 12시간 내 입금(`order-automation`)
 * 3. 사용자가 앱에서 입금 완료 처리 → `PAYMENT_COMPLETED`: 본인 액션이라 알림 생략(null)
 * 4. 스토어가 → `CONFIRMED`(예약확정): 입금대기·입금완료 어느 쪽에서든 전환 가능
 * 5. 픽업 일시 도래 → 자동으로 `PICKUP_PENDING`(픽업대기)
 * 6. 스토어가 → `PICKUP_COMPLETED`(픽업완료)
 *
 * 취소·환불·노쇼는 아래 분기에서 처리합니다.
 */
export function buildUserOrderNotificationCopy(
  payload: Pick<OrderStatusTransitionPayload, "fromStatus" | "toStatus" | "source">,
): UserOrderNotificationCopy | null {
  const { fromStatus, toStatus, source } = payload;

  if (
    toStatus === OrderStatus.RESERVATION_REQUESTED &&
    fromStatus === null &&
    source === ORDER_STATUS_TRANSITION_SOURCE.ORDER_CREATE
  ) {
    return {
      title: "예약 신청이 접수되었어요",
      body: "스토어에 주문이 전달되었어요. 스토어가 확인하면 다음 안내를 알려드릴게요. 진행 상황은 마이페이지 내 예약에서도 볼 수 있어요.",
    };
  }

  if (toStatus === OrderStatus.PAYMENT_PENDING) {
    return {
      title: "이제 입금해 주세요",
      body: "스토어가 예약을 확인했어요. 주문에 표시된 계좌로 입금해 주세요. 입금 가능한 시간은 안내가 시작된 때부터 12시간이에요. 시간이 지나면 주문이 자동으로 취소될 수 있어요.",
    };
  }

  if (toStatus === OrderStatus.PAYMENT_COMPLETED) {
    return null;
  }

  if (toStatus === OrderStatus.CONFIRMED) {
    return {
      title: "예약이 확정되었어요",
      body: "픽업 날짜와 시간을 한 번 더 확인해 주세요. 픽업 당일에는 픽업 안내 알림이 갈 수 있어요.",
    };
  }

  if (toStatus === OrderStatus.PICKUP_PENDING) {
    return {
      title: "픽업하실 수 있어요",
      body: "예약하신 픽업 시간이 되었어요. 매장에 방문해 주문하신 상품을 받아 가 주세요.",
    };
  }

  if (toStatus === OrderStatus.PICKUP_COMPLETED) {
    return {
      title: "픽업이 완료되었어요",
      body: "이용해 주셔서 감사해요. 주문이 정상적으로 마무리되었어요.",
    };
  }

  if (toStatus === OrderStatus.CANCEL_COMPLETED) {
    if (
      fromStatus === OrderStatus.PAYMENT_PENDING &&
      (source === ORDER_STATUS_TRANSITION_SOURCE.AUTOMATION_BATCH ||
        source === ORDER_STATUS_TRANSITION_SOURCE.AUTOMATION_SYNC ||
        source === ORDER_STATUS_TRANSITION_SOURCE.USER_ACTION_PAYMENT_EXPIRED)
    ) {
      return {
        title: "입금 시간이 지나 주문이 취소되었어요",
        body: "입금 가능한 12시간 안에 입금이 확인되지 않아 예약이 취소되었어요. 다시 이용하시려면 상품에서 새로 주문해 주세요.",
      };
    }
    if (source === ORDER_STATUS_TRANSITION_SOURCE.USER_ACTION) {
      return {
        title: "주문 취소가 완료되었어요",
        body: "요청하신 대로 취소 처리되었어요.",
      };
    }
    if (source === ORDER_STATUS_TRANSITION_SOURCE.SELLER_STATUS_UPDATE) {
      return {
        title: "스토어에서 주문이 취소되었어요",
        body: "스토어 사정으로 예약을 진행할 수 없어 주문이 취소되었어요. 자세한 내용은 주문 상세를 확인하거나 스토어에 문의해 주세요.",
      };
    }
    return null;
  }

  if (toStatus === OrderStatus.CANCEL_REFUND_PENDING) {
    if (source === ORDER_STATUS_TRANSITION_SOURCE.USER_ACTION) {
      return {
        title: "취소·환불 요청을 보냈어요",
        body: "스토어에서 확인한 뒤 처리해요. 결과는 알림과 주문 화면에서 안내드릴게요.",
      };
    }
    if (source === ORDER_STATUS_TRANSITION_SOURCE.SELLER_STATUS_UPDATE) {
      return {
        title: "취소·환불을 진행 중이에요",
        body: "스토어에서 환불 절차를 진행하고 있어요. 진행 상황은 주문 상세에서 확인할 수 있어요.",
      };
    }
    return null;
  }

  if (toStatus === OrderStatus.CANCEL_REFUND_COMPLETED) {
    return {
      title: "환불이 완료되었어요",
      body: "환불 처리 내역은 주문 상세에서 확인할 수 있어요.",
    };
  }

  if (toStatus === OrderStatus.NO_SHOW) {
    return {
      title: "픽업이 확인되지 않았어요",
      body: "예약된 픽업이 이루어지지 않은 것으로 처리되었어요. 오인이면 스토어에 연락해 주세요.",
    };
  }

  return null;
}
