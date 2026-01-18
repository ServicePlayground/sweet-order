import { create } from "zustand";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import {
  setAccessToken as setTokenToStorage,
  removeAccessToken,
  getAccessToken,
} from "@/apps/web-seller/common/utils/token.util";
import { getReturnUrlFromParams } from "@/apps/web-seller/common/utils/returnUrl.util";

interface AuthState {
  // 상태
  isInitialized: boolean;
  isAuthenticated: boolean;

  // 액션
  setInitialized: (value: boolean) => void;
  login: ({navigate, accessToken}: {navigate?: any, accessToken?: string}) => void;
  logout: (navigate?: any) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // 초기 상태
  isInitialized: false,
  isAuthenticated: false,

  // 초기화 플래그 설정
  setInitialized: (value: boolean) =>
    set({
      isInitialized: value,
    }),

  // 로그인 (localStorage에만 토큰 저장)
  login: ({navigate, accessToken}: {navigate?: any, accessToken?: string}) => {
    set({ isAuthenticated: true, isInitialized: true });
    if (accessToken) {
      setTokenToStorage(accessToken);
    }
    
    // returnUrl이나 state 파라미터가 있으면 해당 페이지로 이동, 없으면 루트로 이동
    if (navigate && typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl = getReturnUrlFromParams(searchParams);
      
      if (returnUrl) {
        const decodedUrl = decodeURIComponent(returnUrl);
        // 전체 URL인 경우 pathname만 추출
        try {
          const url = new URL(decodedUrl);
          navigate(url.pathname + url.search);
        } catch {
          // 상대 경로인 경우 그대로 사용
          navigate(decodedUrl);
        }
      } else {
        // returnUrl이 없으면 루트 페이지로 이동
        navigate(ROUTES.ROOT);
      }
    }
  },

  // 로그아웃 (localStorage에서 토큰 제거)
  logout: (navigate) => {
    removeAccessToken();
    set({ isAuthenticated: false, isInitialized: false });
    // 로그인 페이지로 이동
    if (navigate) {
      navigate(ROUTES.AUTH.LOGIN);
    }
  },    
}));
