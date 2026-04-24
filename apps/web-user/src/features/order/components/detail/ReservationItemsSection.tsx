import Link from "next/link";
import { OrderResponse, OrderStatus } from "@/apps/web-user/features/order/types/order.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { OrderDetailSectionTitle } from "./OrderDetailSectionTitle";
import { ReservationItemCard } from "./ReservationItemCard";

interface ReservationItemsSectionProps {
  order: OrderResponse;
}

const PRE_PAYMENT_CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.RESERVATION_REQUESTED,
  OrderStatus.PAYMENT_PENDING,
];

const POST_PAYMENT_CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PAYMENT_COMPLETED,
  OrderStatus.CONFIRMED,
];

export function ReservationItemsSection({ order }: ReservationItemsSectionProps) {
  const isPrePaymentCancellable = PRE_PAYMENT_CANCELLABLE_STATUSES.includes(order.orderStatus);
  const isPostPaymentCancellable = POST_PAYMENT_CANCELLABLE_STATUSES.includes(order.orderStatus);
  const canCancel = isPrePaymentCancellable || isPostPaymentCancellable;

  const renderCancelControl = () => {
    if (!canCancel) return undefined;
    const className = "text-xs text-gray-500 font-bold underline";
    if (isPrePaymentCancellable) {
      return (
        <Link href={PATHS.ORDER.CANCEL(order.id)} className={className}>
          예약취소
        </Link>
      );
    }
    // TODO: 결제 완료 이후 취소(환불 요청) 페이지 연결 예정
    return (
      <button type="button" className={className}>
        예약취소
      </button>
    );
  };

  return (
    <section className="px-5">
      <OrderDetailSectionTitle right={renderCancelControl()}>예약 상품</OrderDetailSectionTitle>
      <div className="space-y-3">
        {order.orderItems.map((item) => (
          <ReservationItemCard key={item.id} order={order} item={item} />
        ))}
      </div>
    </section>
  );
}
