"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "@/apps/web-user/common/components/icons";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children, footer }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // 바깥 영역 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 바텀시트 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed mx-auto inset-0 z-50 bg-black/50 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 max-w-[638px] mx-auto h-[80%] bg-white rounded-t-3xl flex flex-col animate-slide-up"
      >
        {/* Header */}
        <div className="relative h-[64px] border-b border-gray-100">
          <h2 className="flex items-center justify-center h-[64px] text-base font-bold text-center text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-1/2 -translate-y-1/2 right-[20px] w-[24px] h-[24px] flex items-center justify-center"
          >
            <Icon name="close" width={24} height={24} className="text-gray-900" />
          </button>
        </div>

        {/* Content - 스크롤 가능 영역 */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer - 고정 영역 */}
        {footer && (
          <div className="shadow-[0_12px_48px_-12px_rgba(0,0,0,0.16)] border-gray-100 bg-white">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
