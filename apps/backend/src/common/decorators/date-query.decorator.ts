import { Matches } from "class-validator";
import type { ValidationOptions } from "class-validator";
import {
  YMD_DATE_STRING_DEFAULT_MESSAGE,
  YMD_DATE_STRING_PATTERN,
} from "@apps/backend/common/constants/date-query.constant";

/**
 * YYYY-MM-DD 달력 날짜 문자열 검증 (`Matches` + 공통 패턴·메시지)
 *
 * 필요 시 필드별 문구는 `@IsYmdDateString({ message: '...' })` 로 지정합니다.
 * (`validators.decorator.ts`의 `IsValidUserId` 등과 동일하게 공통 검증을 한곳에 둡니다.)
 */
export function IsYmdDateString(validationOptions?: ValidationOptions) {
  return Matches(YMD_DATE_STRING_PATTERN, {
    ...validationOptions,
    message: validationOptions?.message ?? YMD_DATE_STRING_DEFAULT_MESSAGE,
  });
}
