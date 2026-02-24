"use client";

import { create } from "zustand";

interface HeaderState {
  isHomeSearchVisible: boolean;
  setIsHomeSearchVisible: (visible: boolean) => void;
}

export const useHeaderStore = create<HeaderState>()((set) => ({
  isHomeSearchVisible: true,
  setIsHomeSearchVisible: (visible) => set({ isHomeSearchVisible: visible }),
}));
