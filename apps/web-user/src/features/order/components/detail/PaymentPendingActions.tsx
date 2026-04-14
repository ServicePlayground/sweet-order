"use client";

import { useState } from "react";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { EasyPaymentBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/EasyPaymentBottomSheet";
import { usePaymentComplete } from "@/apps/web-user/features/order/hooks/mutations/usePaymentComplete";
import { OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { OrderActionButtons } from "@/apps/web-user/features/mypage/order/components/OrderActionButtons";

interface PaymentPendingActionsProps {
  order: OrderResponse;
}

export function PaymentPendingActions({ order }: PaymentPendingActionsProps) {
  const { mutate: paymentComplete, isPending: isCompleting } = usePaymentComplete();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEasyPayOpen, setIsEasyPayOpen] = useState(false);

  const handleConfirmPayment = () => {
    paymentComplete(order.id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className="mt-5">
        <OrderActionButtons
          direction="column"
          buttons={[
            {
              label: "간편 입금하기",
              images: [
                { src: "/images/contents/toss.png", alt: "토스" },
                { src: "/images/contents/kakao.png", alt: "카카오" },
              ],
              onClick: () => setIsEasyPayOpen(true),
            },
            {
              label: isCompleting ? "처리 중..." : "입금 완료했어요",
              onClick: () => setIsConfirmOpen(true),
            },
          ]}
        />
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="입금 완료하셨나요?"
        description={
          <>
            입금 완료 버튼을 누르면
            <br />
            판매자에게 확인 알림이 전달되며,
            <br />
            <span className="text-primary font-bold">입금 확인 후 예약이 확정</span>됩니다.
          </>
        }
        confirmText="취소"
        cancelText="입금 완료"
        cancelVariant="primary"
        onConfirm={() => setIsConfirmOpen(false)}
        onCancel={handleConfirmPayment}
      />

      <EasyPaymentBottomSheet
        isOpen={isEasyPayOpen}
        onClose={() => setIsEasyPayOpen(false)}
        bankAccountNumber={order.storeBankAccountNumber}
        bankName={order.storeBankName}
        amount={order.totalPrice}
      />
    </>
  );
}
