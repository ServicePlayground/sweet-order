/**
 * API 응답 인터페이스
 * 모든 API 응답의 표준 형식을 정의합니다.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    method?: string;
  };
}

/**
 * 성공 응답 인터페이스
 */
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
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
