/**
 * 사용 가능 여부 응답 인터페이스
 * 중복 확인 등의 API에서 사용 가능 여부를 반환할 때 사용
 */
export interface AvailabilityResponse {
  available: boolean;
}

/**
 * 에러 메시지 응답 인터페이스
 * 에러 응답에서 사용하는 메시지 구조
 */
export interface ErrorMessageResponse {
  /** 에러 메시지 (문자열 또는 객체) */
  message: string | object;
}
