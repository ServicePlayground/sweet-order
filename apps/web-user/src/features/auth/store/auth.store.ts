import { create } from "zustand";
import { UserInfo } from "@/apps/web-user/features/auth/types/auth.type";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { handleReturnUrlRedirect } from "@/apps/web-user/common/utils/returnUrl.util";

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;

  // 액션
  setInitialized: (value: boolean) => void;
  login: (user: UserInfo, router?: any) => void;
  logout: (router?: any) => void;
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
  login: (user, router) => {
    set({
      isAuthenticated: true,
      user,
    });

    // returnUrl이 있으면 해당 URL로, 없으면 홈으로 이동
    if (router) {
      const urlParams = new URLSearchParams(window.location.search);
      handleReturnUrlRedirect(urlParams, PATHS.HOME, router);
    }
  },

  // 로그아웃
  logout: (router) => {
    set({
      isAuthenticated: false,
      user: null,
    });
    router && router.push(PATHS.AUTH.LOGIN);
  },
}));
