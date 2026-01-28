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

// TODO: 개발용 임시 토큰 (나중에 삭제)
const DEV_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWt3anAyZWwwMDAzN2lhdjY1ZXcxeTlzIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc2OTUxNTMwMCwiZXhwIjoxNzc3MjkxMzAwfQ.4tB8pQJmThFXDucWNlS4ZFVOHRtIhPh5TsKviQtgC8Y";

// 요청 인터셉터 - Authorization 헤더 추가 (나중에 삭제)
userClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (DEV_ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_ACCESS_TOKEN}`;
  }
  return config;
});

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
