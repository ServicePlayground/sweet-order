"use client";

/**
 * 웹뷰(Flutter)와 통신하는 브릿지 유틸리티
 * 모든 웹뷰 통신 관련 코드는 이 파일에 위치합니다.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";

// 타입 정의
declare global {
  interface Window {
    Loginpage?: {
      postMessage: (message: string) => void;
    };
    Logout?: {
      postMessage: (message: string) => void;
    };
    Auth: {
      login: (accessToken: string) => void;
      logout: () => void;
    };
  }
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 로그인 페이지로 이동하는 웹뷰 통신 함수
 * Flutter 앱의 로그인 페이지로 이동하도록 메시지를 전송합니다.
 */
export function navigateToLoginPage(): void {
  if (typeof window === "undefined") {
    console.warn("웹뷰 브릿지는 브라우저 환경에서만 동작합니다.");
    return;
  }

  if (!window.Loginpage) {
    console.warn("Loginpage 브릿지가 초기화되지 않았습니다. Flutter 웹뷰 환경인지 확인해주세요.");
    return;
  }

  try {
    window.Loginpage.postMessage("true");
  } catch (error) {
    console.error("로그인 페이지 이동 중 오류가 발생했습니다:", error);
  }
}

/**
 * 로그아웃을 수행하는 웹뷰 통신 함수
 * Flutter 앱에 로그아웃 메시지를 전송합니다. Flutter 내에서 토큰을 제거합니다.
 */
export function logoutFromWebView(): void {
  if (typeof window === "undefined") {
    console.warn("웹뷰 브릿지는 브라우저 환경에서만 동작합니다.");
    return;
  }

  if (!window.Logout) {
    console.warn("logout 브릿지가 초기화되지 않았습니다. Flutter 웹뷰 환경인지 확인해주세요.");
    return;
  }

  try {
    window.Logout.postMessage("true");
  } catch (error) {
    console.error("로그아웃 중 오류가 발생했습니다:", error);
  }
}

/**
 * 웹뷰 환경인지 확인하는 함수
 */
export function isWebViewEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return typeof window.Loginpage !== "undefined";
}

// ============================================================================
// React 훅
// ============================================================================

/**
 * 웹뷰 브릿지 초기화 훅
 * Flutter 앱에서 window.Auth.login, window.Auth.logout을 호출할 수 있도록 등록합니다.
 * 이 훅은 앱 초기화 시 한 번 호출되어야 합니다.
 */
export function useWebViewBridge() {
  const { setAccessToken, clearAccessToken } = useAuthStore();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Flutter 앱에서 호출할 수 있도록 window.Auth 객체 초기화
    window.Auth = {
      login: (accessToken: string) => {
        if (!accessToken || typeof accessToken !== "string") {
          console.warn("유효하지 않은 토큰이 전달되었습니다.");
          return;
        }
        // 전역 상태(Zustand store)에 토큰 저장
        setAccessToken(accessToken);
      },
      logout: () => {
        // 전역 상태(Zustand store)에서 토큰 제거
        clearAccessToken();
      },
    };
  }, [setAccessToken, clearAccessToken]);
}
