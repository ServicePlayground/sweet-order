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
import { Icon } from "@/apps/web-user/common/components/icons";

function getStatusNotice(status: OrderStatus): {
  message: string;
  isRed: boolean;
} | null {
  switch (status) {
    case OrderStatus.PAYMENT_COMPLETED:
      return { message: "판매자의 입금 확인 후 예약이 확정됩니다.", isRed: false };
    case OrderStatus.CANCEL_REFUND_PENDING:
      return { message: "환불까지 영업일 기준 1-2일 소요될 수 있습니다.", isRed: false };
    case OrderStatus.SELLER_CANCELLED:
      return { message: "판매자 요청으로 예약 취소되었습니다.", isRed: false };
    case OrderStatus.NO_SHOW:
      return { message: "노쇼 처리된 예약입니다.", isRed: true };
    default:
      return null;
  }
}

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
      {(() => {
        const notice = getStatusNotice(order.orderStatus);
        if (!notice) return null;
        return (
          <div className="px-5 py-4"> 
            <div
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
                notice.isRed ? "bg-red-50" : "bg-gray-50"
              }`}
            >
              <Icon
                name="warning"
                width={16}
                height={16}
                className={notice.isRed ? "text-red-400" : "text-gray-400"}
              />
              <p className="text-xs text-gray-700">
                {notice.message}
              </p>
            </div>
          </div>
        );
      })()}
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
