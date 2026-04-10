"use client";

import { useCallback, useEffect, useState } from "react";
import { OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { Icon } from "@/apps/web-user/common/components/icons";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { Toast } from "@/apps/web-user/common/components/toast/Toast";
import { getBankLabel } from "@/apps/web-user/common/utils/bank.util";
import { usePaymentComplete } from "@/apps/web-user/features/order/hooks/mutations/usePaymentComplete";
import { OrderActionButtons } from "./OrderActionButtons";
import { EasyPaymentBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/EasyPaymentBottomSheet";

const PAYMENT_DEADLINE_HOURS = 12;

function useCountdown(paymentPendingAt?: string) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!paymentPendingAt) return;

    const deadline = new Date(paymentPendingAt).getTime() + PAYMENT_DEADLINE_HOURS * 60 * 60 * 1000;

    function update() {
      const diff = Math.max(0, deadline - Date.now());
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setRemaining(`${h}:${m}:${s}`);
    }

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [paymentPendingAt]);

  return remaining;
}

export function PaymentPendingInfo({ order }: { order: OrderResponse }) {
  const countdown = useCountdown(order.paymentPendingAt);
  const { mutate: paymentComplete, isPending: isCompleting } = usePaymentComplete();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEasyPayOpen, setIsEasyPayOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleConfirmPayment = () => {
    paymentComplete(order.id);
    setIsConfirmOpen(false);
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(order.storeBankAccountNumber ?? "");
    setShowCopyToast(true);
  };

  const handleCloseCopyToast = useCallback(() => setShowCopyToast(false), []);

  return (
    <div className="mt-2.5 -mx-4">
      {/* 입금 대기 중 헤더 */}
      <div className="flex items-center justify-between bg-blue-50 rounded-lg rounded-b-none px-4 py-2.5">
        <span className="text-sm font-bold text-blue-400">입금 대기 중</span>
        <span className="text-sm font-bold text-blue-400">{countdown}</span>
      </div>

      <div className="py-3.5 px-4">
        <p className="text-2xs text-gray-500 mb-2.5">* 시간 내 미입금 시 예약이 취소됩니다.</p>

        {/* 총 금액 */}
        <div className="flex items-center mb-3 gap-8">
          <span className="w-[52px] text-sm/5 text-gray-500">총 금액</span>
          <span className="text-sm font-bold text-gray-900">
            {order.totalPrice.toLocaleString()}원
          </span>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2">
          {/* 계좌번호 */}
          <div className="flex items-center">
            <span className="w-[52px] text-sm/5 text-gray-500 shrink-0">계좌번호</span>
            <span className="ml-8 text-sm text-gray-900">{order.storeBankAccountNumber}</span>
            <button
              type="button"
              onClick={handleCopyAccountNumber}
              className="ml-1 text-gray-400 w-5 h-5 cursor-pointer"
            >
              <Icon name="copy" width={20} height={20} />
            </button>
          </div>

          {/* 은행 */}
          <div className="flex items-center gap-8">
            <span className="w-[52px] text-sm/5 text-gray-500 shrink-0">은행</span>
            <span className="text-sm text-gray-900">{getBankLabel(order.storeBankName)}</span>
          </div>

          {/* 예금주명 */}
          <div className="flex items-center gap-8">
            <span className="w-[52px] text-sm/5 text-gray-500 shrink-0">예금주명</span>
            <span className="text-sm text-gray-900">{order.storeAccountHolderName}</span>
          </div>
        </div>
      </div>

      <div className="px-4">
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

      {showCopyToast && (
        <Toast
          message="복사되었습니다"
          iconName="checkCircle"
          iconClassName="text-green-400"
          variant="row"
          onClose={handleCloseCopyToast}
        />
      )}
    </div>
  );
}
