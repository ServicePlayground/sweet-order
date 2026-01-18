import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN;

const axiosConfig = {
  baseURL: `${API_BASE_URL}/v1/user`,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};

// 일반 API 클라이언트
export const apiClient = axios.create(axiosConfig);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    // 에러를 그대로 전파
    return Promise.reject(error);
  },
);
