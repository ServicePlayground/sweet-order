"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/apps/web-user/common/components/icons";
import {
  OrderResponse,
  OrderItemResponse,
  OrderStatus,
} from "@/apps/web-user/features/order/types/order.type";
import { OrderStatusBadge } from "@/apps/web-user/features/order/components/OrderStatusBadge";

function formatItemName(order: OrderResponse, item: OrderItemResponse) {
  const parts: string[] = [order.productName];
  if (item.sizeDisplayName) parts.push(item.sizeDisplayName);
  if (item.flavorDisplayName) parts.push(item.flavorDisplayName);
  return parts.join(" ");
}

interface ReservationItemCardProps {
  order: OrderResponse;
  item: OrderItemResponse;
}

export function ReservationItemCard({ order, item }: ReservationItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const thumbnailUrl = item.imageUrls?.[0] || order.productImages?.[0];

  return (
    <div className="rounded-xl bg-gray-25 border border-gray-100 overflow-hidden">
      <div className="p-3">
        <div className="flex gap-3">
          <div className="w-[72px] h-[72px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={order.productName}
                width={72}
                height={72}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <p className="text-xs text-gray-500">예약상품</p>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <p className="text-sm text-gray-900 mt-0.5 truncate">
              {formatItemName(order, item)} ×{item.quantity}
            </p>
            <p className="text-base font-bold text-gray-900 mt-1">
              {item.itemPrice.toLocaleString()}원
            </p>
          </div>
        </div>
        {(() => {
          const buttonClass =
            "flex-1 h-[32px] rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white";
          const status = order.orderStatus;

          if (status === OrderStatus.RESERVATION_REQUESTED) {
            return (
              <div className="flex gap-2 mt-3">
                <button type="button" className={buttonClass}>
                  예약취소
                </button>
                <button type="button" className={buttonClass}>
                  옵션변경
                </button>
              </div>
            );
          }

          if (
            status === OrderStatus.PAYMENT_PENDING ||
            status === OrderStatus.PAYMENT_COMPLETED ||
            status === OrderStatus.CONFIRMED
          ) {
            return (
              <div className="flex gap-2 mt-3">
                <button type="button" className={buttonClass}>
                  예약취소
                </button>
              </div>
            );
          }

          if (
            status === OrderStatus.CANCEL_REFUND_PENDING ||
            status === OrderStatus.CANCEL_COMPLETED
          ) {
            return (
              <div className="flex gap-2 mt-3">
                <button type="button" className={buttonClass}>
                  취소 상세
                </button>
              </div>
            );
          }

          return null;
        })()}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center justify-center w-full py-2.5 text-xs text-gray-500 border-t border-gray-100 bg-white"
      >
        상세 보기
        <Icon
          name="arrow"
          width={16}
          height={16}
          className={`text-gray-400 transition-transform ${expanded ? "rotate-0" : "rotate-180"}`}
        />
      </button>
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-100 bg-white space-y-1.5 text-xs text-gray-700">
          {item.sizeDisplayName && <p>사이즈: {item.sizeDisplayName}</p>}
          {item.flavorDisplayName && <p>맛: {item.flavorDisplayName}</p>}
          {item.letteringMessage && <p>레터링: {item.letteringMessage}</p>}
          {item.requestMessage && <p>요청사항: {item.requestMessage}</p>}
        </div>
      )}
    </div>
  );
}
