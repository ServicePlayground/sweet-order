import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { logoutFromWebView } from "@/apps/web-user/common/utils/webview.bridge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN;

const axiosConfig = {
  baseURL: `${API_BASE_URL}/v1/user`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
};

// user API 클라이언트
export const userClient = axios.create({ ...axiosConfig, baseURL: `${API_BASE_URL}/v1/user` });

// 요청 인터셉터 - Authorization 헤더 추가
userClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand store에서 직접 토큰 조회
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ============================================================================
// TODO: 개발용 임시 토큰 삭제하기
// - 삭제 예정 (DEV_ACCESS_TOKEN, isWebViewEnvironment() 함께 삭제)
// - 웹 브라우저 환경에서만 사용, 웹뷰 환경에서는 사용 안 함
const DEV_ACCESS_TOKEN = process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN;
function isWebViewEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes("wv") || userAgent.includes("webview");
}

userClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // TODO: 개발용 임시 토큰 삭제하기
  if (DEV_ACCESS_TOKEN && !isWebViewEnvironment()) {
    config.headers.Authorization = `Bearer ${DEV_ACCESS_TOKEN}`;
  }
  return config;
});
// ============================================================================

// 응답 인터셉터
userClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.data?.message;

    // 401 && ACCESS_TOKEN_INVALID 오류 처리
    if (status === 401 && message?.includes("ACCESS_TOKEN_INVALID")) {
      // Zustand store에서 토큰 제거
      useAuthStore.getState().clearAccessToken();

      // Flutter 앱의 로그아웃 메시지를 전송합니다. Flutter 내에서 토큰을 제거합니다.
      logoutFromWebView();
    }

    return Promise.reject(error);
  },
);
