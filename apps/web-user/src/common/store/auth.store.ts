"use client";

import { useState, useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  // 상태
  isAuthenticated: boolean;
  accessToken: string | null;

  // 액션
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "sweet-order:auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    },
  ),
);

// persist hydration 완료 여부를 별도로 관리
export const useAuthHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // 이미 hydration이 끝난 경우
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  return hasHydrated;
};
