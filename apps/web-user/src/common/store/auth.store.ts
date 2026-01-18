"use client";

import { create } from "zustand";

interface AuthState {
  // 상태
  isAuthenticated: boolean;
  accessToken: string | null;

  // 액션
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // 초기 상태
  isAuthenticated: false,
  accessToken: null,

  // 토큰 설정 (Zustand 상태만 업데이트)
  setAccessToken: (token: string) => {
    set({
      accessToken: token,
      isAuthenticated: true,
    });
  },

  // 토큰 제거 (Zustand 상태만 초기화)
  clearAccessToken: () => {
    set({
      accessToken: null,
      isAuthenticated: false,
    });
  },

  // 현재 토큰 조회
  getAccessToken: () => {
    return get().accessToken;
  },
}));

