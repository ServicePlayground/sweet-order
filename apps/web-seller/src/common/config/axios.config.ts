import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { redirectToLoginWithCurrentUrl } from "@/apps/web-seller/common/utils/returnUrl.util";
import { getAccessToken, removeAccessToken } from "@/apps/web-seller/common/utils/token.util";

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_DOMAIN;

const axiosConfig = {
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};

// seller API 클라이언트
export const sellerClient = axios.create({ ...axiosConfig, baseURL: `${API_BASE_URL}/v1/seller` });

// user API 클라이언트
export const userClient = axios.create({ ...axiosConfig, baseURL: `${API_BASE_URL}/v1/user` });

// 공통 요청 인터셉터 - Authorization 헤더 추가
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// 공통 응답 인터셉터 - 401 에러 처리
const responseErrorHandler = async (error: AxiosError<any>) => {
  const status = error.response?.status;
  const message = error.response?.data?.data?.message;

  // 401 && ACCESS_TOKEN_INVALID 오류 처리
  if (status === 401 && message?.includes("ACCESS_TOKEN_INVALID")) {
    removeAccessToken();
    redirectToLoginWithCurrentUrl();
    return Promise.resolve();
  }

  return Promise.reject(error);
};

// seller API 인터셉터 설정
sellerClient.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
sellerClient.interceptors.response.use((response: AxiosResponse) => response, responseErrorHandler);

// user API 인터셉터 설정
userClient.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
userClient.interceptors.response.use((response: AxiosResponse) => response, responseErrorHandler);
