"use client";

import { create } from "zustand";

interface UserCurrentLocationState {
  // 상태
  latitude: number | null;
  longitude: number | null;

  // 액션
  setLocation: (latitude: number, longitude: number) => void;
  clearLocation: () => void;
}

export const useUserCurrentLocationStore = create<UserCurrentLocationState>()((set) => ({
  // 초기 상태
  latitude: null,
  longitude: null,

  // 위치 설정
  setLocation: (latitude: number, longitude: number) => {
    set({
      latitude,
      longitude,
    });
  },

  // 위치 제거
  clearLocation: () => {
    set({
      latitude: null,
      longitude: null,
    });
  },
}));
