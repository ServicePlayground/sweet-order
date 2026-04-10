"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Icon } from "@/apps/web-user/common/components/icons";
import { OrderResponse } from "@/apps/web-user/features/order/types/order.type";
import { usePaymentComplete } from "@/apps/web-user/features/order/hooks/mutations/usePaymentComplete";
import { Toast } from "@/apps/web-user/common/components/toast/Toast";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { getBankLabel } from "@/apps/web-user/common/utils/bank.util";
import { EasyPaymentBottomSheet } from "@/apps/web-user/common/components/bottom-sheets/EasyPaymentBottomSheet";

function useCountdown(createdAt: string) {
  const getRemaining = () => {
    const deadline = new Date(createdAt).getTime() + 12 * 60 * 60 * 1000;
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = getRemaining();
      setRemaining(next);
      if (next <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return { text: `${hours}:${minutes}:${seconds}`, isExpired: remaining <= 0 };
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export function PaymentPendingCard({ order }: { order: OrderResponse }) {
  const countdown = useCountdown(order.paymentPendingAt ?? "");
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isEasyPayOpen, setIsEasyPayOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const handleCloseCopyToast = useCallback(() => setShowCopyToast(false), []);
  const handleCloseSuccessToast = useCallback(() => setShowSuccessToast(false), []);
  const { mutate: paymentComplete, isPending: isCompleting } = usePaymentComplete();
  const bankName = getBankLabel(order.storeBankName);
  const accountNumber = order.storeBankAccountNumber ?? "";
  const accountHolder = order.storeAccountHolderName ?? "";
  const accountInfo = `${bankName} · ${accountNumber}`;

  return (
    <>
      <div
        className="rounded-xl overflow-hidden border border-blue-100"
        style={{ background: "linear-gradient(180deg, #EBF8FF 0%, #FFFFFF 30%)" }}
      >
        <div className="py-4 px-[18px]">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-blue-400">입금 대기 중인 예약이 있어요</h2>
            <span
              className={`text-sm font-bold tabular-nums ${countdown.isExpired ? "text-gray-400" : "text-blue-400"}`}
            >
              {countdown.text}
            </span>
          </div>

          {/* 금액 + 계좌 정보 */}
          <div className="pt-[18px] flex flex-col">
            {/* 총 금액 */}
            <div className="flex items-center gap-8 border-b border-gray-50 mb-[9px] pb-2.5">
              <span className="text-sm text-gray-500 w-[52px] shrink-0">총 금액</span>
              <span className="text-sm font-bold text-gray-900">
                {order.totalPrice.toLocaleString()}원
              </span>
            </div>

            {/* 계좌번호 */}
            <div className="flex items-center gap-8 mb-1">
              <span className="text-sm text-gray-500 w-[52px] shrink-0">계좌번호</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-900">{accountInfo}</span>
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(accountNumber);
                    setShowCopyToast(true);
                  }}
                  className="p-0 border-none bg-transparent w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  <Icon name="copy" width={16} height={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* 예금주명 */}
            <div className="flex items-center gap-8 mb-4">
              <span className="text-sm text-gray-500 w-[52px] shrink-0">예금주명</span>
              <span className="text-sm text-gray-900">{accountHolder}</span>
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEasyPayOpen(true)}
                className="flex-1 h-[32px] flex items-center justify-center gap-1 rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white"
              >
                <Image src="/images/contents/toss.png" alt="토스" width={18} height={18} />
                <Image src="/images/contents/kakao.png" alt="카카오" width={18} height={18} />
                간편 입금하기
              </button>
              <button
                type="button"
                disabled={isCompleting}
                onClick={() => setIsConfirmOpen(true)}
                className="flex-1 h-[32px] flex items-center justify-center gap-0.5 rounded-lg border border-gray-100 text-xs font-bold text-gray-900 bg-white disabled:opacity-50"
              >
                {isCompleting ? "처리 중..." : "입금 완료했어요"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {createPortal(
        <EasyPaymentBottomSheet
          isOpen={isEasyPayOpen}
          onClose={() => setIsEasyPayOpen(false)}
          bankAccountNumber={order.storeBankAccountNumber}
          bankName={order.storeBankName}
          amount={order.totalPrice}
        />,
        document.body,
      )}

      {createPortal(
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
          onCancel={() => {
            paymentComplete(order.id, {
              onSuccess: () => setShowSuccessToast(true),
            });
            setIsConfirmOpen(false);
          }}
        />,
        document.body,
      )}

      {showSuccessToast &&
        createPortal(
          <Toast
            message="입금완료 처리되었습니다"
            iconName="checkCircle"
            iconClassName="text-green-400"
            duration={3000}
            onClose={handleCloseSuccessToast}
          />,
          document.body,
        )}
      {showCopyToast &&
        createPortal(
          <Toast
            message="계좌번호가 복사되었습니다"
            iconName="checkCircle"
            iconClassName="text-green-400"
            duration={3000}
            onClose={handleCloseCopyToast}
          />,
          document.body,
        )}
    </>
  );
}
