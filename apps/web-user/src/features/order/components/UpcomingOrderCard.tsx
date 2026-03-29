"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { useMyOrders } from "@/apps/web-user/features/order/hooks/queries/useMyOrders";
import { OrderStatus } from "@/apps/web-user/features/order/types/order.type";
import { PaymentPendingCard } from "./PaymentPendingCard";
import { ConfirmedOrderCard } from "./ConfirmedOrderCard";

function UpcomingOrderCardSkeleton() {
  return (
    <div className="mb-4 px-5">
      <div className="rounded-xl border border-gray-100 p-[18px] animate-pulse">
        <div className="h-4 w-40 bg-gray-100 rounded mb-4" />
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="h-4 w-10 bg-gray-100 rounded" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-3 mb-3.5">
          <div className="w-[64px] h-[64px] rounded-lg bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3.5 w-24 bg-gray-100 rounded" />
            <div className="h-3 w-36 bg-gray-100 rounded" />
            <div className="h-3.5 w-28 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-[32px] bg-gray-100 rounded-lg" />
          <div className="flex-1 h-[32px] bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function UpcomingOrderCard() {
  const { data, isLoading } = useMyOrders({ type: "UPCOMING" });
  const hasPeeked = useRef(false);

  if (isLoading) return <UpcomingOrderCardSkeleton />;

  const HIDDEN_STATUSES: string[] = [
    OrderStatus.RESERVATION_REQUESTED,
    OrderStatus.PAYMENT_COMPLETED,
    OrderStatus.CANCEL_COMPLETED,
    OrderStatus.CANCEL_REFUND_PENDING,
    OrderStatus.CANCEL_REFUND_COMPLETED,
    OrderStatus.NO_SHOW,
    OrderStatus.PICKUP_COMPLETED,
  ];
  const orders = data?.data
    ?.filter((o) => !HIDDEN_STATUSES.includes(o.orderStatus))
    .sort((a, b) => {
      const aIsPending = a.orderStatus === OrderStatus.PAYMENT_PENDING ? 0 : 1;
      const bIsPending = b.orderStatus === OrderStatus.PAYMENT_PENDING ? 0 : 1;
      return aIsPending - bIsPending;
    });
  if (!orders || orders.length === 0) return null;

  const handleSwiperInit = (swiper: SwiperType) => {
    if (orders.length > 1 && !hasPeeked.current) {
      hasPeeked.current = true;
      const wrapper = swiper.wrapperEl;
      if (!wrapper) return;
      setTimeout(() => {
        wrapper.style.transition = "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)";
        wrapper.style.transform = "translate3d(-15px, 0, 0)";
        setTimeout(() => {
          wrapper.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
          wrapper.style.transform = "translate3d(0, 0, 0)";
          setTimeout(() => {
            wrapper.style.transition = "";
          }, 600);
        }, 350);
      }, 500);
    }
  };

  const renderCard = (order: (typeof orders)[number]) =>
    order.orderStatus === OrderStatus.PAYMENT_PENDING ? (
      <PaymentPendingCard order={order} />
    ) : (
      <ConfirmedOrderCard order={order} />
    );

  if (orders.length === 1) {
    return <div className="mb-4 px-5">{renderCard(orders[0])}</div>;
  }

  return (
    <div className="mb-4 pl-5">
      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        slidesOffsetAfter={20}
        className="!overflow-visible"
        onAfterInit={handleSwiperInit}
      >
        {orders.map((order) => (
          <SwiperSlide key={order.id} style={{ width: "calc(100vw - 40px)" }}>
            {renderCard(order)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
