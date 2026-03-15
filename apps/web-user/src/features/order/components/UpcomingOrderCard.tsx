"use client";

import Image from "next/image";
import { Icon } from "@/apps/web-user/common/components/icons";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { formatAddressToDistrict } from "@/apps/web-user/common/utils/address.util";
import Link from "next/link";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getDday(pickupDate: string): number {
  const now = new Date();
  const pickup = new Date(pickupDate);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pickupStart = new Date(pickup.getFullYear(), pickup.getMonth(), pickup.getDate());
  return Math.ceil((pickupStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDday(dday: number): string {
  if (dday === 0) return "D-Day";
  if (dday > 0) return `D-${dday}`;
  return `D+${Math.abs(dday)}`;
}

function formatPickupDate(pickupDate: string): string {
  const date = new Date(pickupDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dayName = DAY_NAMES[date.getDay()];
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${year}.${month}.${day}(${dayName}) · ${period} ${displayHour}:${minutes}`;
}

function formatProductSummary(order: OrderResponse): string {
  const totalItems = order.orderItems.length;
  if (totalItems <= 1) return order.productName;
  return `${order.productName} 외 ${totalItems - 1}`;
}

function openNavigation(lat: number, lng: number, name: string) {
  const encodedName = encodeURIComponent(name);
  window.open(`https://map.kakao.com/link/to/${encodedName},${lat},${lng}`, "_blank");
}

function OrderCard({ order, showTimeline }: { order: OrderResponse; showTimeline: boolean }) {
  const dday = getDday(order.pickupDate);
  const ddayText = formatDday(dday);
  const dateText = formatPickupDate(order.pickupDate);
  const address = formatAddressToDistrict(order.pickupAddress);
  const productSummary = formatProductSummary(order);
  const priceText = order.totalPrice.toLocaleString();
  const thumbnailUrl = order.productImages?.[0];

  return (
    <div className={showTimeline ? "pl-[30px]" : "pt-4"}>
      {/* D-day + 날짜 */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-2xs font-bold text-primary bg-primary-50 rounded px-1 py-0.5">
          {ddayText}
        </span>
        <span className="text-sm font-bold text-gray-900">{dateText}</span>
      </div>

      {/* 주문 정보 */}
      <div className="flex gap-3 mb-3.5">
        {/* 썸네일 */}
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

        {/* 텍스트 정보 */}
        <div className="flex-1 min-w-0">
          <p className="text-2sm font-bold text-gray-900 truncate">{order.storeName}</p>
          <p className="text-xs text-gray-500 truncate">{address}</p>
          <p className="flex items-center gap-1 text-2sm text-gray-900 mt-1.5">
            <span>{priceText}원</span>
            <span>({productSummary})</span>
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <Link
          href={`/order/${order.id}`}
          className="flex-1 h-[32px] flex items-center justify-center rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white"
        >
          상세보기
        </Link>
        <button
          type="button"
          onClick={() => openNavigation(order.pickupLatitude, order.pickupLongitude, order.storeName)}
          className="flex-1 h-[32px] flex items-center justify-center gap-0.5 rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white"
        >
          <Icon name="map" width={16} height={16} className="text-gray-700" />
          길찾기
        </button>
      </div>
    </div>
  );
}

export function UpcomingOrderCard() {
  const { data } = useMyOrders();

  const orders = data?.data;
  if (!orders || orders.length === 0) return null;

  const isMultiple = orders.length > 1;

  return (
    <section className="mx-5 mb-4 rounded-xl overflow-hidden border border-primary-100" style={{ background: "linear-gradient(180deg, #FFEFEB 0%, #FFFFFF 30%)" }}>
      <div className="py-4 px-[18px]">
        {/* 헤더 */}
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-primary">예정된 예약이 있어요</h2>
          {isMultiple && (
            <span className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold px-1">
              {orders.length}
            </span>
          )}
        </div>

        {/* 주문 카드 목록 */}
        {/* {orders.map((order) => (
          <OrderCard key={order.id} order={order} showTimeline={isMultiple} />
        ))} */}
        
      </div>
    </section>
  );
}
