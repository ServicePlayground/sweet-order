import { OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { OrderDetailSectionTitle } from "./OrderDetailSectionTitle";
import { ReservationItemCard } from "./ReservationItemCard";

interface ReservationItemsSectionProps {
  order: OrderResponse;
}

export function ReservationItemsSection({ order }: ReservationItemsSectionProps) {
  return (
    <section className="px-5">
      <OrderDetailSectionTitle
        right={
          <button type="button" className="text-xs text-gray-500 font-bold underline">
            예약취소
          </button>
        }
      >
        예약 상품
      </OrderDetailSectionTitle>
      <div className="space-y-3">
        {order.orderItems.map((item) => (
          <ReservationItemCard key={item.id} order={order} item={item} />
        ))}
      </div>
    </section>
  );
}
