"use client";

/**
 * 웹뷰(Flutter)와 통신하는 브릿지 유틸리티
 * 모든 웹뷰 통신 관련 코드는 이 파일에 위치합니다.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { useUserCurrentLocationStore } from "@/apps/web-user/common/store/user-current-location.store";
import { reverseGeocode } from "@/apps/web-user/common/utils/kakao-geocode.util";
import { useRemoveConsumerFcmToken } from "@/apps/web-user/features/fcm/hooks/mutations/useRemoveConsumerFcmToken";
import { useUpsertConsumerFcmToken } from "@/apps/web-user/features/fcm/hooks/mutations/useUpsertConsumerFcmToken";
import type { FcmToken } from "@/apps/web-user/features/fcm/types/fcm.type";

// 타입 정의
declare global {
  interface Window {
    // 웹뷰 -> Flutter
    mylocation: {
      postMessage: (message: string) => void;
    };
    requestFcmTokenUpsert: {
      postMessage: (message: string) => void;
    };
    requestFcmTokenRemove: {
      postMessage: (message: string) => void;
    };

    // Flutter -> 웹뷰
    receiveLocation: (latitude: string | number, longitude: string | number) => void;
    FcmToken: {
      upsert: (fcmToken: FcmToken) => void;
      remove: (fcmToken: Omit<FcmToken, "token">) => void;
    };
  }
}

// ============================================================================
// 웹뷰 -> Flutter
// ============================================================================

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

export function requestFcmTokenUpsert(): void {
  try {
    window.requestFcmTokenUpsert.postMessage("true");
  } catch (error) {
    console.error("FCM 토큰 업데이트 중 오류가 발생했습니다:", error);
  }
}

export function requestFcmTokenRemove(): void {
  try {
    window.requestFcmTokenRemove.postMessage("true");
  } catch (error) {
    console.error("FCM 토큰 삭제 중 오류가 발생했습니다:", error);
  }
}

/**
 * 웹뷰 환경인지 확인하는 함수
 * (Flutter에서 주입하는 mylocation 브릿지 존재 여부)
 */
export function isWebViewEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return typeof window.mylocation !== "undefined";
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
  const { login, handleLogoutByEnvironment } = useAuthStore();
  const { setLocation, setAddress } = useUserCurrentLocationStore();
  const { mutate: upsertConsumerFcmToken } = useUpsertConsumerFcmToken();
  const { mutate: removeConsumerFcmToken } = useRemoveConsumerFcmToken();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Flutter 앱에서 호출할 수 있도록 window.receiveLocation 함수 초기화
    window.receiveLocation = (latitude: string | number, longitude: string | number) => {
      // string이면 number로 변환
      const latNumber = typeof latitude === "string" ? parseFloat(latitude) : latitude;
      const lngNumber = typeof longitude === "string" ? parseFloat(longitude) : longitude;

      // 전역 상태(Zustand store)에 위치 정보 저장
      setLocation(latNumber, lngNumber);

      // 역지오코딩으로 주소 변환
      reverseGeocode(latNumber, lngNumber).then((result) => {
        if (result) setAddress(result);
      });
    };

    // Flutter 앱에서 호출할 수 있도록 window.FcmToken 객체 초기화
    window.FcmToken = {
      upsert: ({ token, deviceId }: FcmToken) => {
        if (!token || typeof token !== "string" || !deviceId || typeof deviceId !== "string") {
          console.warn("유효하지 않은 FCM 토큰 또는 디바이스 ID가 전달되었습니다.");
          return;
        }
        const normalizedToken = token.trim();
        const normalizedDeviceId = deviceId.trim();
        if (!normalizedToken || !normalizedDeviceId) {
          console.warn("유효하지 않은 FCM 토큰 또는 디바이스 ID가 전달되었습니다.");
          return;
        }

        upsertConsumerFcmToken({ token: normalizedToken, deviceId: normalizedDeviceId });
      },
      remove: ({ deviceId }: Omit<FcmToken, "token">) => {
        if (!deviceId || typeof deviceId !== "string") {
          console.warn("유효하지 않은 디바이스 ID가 전달되었습니다.");
          return;
        }
        const normalizedDeviceId = deviceId.trim();
        if (!normalizedDeviceId) {
          console.warn("유효하지 않은 디바이스 ID가 전달되었습니다.");
          return;
        }
        removeConsumerFcmToken({ deviceId: normalizedDeviceId });
      },
    };

    // 환경에 따라 자동으로 위치 요청
    const hasStoredRegion = !!localStorage.getItem("picake:selected-region");

    if (isWebViewEnvironment()) {
      requestLocationFromWebView();
    } else if (!hasStoredRegion && navigator.geolocation) {
      // 저장된 지역이 없을 때만 GPS 권한 요청 (최초 진입)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude);
          reverseGeocode(latitude, longitude).then((result) => {
            if (result) setAddress(result);
          });
        },
        (error) => {
          console.error("브라우저 위치 정보 요청 실패:", error.message);
          // 위치 권한 거부 시 기본값: 강남구
          setAddress("서울특별시 강남구");
        },
      );
    }
  }, [
    login,
    handleLogoutByEnvironment,
    setLocation,
    setAddress,
    upsertConsumerFcmToken,
    removeConsumerFcmToken,
  ]);
}

// ============================================================================
// 외부 앱 유도용 커스텀 스키마 URL
// ============================================================================

/**
 * Flutter에서 커스텀 스키마로 가로채 외부 앱(지도 등)으로 유도하기 위한 URL prefix
 */
export const EXTERNAL_APP_SCHEME_PREFIX = "apps://";

/**
 * 외부 앱 유도용 커스텀 스키마 URL로 래핑합니다.
 * 예) https://example.com -> apps://https://example.com
 */
export function toExternalAppSchemeUrl(webUrl: string): string {
  return `${EXTERNAL_APP_SCHEME_PREFIX}${webUrl}`;
}
