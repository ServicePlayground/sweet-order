"use client";

import { create } from "zustand";

export type AlertType = "error" | "success" | "warning" | "info";

export interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
}

interface AlertStore {
  alert: AlertState;
  showAlert: (alert: Omit<AlertState, "isOpen">) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alert: {
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  },

  showAlert: (alert) => {
    set({
      alert: {
        ...alert,
        isOpen: true,
      },
    });
  },

  hideAlert: () => {
    set((state) => ({
      alert: {
        ...state.alert,
        isOpen: false,
      },
    }));
  },
}));
