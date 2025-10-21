import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/apps/web-user/features/auth/store/auth.store";
import { QueryClient } from "@tanstack/react-query";
import { authApi } from "@/apps/web-user/features/auth/apis/auth.api";
import { authQueryKeys } from "@/apps/web-user/features/auth/constants/authQueryKeys.constant";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN;

let queryClient: QueryClient | null = null;
export const setQueryClient = (client: QueryClient) => {
  queryClient = client;
};

const axiosConfig = {
  baseURL: `${API_BASE_URL}/v1/user`,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};

// 1) 일반 API 클라이언트 (인터셉터 부착)
export const apiClient = axios.create(axiosConfig);

// 2) 인증 전용(리프레시/로그아웃) 클라이언트
// 인터셉터 무한루프 방지(동일한 인터셉터를 내부에서 또 호출한다.) 떄문에 따로 선언
export const authClient = axios.create(axiosConfig);

// 응답 인터셉터 (하나로 통합)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.data?.message;
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // a) error.config가 비어있는 케이스(그대로 전파)
    if (!originalRequest) return Promise.reject(error);

    // b) 401 → 한 번만 리프레시 시도 후 원래 요청 1회 재시도
    if (status === 401 && message?.includes("ACCESS_TOKEN_INVALID")) {
      if (originalRequest._retry) {
        // 이미 한 번 재시도한 요청이면 중단(그대로 전파)
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        // 리프레시: authClient로 호출(여기 인터셉터 호출되지 않음)
        await authApi.refresh(authClient);

        // 중복 호출 방지
        if (!originalRequest.url?.endsWith("/auth/me")) {
          // React Query 캐시 무효화 (자동으로 재요청됨 - useAuth.ts의 useMe 함수)
          if (queryClient) {
            queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
          }
        }

        // 리프레시 성공 → 원래 요청 1회만 재시도
        return apiClient(originalRequest);
      } catch (error) {
        // 리프레시 실패 → 즉시 로그아웃 처리 & 전파
        // 로그아웃: authClient로 호출(여기 인터셉터 호출되지 않음)
        await authApi.logout(authClient);
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    // c) 그 외 → 그대로 전파
    return Promise.reject(error);
  },
);
