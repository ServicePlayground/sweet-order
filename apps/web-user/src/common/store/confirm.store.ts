"use client";

import { create } from "zustand";

export interface ConfirmState {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ConfirmStore {
  confirm: ConfirmState;
  showConfirm: (confirm: Omit<ConfirmState, "isOpen">) => void;
  hideConfirm: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  confirm: {
    isOpen: false,
    title: "",
    message: "",
  },

  showConfirm: (confirm) => {
    set({
      confirm: {
        ...confirm,
        isOpen: true,
      },
    });
  },

  hideConfirm: () => {
    set((state) => ({
      confirm: {
        ...state.confirm,
        isOpen: false,
      },
    }));
  },
}));
