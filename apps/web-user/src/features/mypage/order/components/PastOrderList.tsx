"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderResponse, OrderItemResponse, OrderStatus } from "@/apps/web-user/features/order/types/order.type";
import { formatAddressToDistrict } from "@/apps/web-user/common/utils/address.util";
import { OrderDateHeader } from "./OrderDateHeader";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusNotice } from "./OrderStatusNotice";
import { OrderActionButtons } from "./OrderActionButtons";
import { Icon } from "@/apps/web-user/common/components/icons";
import { NavigationBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/NavigationBottomSheet";
import { StoreInquiryBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/StoreInquiryBottomSheet";
import { OrderReviewPrompt } from "./OrderReviewPrompt";

function formatItemName(order: OrderResponse, item: OrderItemResponse) {
  const parts: string[] = [order.productName];
  if (item.sizeDisplayName) parts.push(item.sizeDisplayName);
  if (item.flavorDisplayName) parts.push(item.flavorDisplayName);
  return parts.join(" ");
}

function PastOrderItem({ order, isLast }: { order: OrderResponse; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [isInquirySheetOpen, setIsInquirySheetOpen] = useState(false);
  const [isMapSheetOpen, setIsMapSheetOpen] = useState(false);
  const visibleItems = expanded ? order.orderItems : order.orderItems.slice(0, 2);
  const hasMore = order.orderItems.length > 2;

  return (
    <div className="relative pl-[30px]">
      <div
        className="absolute top-0 left-0 w-5"
        style={{ height: !isLast ? "calc(100% + 48px)" : "100%" }}
      >
        <span className="absolute top-0 left-0 w-5 h-5 bg-gray-50 rounded-full z-5" />
        <span className="absolute top-[5px] left-[5px] w-2.5 h-2.5 bg-gray-300 rounded-full z-10" />
        {!isLast && (
          <span
            className="absolute top-5 left-[9px] w-0.5 h-[calc(100%-20px)] z-1"
            style={{
              backgroundImage: "url(/images/contents/order_side_line.png)",
              backgroundSize: "2px auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>
      <OrderDateHeader pickupDate={order.pickupDate} variant="past" />

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
        <div className="space-y-2 py-2.5">
          {visibleItems.map((item) => {
            const thumbnailUrl = item.imageUrls?.[0] || order.productImages?.[0];
            return (
              <div key={item.id} className="flex items-center gap-2.5">
                <div className="w-[44px] h-[44px] rounded overflow-hidden bg-gray-100 shrink-0">
                  {thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={order.productName}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <OrderStatusBadge status={order.orderStatus} />
                    <span className="text-sm text-gray-900 truncate ml-1">
                      {formatItemName(order, item)}
                    </span>
                    <span className="flex items-center gap-0.5 ml-0.5 text-sm text-gray-900 shrink-0">
                      <Icon name="multiply" width={8} height={8} /> {item.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">{item.itemPrice.toLocaleString()}원</p>
                </div>
              </div>
            );
          })}
          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center justify-end gap-0.5 !mt-2 text-xs text-gray-500 w-full text-center"
            >
              {expanded ? "간략히 보기" : `전체보기 ${order.orderItems.length}`}
              <Icon
                name="arrow"
                width={16}
                height={16}
                className={`text-gray-300 transition-transform ${expanded ? "rotate-0" : "rotate-180"}`}
              />
            </button>
          )}
        </div>

        {/* 상태별 안내 */}
        <OrderStatusNotice order={order} />

        {/* 스토어 문의 / 길찾기 */}
        {/* 픽업완료: 버튼 없음 (후기 영역에서 별도 처리) */}
        {/* 픽업대기: 스토어 문의 + 길찾기 / 그 외: 스토어 문의만 */}
        {order.orderStatus !== OrderStatus.PICKUP_COMPLETED && (
          <OrderActionButtons
            buttons={[
              {
                label: "스토어 문의",
                icon: "reviewQna",
                onClick: () => setIsInquirySheetOpen(true),
              },
              ...(order.orderStatus === OrderStatus.PICKUP_PENDING
                ? [{
                    label: "길찾기" as const,
                    icon: "map" as const,
                    onClick: () => setIsMapSheetOpen(true),
                  }]
                : []),
            ]}
          />
        )}

        {/* 후기 영역: 픽업완료 + 작성가능이면 후기 유도, 작성완료면 후기보기 */}
        <OrderReviewPrompt order={order} />
      </div>

      <NavigationBottomSheet
        isOpen={isMapSheetOpen}
        onClose={() => setIsMapSheetOpen(false)}
        latitude={order.pickupLatitude}
        longitude={order.pickupLongitude}
        storeName={order.storeName}
      />
      <StoreInquiryBottomSheet
        isOpen={isInquirySheetOpen}
        onClose={() => setIsInquirySheetOpen(false)}
        kakaoChannelUrl={null}
        instagramUrl={null}
      />
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
          <div key={i} className="animate-pulse">
            <div className="flex gap-2 mb-3">
              <div className="h-4 w-4 bg-gray-100 rounded" />
              <div className="h-5 w-40 bg-gray-100 rounded" />
            </div>
            <div className="rounded-xl border border-gray-100 px-4 py-3">
              <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
              <div className="h-3 w-32 bg-gray-100 rounded mb-3" />
              <div className="flex gap-3 mb-3">
                <div className="w-[44px] h-[44px] rounded bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-3 w-36 bg-gray-100 rounded" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-[40px] bg-gray-100 rounded-lg" />
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
      {orders.map((order, index) => (
        <PastOrderItem key={order.id} order={order} isLast={index === orders.length - 1} />
      ))}
    </div>
  );
}

export function usePastOrderCount() {
  const { data } = useMyOrders({ type: "PAST" });
  return data?.data?.length ?? 0;
}
