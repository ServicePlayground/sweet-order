import { create } from "zustand";
import { UserInfo } from "@/apps/web-seller/features/auth/types/auth.type";

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;

  // 액션
  setInitialized: (value: boolean) => void;
  login: (user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  // 초기 상태
  isInitialized: false,
  isAuthenticated: false,
  user: null,

  // 초기화 플래그 설정
  setInitialized: (value: boolean) =>
    set({
      isInitialized: value,
    }),

  // 로그인
  login: (user) =>
    set({
      isAuthenticated: true,
      user,
    }),

  // 로그아웃
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });

    const currentPath = window.location.pathname + window.location.search;
    const fullReturnUrl = window.location.origin + currentPath;
    const returnUrl = encodeURIComponent(fullReturnUrl);
    window.location.href = `${import.meta.env.VITE_PUBLIC_USER_DOMAIN}/login?returnUrl=${returnUrl}`;
  },
}));
