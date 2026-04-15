"use client";

import { useState } from "react";
import { BottomSheet } from "@/apps/web-user/common/components/bottom-sheets/BottomSheet";
import { Modal } from "@/apps/web-user/common/components/modals/Modal";
import { BottomSheetOptionList } from "./BottomSheetOptionList";

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

interface EasyPaymentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  amount: number;
}

export function EasyPaymentBottomSheet({
  isOpen,
  onClose,
  bankAccountNumber,
  bankName,
  amount,
}: EasyPaymentBottomSheetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeepLink = (url: string) => {
    if (!isMobileDevice()) {
      setIsModalOpen(true);
      return;
    }
    window.open(url, "_blank");
    onClose();
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="간편 입금하기"
        footerShadow={false}
        footer={
          <div className="px-5 py-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-[52px] rounded-xl border border-gray-100 text-base font-bold text-gray-900"
            >
              취소
            </button>
          </div>
        }
      >
        <div className="pt-5 px-5">
          <div className="flex flex-col gap-0.5 px-3.5 py-2.5 bg-gray-50 rounded-lg">
            <p className="text-xs font-bold text-gray-700">간편 입금이란?</p>
            <p className="text-xs text-gray-700">
              계좌정보를 자동으로 인식해 바로 이체할 수 있는 서비스입니다.
            </p>
          </div>
        </div>
        <BottomSheetOptionList
          items={[
            {
              icon: { type: "image", src: "/images/contents/toss.png", alt: "토스" },
              label: "토스",
              onClick: () =>
                handleDeepLink(
                  `supertoss://send?bank=${bankName}&accountNo=${bankAccountNumber}&amount=${amount}`,
                ),
            },
            {
              icon: { type: "image", src: "/images/contents/kakao.png", alt: "카카오페이" },
              label: "카카오페이",
              onClick: () => handleDeepLink("kakaotalk://kakaopay/money/to"),
            },
          ]}
        />
      </BottomSheet>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="픽케이크 앱에서 이용해주세요"
        description="간편 입금 기능은 모바일 앱에서만 이용 가능합니다."
        confirmText="확인"
        hideCancel
        onConfirm={() => setIsModalOpen(false)}
      />
    </>
  );
}
