"use client";

/**
 * 웹뷰(Flutter)와 통신하는 브릿지 유틸리티
 * 모든 웹뷰 통신 관련 코드는 이 파일에 위치합니다.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";

// 타입 정의
declare global {
  interface Window {
    // 웹뷰 -> Flutter
    Loginpage: {
      postMessage: (message: string) => void;
    };
    Logout: {
      postMessage: (message: string) => void;
    };
    mylocation: {
      postMessage: (message: string) => void;
    };

    // Flutter -> 웹뷰
    Auth: {
      login: (accessToken: string) => void;
      logout: () => void;
    };
    receiveLocation: (latitude: string | number, longitude: string | number) => void;
  }
}

// ============================================================================
// 웹뷰 -> Flutter
// ============================================================================

/**
 * 로그인 페이지로 이동하는 웹뷰 통신 함수
 * Flutter 앱의 로그인 페이지로 이동하도록 메시지를 전송합니다.
 */
export function navigateToLoginPage(): void {
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
  try {
    window.Logout.postMessage("true");
  } catch (error) {
    console.error("로그아웃 중 오류가 발생했습니다:", error);
  }
}

/**
 * 앱에서 위치 정보를 요청하는 웹뷰 통신 함수
 * Flutter 앱에 위치 정보 요청 메시지를 전송합니다.
 * 앱에서 위치 정보를 받으면 window.receiveLocation 함수가 호출됩니다.
 */
export function requestLocationFromWebView(): void {
  try {
    window.mylocation.postMessage("true");
  } catch (error) {
    console.error("위치 정보 요청 중 오류가 발생했습니다:", error);
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
// Flutter -> 웹뷰
// ============================================================================

/**
 * 웹뷰 브릿지 초기화 훅
 * Flutter 앱에서 window.Auth.login, window.Auth.logout, window.receiveLocation을 호출할 수 있도록 등록합니다.
 * 이 훅은 앱 초기화 시 한 번 호출되어야 합니다.
 */
export function useWebViewBridge() {
  const { setAccessToken, clearAccessToken } = useAuthStore();
  const { setLocation } = useUserCurrentLocationStore();

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

    // Flutter 앱에서 호출할 수 있도록 window.receiveLocation 함수 초기화
    window.receiveLocation = (latitude: string | number, longitude: string | number) => {
      // string이면 number로 변환
      const latNumber = typeof latitude === "string" ? parseFloat(latitude) : latitude;
      const lngNumber = typeof longitude === "string" ? parseFloat(longitude) : longitude;

      // 전역 상태(Zustand store)에 위치 정보 저장
      setLocation(latNumber, lngNumber);
    };
  }, [setAccessToken, clearAccessToken, setLocation]);
}
