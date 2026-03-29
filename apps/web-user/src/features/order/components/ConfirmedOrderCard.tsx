import Link from "next/link";
import { Icon } from "@/apps/web-user/common/components/icons";
import { OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { OrderCardContent } from "./OrderCardContent";

function openNavigation(lat: number, lng: number, name: string) {
  const encodedName = encodeURIComponent(name);
  window.open(`https://map.kakao.com/link/to/${encodedName},${lat},${lng}`, "_blank");
}

export function ConfirmedOrderCard({ order }: { order: OrderResponse }) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-primary-100"
      style={{ background: "linear-gradient(180deg, #FFEFEB 0%, #FFFFFF 30%)" }}
    >
      <div className="py-4 px-[18px]">
        <h2 className="text-sm font-bold text-primary">예정된 예약이 있어요</h2>
        <div className="pt-2.5">
          <OrderCardContent order={order} />
          <div className="flex gap-2">
            <Link
              href={`/order/${order.id}`}
              className="flex-1 h-[32px] flex items-center justify-center gap-0.5 rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white"
            >
              <Icon name="reviewQna" width={16} height={16} className="text-gray-700" />
              스토어 문의
            </Link>
            <button
              type="button"
              onClick={() =>
                openNavigation(order.pickupLatitude, order.pickupLongitude, order.storeName)
              }
              className="flex-1 h-[32px] flex items-center justify-center gap-0.5 rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white"
            >
              <Icon name="map" width={16} height={16} className="text-gray-700" />
              길찾기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
