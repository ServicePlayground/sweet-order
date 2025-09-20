/**
 * API 관련 타입 정의
 *
 * API 응답과 관련된 모든 타입들을 중앙 집중식으로 관리합니다.
 */

import { HTTP_STATUS } from "@web-user/backend/common/constants/app.constants";

/**
 * API 응답 인터페이스
 *
 * 모든 API 응답의 표준 형식을 정의합니다.
 */
export interface ApiResponse<T = any> {
  /** 성공 여부 */
  success: boolean;
  /** 응답 데이터 */
  data?: T;
  /** 에러 정보 */
  error?: {
    /** 에러 메시지 */
    message: string;
    /** HTTP 상태 코드 */
    statusCode: number;
    /** 에러 발생 시간 */
    timestamp: string;
    /** 요청 경로 */
    path?: string;
    /** HTTP 메서드 */
    method?: string;
  };
}

/**
 * 성공 응답 인터페이스
 */
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
}

/**
 * 에러 응답 인터페이스
 */
export interface ErrorResponse extends ApiResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    method?: string;
  };
}

/*
 * HTTP 상태 코드 타입
 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
