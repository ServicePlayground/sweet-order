"use client";

import { create } from "zustand";
import { iconTypes } from "@/apps/web-user/common/components/icons";

/**
 * 페이지 이동 직후 표시할 토스트 메시지
 * - 다른 페이지로 라우팅한 뒤 도착지에서 한 번 보여줘야 하는 케이스에 사용
 *   (예: 취소 페이지 → 상세 페이지로 복귀하면서 "취소완료" 토스트)
 */
export interface PendingToast {
  message: string;
  iconName?: keyof typeof iconTypes;
  iconClassName?: string;
  variant?: "row" | "column";
  position?: "bottom" | "center";
  duration?: number;
}

interface PendingToastStore {
  toast: PendingToast | null;
  /** 다음 페이지에서 보여줄 토스트 예약 */
  setPendingToast: (toast: PendingToast) => void;
  /** 토스트를 가져오면서 동시에 비움 (1회용) */
  consumePendingToast: () => PendingToast | null;
}

export const usePendingToastStore = create<PendingToastStore>((set, get) => ({
  toast: null,
  setPendingToast: (toast) => set({ toast }),
  consumePendingToast: () => {
    const current = get().toast;
    if (current) {
      set({ toast: null });
    }
    return current;
  },
}));
