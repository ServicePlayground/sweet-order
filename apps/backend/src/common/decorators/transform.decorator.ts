import { Transform } from "class-transformer";

/**
 * 문자열을 배열로 변환하는 Transform 데코레이터
 */

/**
 * 쉼표로 구분된 문자열을 배열로 변환합니다.
 *
 * 사용법:
 * - "ADULT,CHILD" → ["ADULT", "CHILD"]
 * - "" → []
 * - ["ADULT", "CHILD"] → ["ADULT", "CHILD"] (이미 배열인 경우)
 */
export function StringToArray() {
  return Transform(({ value }) => {
    if (typeof value === "string") {
      if (!value.trim()) return [];
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    if (Array.isArray(value)) return value;
    return [];
  });
}

/**
 * 쿼리 파라미터를 선택적 배열로 변환합니다.
 * 값이 없으면 undefined(필터 미적용), 단일 값이면 1개짜리 배열, 여러 값이면 배열 그대로 반환합니다.
 *
 * 사용법:
 * - undefined / null / "" → undefined
 * - "BIRTHDAY" → ["BIRTHDAY"]
 * - ["BIRTHDAY", "LOVER"] → ["BIRTHDAY", "LOVER"]
 */
export function OptionalStringToArray() {
  return Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    return Array.isArray(value) ? value : [value];
  });
}

/**
 * 문자열을 숫자로 변환하는 Transform 데코레이터
 *
 * 사용법:
 * - "123" → 123
 * - "0" → 0
 * - "" → NaN (validation에서 처리)
 */
export function StringToNumber() {
  return Transform(({ value }) => parseInt(value));
}

/**
 * 선택적 문자열을 숫자로 변환하는 Transform 데코레이터
 * 값이 없거나 빈 문자열인 경우 undefined를 반환합니다.
 *
 * 사용법:
 * - "123" → 123
 * - "" → undefined
 * - undefined → undefined
 */
export function OptionalStringToNumber() {
  return Transform(({ value }) => (value ? parseInt(value) : undefined));
}
