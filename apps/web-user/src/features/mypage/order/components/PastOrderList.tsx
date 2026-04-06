"use client";

import Image from "next/image";
import Link from "next/link";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderResponse, OrderStatus, OrderItemResponse } from "@/apps/web-user/features/order/types/order.type";
import { OrderDateHeader } from "./OrderDateHeader";

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

function formatItemName(order: OrderResponse, item: OrderItemResponse) {
  const parts: string[] = [order.productName];
  if (item.sizeDisplayName) parts.push(item.sizeDisplayName);
  if (item.flavorDisplayName) parts.push(item.flavorDisplayName);
  return parts.join(" ");
}

function PastOrderItem({ order }: { order: OrderResponse }) {
  const statusLabel = ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus;
  const statusColor = STATUS_COLOR[order.orderStatus] ?? "text-gray-500 bg-gray-50";

  return (
    <div className="px-[30px]">
      <OrderDateHeader pickupDate={order.pickupDate} variant="past" />

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
        <div className="space-y-3">
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
      </div>
    </div>
  );
}

export function PastOrderList() {
  const { data, isLoading } = useMyOrders({ type: "PAST" });
  const orders = [...(data?.data ?? [])].sort(
    (a, b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime(),
  );

  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse px-[30px]">
            <div className="flex gap-2 mb-3">
              <div className="h-4 w-4 bg-gray-100 rounded" />
              <div className="h-5 w-40 bg-gray-100 rounded" />
            </div>
            <div className="rounded-xl bg-gray-25 border border-gray-100 p-4">
              <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
              <div className="h-3 w-32 bg-gray-100 rounded mb-3" />
              <div className="flex gap-3">
                <div className="w-[48px] h-[48px] rounded-lg bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-3 w-36 bg-gray-100 rounded" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
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
    <div className="flex flex-col gap-12 pt-2">
      {orders.map((order) => (
        <PastOrderItem key={order.id} order={order} />
      ))}
    </div>
  );
}

export function usePastOrderCount() {
  const { data } = useMyOrders({ type: "PAST" });
  return data?.data?.length ?? 0;
}
