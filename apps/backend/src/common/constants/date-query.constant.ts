/**
 * API 쿼리·본문에서 사용하는 달력 날짜 문자열 (YYYY-MM-DD)
 * Asia/Seoul 등 타임존 해석은 서비스 레이어에서 처리합니다.
 */
export const YMD_DATE_STRING_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** `@IsYmdDateString()` 기본 검증 메시지 (`validationOptions.message`로 덮어쓸 수 있음) */
export const YMD_DATE_STRING_DEFAULT_MESSAGE = "YYYY-MM-DD 형식이어야 합니다.";
