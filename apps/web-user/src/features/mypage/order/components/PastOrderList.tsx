"use client";

import Image from "next/image";
import Link from "next/link";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderResponse, OrderStatus } from "@/apps/web-user/features/order/types/order.type";

const ORDER_STATUS_LABEL: Record<string, string> = {
  [OrderStatus.PICKUP_COMPLETED]: "픽업완료",
  [OrderStatus.CANCEL_COMPLETED]: "취소완료",
  [OrderStatus.CANCEL_REFUND_PENDING]: "환불대기",
  [OrderStatus.CANCEL_REFUND_COMPLETED]: "환불완료",
  [OrderStatus.NO_SHOW]: "노쇼",
};

const STATUS_COLOR: Record<string, string> = {
  [OrderStatus.PICKUP_COMPLETED]: "text-gray-500 bg-gray-50",
  [OrderStatus.CANCEL_COMPLETED]: "text-red-400 bg-red-50",
  [OrderStatus.CANCEL_REFUND_PENDING]: "text-red-400 bg-red-50",
  [OrderStatus.CANCEL_REFUND_COMPLETED]: "text-red-400 bg-red-50",
  [OrderStatus.NO_SHOW]: "text-gray-500 bg-gray-50",
};

function formatPickupDate(pickupDate: string) {
  const date = new Date(pickupDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

function formatProductSummary(order: OrderResponse) {
  const items = order.orderItems;
  if (!items || items.length === 0) return order.productName;
  const first = items[0];
  const parts: string[] = [order.productName];
  if (first.sizeDisplayName) parts.push(first.sizeDisplayName);
  if (first.flavorDisplayName) parts.push(first.flavorDisplayName);
  if (items.length > 1) parts.push(`외 ${items.length - 1}건`);
  return parts.join(" · ");
}

function PastOrderItem({ order }: { order: OrderResponse }) {
  const thumbnailUrl = order.productImages?.[0];
  const statusLabel = ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus;
  const statusColor = STATUS_COLOR[order.orderStatus] ?? "text-gray-500 bg-gray-50";

  return (
    <Link href={`/order/${order.id}`} className="block py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`text-2xs font-bold rounded px-1.5 py-0.5 ${statusColor}`}>
          {statusLabel}
        </span>
        <span className="text-xs text-gray-500">{formatPickupDate(order.pickupDate)}</span>
      </div>
      <div className="flex gap-3">
        <div className="w-[64px] h-[64px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={order.productName}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{order.storeName}</p>
          <p className="text-xs text-gray-500 truncate">{formatProductSummary(order)}</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {order.totalPrice.toLocaleString()}원
          </p>
        </div>
      </div>
    </Link>
  );
}

export function PastOrderList() {
  const { data, isLoading } = useMyOrders({ type: "PAST" });
  const orders = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-2 mb-2.5">
              <div className="h-5 w-14 bg-gray-100 rounded" />
              <div className="h-5 w-24 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-3">
              <div className="w-[64px] h-[64px] rounded-lg bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-36 bg-gray-100 rounded" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-sm text-gray-500 py-10 text-center">지난 예약이 없습니다.</p>;
  }

  return (
    <>
      {orders.map((order) => (
        <PastOrderItem key={order.id} order={order} />
      ))}
    </>
  );
}

export function usePastOrderCount() {
  const { data } = useMyOrders({ type: "PAST" });
  return data?.data?.length ?? 0;
}
