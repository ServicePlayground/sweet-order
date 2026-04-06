"use client";

import Image from "next/image";
import Link from "next/link";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderResponse, OrderStatus, OrderItemResponse } from "@/apps/web-user/features/order/types/order.type";
import { formatAddressToDistrict } from "@/apps/web-user/common/utils/address.util";
import { OrderDateHeader } from "./OrderDateHeader";
import { OrderActionButtons } from "./OrderActionButtons";

const ORDER_STATUS_LABEL: Record<string, string> = {
  [OrderStatus.RESERVATION_REQUESTED]: "예약신청",
  [OrderStatus.PAYMENT_PENDING]: "입금대기",
  [OrderStatus.PAYMENT_COMPLETED]: "입금완료",
  [OrderStatus.CONFIRMED]: "예약확정",
  [OrderStatus.PICKUP_PENDING]: "픽업대기",
};

const STATUS_COLOR: Record<string, string> = {
  [OrderStatus.RESERVATION_REQUESTED]: "text-gray-500 bg-gray-50",
  [OrderStatus.PAYMENT_PENDING]: "text-blue-400 bg-blue-50",
  [OrderStatus.PAYMENT_COMPLETED]: "text-blue-400 bg-blue-50",
  [OrderStatus.CONFIRMED]: "text-primary bg-primary-50",
  [OrderStatus.PICKUP_PENDING]: "text-primary bg-primary-50",
};

function formatItemName(order: OrderResponse, item: OrderItemResponse) {
  const parts: string[] = [order.productName];
  if (item.sizeDisplayName) parts.push(item.sizeDisplayName);
  if (item.flavorDisplayName) parts.push(item.flavorDisplayName);
  return parts.join(" ");
}

function openNavigation(lat: number, lng: number, name: string) {
  const encodedName = encodeURIComponent(name);
  window.open(`https://map.kakao.com/link/to/${encodedName},${lat},${lng}`, "_blank");
}

function UpcomingOrderItem({ order }: { order: OrderResponse }) {
  const statusLabel = ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus;
  const statusColor = STATUS_COLOR[order.orderStatus] ?? "text-gray-500 bg-gray-50";

  return (
    <div className="px-[30px]">
      <OrderDateHeader pickupDate={order.pickupDate} variant="upcoming" />

      {/* 카드 */}
      <div className="rounded-xl border border-gray-100 px-4 py-3">
        {/* 스토어 정보 + 예약상세 */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-bold text-gray-900">{order.storeName}</p>
            <p className="text-2sm text-gray-500">{formatAddressToDistrict(order.pickupAddress)}</p>
          </div>
          <Link
            href={`/order/${order.id}`}
            className="flex items-center justify-center w-[46px] h-[21px] text-xs font-bold text-gray-400 underline"
          >
            예약상세
          </Link>
        </div>

        {/* 주문 아이템 목록 */}
        <div className="space-y-3 mb-4">
          {order.orderItems.map((item) => {
            const thumbnailUrl = item.imageUrls?.[0] || order.productImages?.[0];
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-[48px] h-[48px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={order.productName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-2xs font-bold rounded px-1.5 py-0.5 shrink-0 ${statusColor}`}>
                      {statusLabel}
                    </span>
                    <span className="text-xs text-gray-900 truncate">
                      {formatItemName(order, item)} x{item.quantity}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {item.itemPrice.toLocaleString()}원
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 버튼 */}
        <OrderActionButtons
          buttons={[
            { label: "스토어 문의", icon: "reviewQna", href: `/order/${order.id}` },
            {
              label: "길찾기",
              icon: "map",
              onClick: () => openNavigation(order.pickupLatitude, order.pickupLongitude, order.storeName),
            },
          ]}
        />
      </div>
    </div>
  );
}

export function UpcomingOrderList() {
  const { data, isLoading } = useMyOrders({ type: "UPCOMING" });
  const orders = [...(data?.data ?? [])].sort(
    (a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime(),
  );

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-2 mb-3">
              <div className="h-5 w-10 bg-gray-100 rounded" />
              <div className="h-5 w-40 bg-gray-100 rounded" />
            </div>
            <div className="rounded-xl bg-gray-25 border border-gray-100 p-4">
              <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
              <div className="h-3 w-32 bg-gray-100 rounded mb-3" />
              <div className="flex gap-3 mb-3">
                <div className="w-[48px] h-[48px] rounded-lg bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-3 w-36 bg-gray-100 rounded" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-[40px] bg-gray-100 rounded-lg" />
                <div className="flex-1 h-[40px] bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-sm text-gray-500 py-10 text-center">예정된 예약이 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-12 pt-2">
      {orders.map((order) => (
        <UpcomingOrderItem key={order.id} order={order} />
      ))}
    </div>
  );
}

export function useUpcomingOrderCount() {
  const { data } = useMyOrders({ type: "UPCOMING" });
  return data?.data?.length ?? 0;
}
