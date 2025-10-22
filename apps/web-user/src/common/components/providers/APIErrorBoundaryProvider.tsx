"use client";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorInfo, useRef } from "react";
import { AxiosError } from "axios";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";

interface APIErrorBoundaryProviderProps {
  children: React.ReactNode;
}

export function APIErrorBoundaryProvider({ children }: APIErrorBoundaryProviderProps) {
  const { showAlert } = useAlertStore();
  const resetErrorBoundaryRef = useRef<(() => void) | null>(null);

  // AxiosError인지 확인하는 함수
  const isAxiosError = (error: Error): error is AxiosError => {
    return error.name === "AxiosError";
  };

  // API 에러 메시지 추출
  const getApiErrorMessage = (error: any) => {
    // response.data.data.message 구조에서 메시지 추출
    const apiMessage = error.response?.data?.data?.message;
    if (apiMessage) {
      return apiMessage;
    }

    // response.data.message 구조에서 메시지 추출
    const responseMessage = error.response?.data?.message;
    if (responseMessage) {
      return responseMessage;
    }

    // response.data에서 직접 메시지 추출
    const dataMessage = error.response?.data;
    if (typeof dataMessage === "string") {
      return dataMessage;
    }

    // status 코드에 따른 기본 메시지
    const status = error.status || error.response?.status;
    if (status === 401) {
      return "인증이 필요합니다. 다시 로그인해주세요.";
    } else if (status === 403) {
      return "접근 권한이 없습니다.";
    } else if (status === 404) {
      return "요청한 리소스를 찾을 수 없습니다.";
    } else if (status === 500) {
      return "서버 오류가 발생했습니다.";
    }

    // 기본 API 에러 메시지
    return `API 오류가 발생했습니다. (${status || "Unknown"})`;
  };

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // 에러 로깅 (추후 에러 모니터링 서비스 연동 가능)
    console.error("APIErrorBoundary caught an error:", error, errorInfo);

    // AxiosError인 경우에만 처리
    if (isAxiosError(error)) {
      showAlert({
        type: "error",
        title: "오류",
        message: getApiErrorMessage(error),
      });
    } else {
      // AxiosError가 아닌 경우 상위로 전파
      throw error;
    }
  };

  return (
    <ErrorBoundary
      onError={handleError}
      // AxiosError가 아닌 경우 상위로 전파
      fallbackRender={({ resetErrorBoundary }) => {
        // resetErrorBoundary 함수를 ref에 저장
        resetErrorBoundaryRef.current = resetErrorBoundary;
        // Alert이 표시되도록 children을 그대로 렌더링
        return children;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
