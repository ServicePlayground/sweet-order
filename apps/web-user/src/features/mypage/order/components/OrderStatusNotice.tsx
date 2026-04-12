import { OrderResponse, OrderStatus } from "@/apps/web-user/features/order/types/order.type";
import { PaymentPendingInfo } from "./PaymentPendingInfo";
import { Icon } from "@/apps/web-user/common/components/icons";

interface OrderStatusNoticeProps {
  order: OrderResponse;
}

/**
 * 주문 상태별 안내 메시지 컴포넌트
 * - PAYMENT_PENDING: 계좌 정보 및 입금 안내
 * - PAYMENT_COMPLETED: 판매자 입금 확인 대기 중
 * - CANCEL_REFUND_PENDING: 환불 처리 중
 * - CANCEL_COMPLETED: sellerCancelReason 있으면 판매자 취소, userCancelReason 있으면 구매자 취소, 둘 다 없으면 일반 취소
 * - NO_SHOW: 노쇼 처리
 * - 그 외 상태는 안내 없음 (null 반환)
 */
export function OrderStatusNotice({ order }: OrderStatusNoticeProps) {
  switch (order.orderStatus) {
    /* 입금대기: 계좌 정보 및 입금 안내 표시 */
    case OrderStatus.PAYMENT_PENDING:
      return <PaymentPendingInfo order={order} />;

    /* 입금완료: 판매자 확인 대기 중 안내 */
    case OrderStatus.PAYMENT_COMPLETED:
      return (
        <div className="flex items-center gap-1.5 mt-1 mb-4 px-2.5 py-2 bg-gray-50 rounded-lg">
          <Icon name="warning" width={16} height={16} className="text-gray-400" />
          <p className="text-xs text-gray-700">판매자의 입금 확인 후 예약이 확정됩니다.</p>
        </div>
      );

    /* 환불대기: 환불 처리 중 안내 */
    case OrderStatus.CANCEL_REFUND_PENDING:
      return (
        <div className="flex items-center gap-1.5 mt-1 mb-4 px-2.5 py-2 bg-gray-50 rounded-lg">
          <Icon name="warning" width={16} height={16} className="text-gray-400" />
          <p className="text-xs text-gray-700">환불 완료까지 1-2일 소요될 수 있습니다.</p>
        </div>
      );

    /* 예약취소: sellerCancelReason → 판매자 취소 / userCancelReason → 구매자 취소 / 둘 다 없으면 일반 취소 */
    case OrderStatus.CANCEL_COMPLETED:
      return (
        <div className="flex items-center gap-1.5 mt-1 mb-4 px-2.5 py-2 bg-gray-50 rounded-lg">
          <Icon name="warning" width={16} height={16} className="text-gray-400" />
          {order.sellerCancelReason ? (
            <>
              <p className="text-xs text-gray-700">판매자 요청으로 예약 취소되었습니다.</p>
              <p className="text-xs text-gray-700">{order.sellerCancelReason}</p>
            </>
          ) : order.userCancelReason ? (
            <>
              <p className="text-xs text-gray-700">구매자 요청으로 예약 취소되었습니다.</p>
              <p className="text-xs text-gray-700">{order.userCancelReason}</p>
            </>
          ) : (
            <p className="text-xs text-gray-700">예약이 취소되었습니다.</p>
          )}
        </div>
      );

    /* 노쇼: 노쇼 처리 안내 */
    case OrderStatus.NO_SHOW:
      return (
        <div className="flex items-center gap-1.5 mt-1 mb-4 px-2.5 py-2 bg-gray-50 rounded-lg">
          <Icon name="warning" width={16} height={16} className="text-gray-400" />
          <p className="text-xs text-gray-700">노쇼 처리된 예약입니다.</p>
          <p className="text-xs text-gray-700">
            {order.storeName}입니다. 노쇼로 인해 케이크는 폐기처리하였습니다.
          </p>
        </div>
      );

    default:
      return null;
  }
}
