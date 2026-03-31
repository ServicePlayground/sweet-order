"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/apps/web-user/common/components/icons";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderResponse, OrderStatus, OrderItemResponse } from "@/apps/web-user/features/order/types/order.type";

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

function getDDay(pickupDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickup = new Date(pickupDate);
  pickup.setHours(0, 0, 0, 0);
  const diff = Math.ceil((pickup.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

function formatPickupDateTime(pickupDate: string) {
  const date = new Date(pickupDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours < 12 ? "오전" : "오후";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${year}.${month}.${day}(${weekday}) · ${ampm} ${displayHours}:${minutes}`;
}

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
  const dday = getDDay(order.pickupDate);
  const statusLabel = ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus;
  const statusColor = STATUS_COLOR[order.orderStatus] ?? "text-gray-500 bg-gray-50";

  return (
    <div className="py-4">
      {/* D-day + 날짜 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-primary border border-primary-100 rounded px-1.5 py-0.5">
          {dday}
        </span>
        <span className="text-sm font-bold text-gray-900">
          {formatPickupDateTime(order.pickupDate)}
        </span>
      </div>

      {/* 카드 */}
      <div className="rounded-xl bg-gray-25 border border-gray-100 p-4">
        {/* 스토어 정보 + 예약상세 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-gray-900">{order.storeName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.pickupRoadAddress}</p>
          </div>
          <Link
            href={`/order/${order.id}`}
            className="text-xs font-bold text-gray-500 shrink-0"
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
        <div className="flex gap-2">
          <Link
            href={`/order/${order.id}`}
            className="flex-1 h-[40px] flex items-center justify-center gap-1 rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white"
          >
            <Icon name="reviewQna" width={16} height={16} className="text-gray-700" />
            스토어 문의
          </Link>
          <button
            type="button"
            onClick={() =>
              openNavigation(order.pickupLatitude, order.pickupLongitude, order.storeName)
            }
            className="flex-1 h-[40px] flex items-center justify-center gap-1 rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white"
          >
            <Icon name="map" width={16} height={16} className="text-gray-700" />
            길찾기
          </button>
        </div>
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
    <>
      {orders.map((order) => (
        <UpcomingOrderItem key={order.id} order={order} />
      ))}
    </>
  );
}

export function useUpcomingOrderCount() {
  const { data } = useMyOrders({ type: "UPCOMING" });
  return data?.data?.length ?? 0;
}
