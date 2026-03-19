"use client";

import { BottomSheet } from "@/apps/web-user/common/components/bottom-sheets/BottomSheet";

interface SearchFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchFilterSheet({ isOpen, onClose }: SearchFilterSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="정렬 및 필터"
      maxHeight="90%"
      footer={
        <div className="flex gap-3 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              // TODO: 초기화 로직
            }}
            className="flex-1 h-[48px] text-sm font-bold text-gray-900 border border-gray-100 rounded-xl"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={() => {
              // TODO: 결과보기 로직
              onClose();
            }}
            className="flex-[2] h-[48px] text-sm font-bold text-white bg-primary rounded-xl"
          >
            결과보기
          </button>
        </div>
      }
    >
      <div className="px-5 py-6">{/* TODO: 필터 옵션 내용 */}</div>
    </BottomSheet>
  );
}
