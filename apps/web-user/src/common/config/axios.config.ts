import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { navigateToLoginPage } from "@/apps/web-user/common/utils/webview.bridge";

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

      // Flutter 앱의 로그인 페이지로 이동
      navigateToLoginPage();
    }

    return Promise.reject(error);
  },
);
