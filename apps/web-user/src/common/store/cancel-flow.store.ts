"use client";

import { create } from "zustand";

/**
 * 취소 플로우의 다단계 페이지 간 임시 상태
 * - 결제 후 환불 요청은 1단계(사유 입력) → 2단계(환불 계좌 입력) 두 페이지로 나뉘어 있어서,
 *   1단계의 reason을 2단계로 전달하기 위해 사용
 * - 성공 제출 시 clear()로 비움
 */
interface CancelFlowStore {
  reason: string;
  setReason: (reason: string) => void;
  clear: () => void;
}

export const useCancelFlowStore = create<CancelFlowStore>((set) => ({
  reason: "",
  setReason: (reason) => set({ reason }),
  clear: () => set({ reason: "" }),
}));
