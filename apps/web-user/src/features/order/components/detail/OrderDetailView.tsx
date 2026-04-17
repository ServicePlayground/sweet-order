"use client";

import { useState } from "react";
import { OrderResponse, OrderStatus } from "@/apps/web-user/features/order/types/order.type";
import { NavigationBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/NavigationBottomSheet";
import { StoreInquiryBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/StoreInquiryBottomSheet";
import { ReservationInfoSection } from "./ReservationInfoSection";
import { PaymentInfoSection } from "./PaymentInfoSection";
import { ReservationItemsSection } from "./ReservationItemsSection";
import { NoticeSection } from "./NoticeSection";
import { PaymentPendingCountdownHeader } from "./PaymentPendingCountdownHeader";

interface OrderDetailViewProps {
  order: OrderResponse;
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
  const [isMapSheetOpen, setIsMapSheetOpen] = useState(false);
  const [isInquirySheetOpen, setIsInquirySheetOpen] = useState(false);

  const isPaymentPending = order.orderStatus === OrderStatus.PAYMENT_PENDING;

  return (
    <div className="pt-5">
      {/* 입금대기: 상단 카운트다운 + 결제정보 → 예약정보 순서 */}
      {isPaymentPending && (
        <div className="-mt-5 mb-3">
          <PaymentPendingCountdownHeader order={order} />
        </div>
      )}
      <div className="flex flex-col gap-10">
        {isPaymentPending ? (
          <div className="flex flex-col gap-10">
            <PaymentInfoSection order={order} />
            <ReservationInfoSection
              order={order}
              onInquiryClick={() => setIsInquirySheetOpen(true)}
              onMapClick={() => setIsMapSheetOpen(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <ReservationInfoSection
              order={order}
              onInquiryClick={() => setIsInquirySheetOpen(true)}
              onMapClick={() => setIsMapSheetOpen(true)}
            />
            <PaymentInfoSection order={order} />
          </div>
        )}

        <ReservationItemsSection order={order} />
        <NoticeSection />

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
    </div>
  );
}
