import axios, { AxiosError, AxiosResponse } from "axios";
import { createSellerToUserRedirectUrl } from "@/apps/web-seller/common/utils/returnUrl.util";

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

// user - auth API (logout, me) 클라이언트
export const userAuthClient = axios.create({ ...axiosConfig, baseURL: `${API_BASE_URL}/v1/user` });

// seller API 응답 인터셉터
sellerClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.data?.message;

    // a) 401 인증 실패 시 사용자 페이지로 리다이렉트 (현재 페이지 정보 포함)
    if (status === 401 && message?.includes("ACCESS_TOKEN_INVALID")) {
      const redirectUrl = createSellerToUserRedirectUrl(import.meta.env.VITE_PUBLIC_USER_DOMAIN);
      window.location.href = redirectUrl;
    }

    // b) 그 외 → 그대로 전파
    return Promise.reject(error);
  },
);

// user API 응답 인터셉터
userClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.data?.message;

    // a) 401 인증 실패 시 사용자 페이지로 리다이렉트 (현재 페이지 정보 포함)
    if (status === 401 && message?.includes("ACCESS_TOKEN_INVALID")) {
      const redirectUrl = createSellerToUserRedirectUrl(import.meta.env.VITE_PUBLIC_USER_DOMAIN);
      window.location.href = redirectUrl;
    }

    // b) 그 외 → 그대로 전파
    return Promise.reject(error);
  },
);

// user- auth API 응답 인터셉터 (반드시 인증 전용 클라이언트로 사용 - 오류가 발생하면 무조건 사용자 페이지로 리다이렉트하기 때문)
userAuthClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (/*error: AxiosError<any> */) => {
    // const status = error.response?.status;
    // const message = error.response?.data?.data?.message;

    // a) 401 인증 실패 시 사용자 페이지로 리다이렉트 (현재 페이지 정보 포함)
    // if (status === 401 && message?.includes("ACCESS_TOKEN_INVALID")) {
    //   const currentPath = window.location.pathname + window.location.search;
    //   const returnUrl = encodeURIComponent(currentPath);
    //   window.location.href = `${import.meta.env.VITE_PUBLIC_USER_DOMAIN}?returnUrl=${returnUrl}`;
    // }

    // b) 그 외 → 그대로 전파
    //return Promise.reject(error);

    const redirectUrl = createSellerToUserRedirectUrl(import.meta.env.VITE_PUBLIC_USER_DOMAIN);
    window.location.href = redirectUrl;
  },
);
