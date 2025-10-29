import { registerDecorator, ValidatorConstraint } from "class-validator";
import type { ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { AUTH_ERROR_MESSAGES } from "@apps/backend/modules/auth/constants/auth.constants";
import { BUSINESS_ERROR_MESSAGES } from "@apps/backend/modules/business/constants/business.contants";

/**
 * 사용자 ID 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidUserId", async: false })
export class IsValidUserIdConstraint implements ValidatorConstraintInterface {
  validate(userId: string): boolean {
    if (!userId || typeof userId !== "string") {
      return false;
    }

    // 최소 4자, 최대 20자
    if (userId.length < 4 || userId.length > 20) {
      return false;
    }

    // 영문, 숫자, 언더스코어만 허용
    const userIdPattern = /^[a-zA-Z0-9_]+$/;
    return userIdPattern.test(userId);
  }

  defaultMessage(): string {
    return AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT;
  }
}

/**
 * 비밀번호 정책 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidPassword", async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (!password || typeof password !== "string") {
      return false;
    }

    // 최소 8자
    if (password.length < 8) {
      return false;
    }

    // 영문 대소문자, 숫자, 특수문자 포함
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return passwordPattern.test(password);
  }

  defaultMessage(): string {
    return AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT;
  }
}

/**
 * 한국 휴대폰 번호 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidKoreanPhone", async: false })
export class IsValidKoreanPhoneConstraint implements ValidatorConstraintInterface {
  validate(phone: string): boolean {
    if (!phone || typeof phone !== "string") {
      return false;
    }

    // 하이픈 제거
    const normalizedPhone = phone.replace(/[-\s]/g, "");

    // 한국 휴대폰 번호 패턴: 010, 011, 016, 017, 018, 019로 시작하는 11자리
    const phonePattern = /^01[0-9]\d{7,8}$/;
    return phonePattern.test(normalizedPhone);
  }

  defaultMessage(): string {
    return AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT;
  }
}

/**
 * 인증번호 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidVerificationCode", async: false })
export class IsValidVerificationCodeConstraint implements ValidatorConstraintInterface {
  validate(verificationCode: string): boolean {
    if (!verificationCode || typeof verificationCode !== "string") {
      return false;
    }

    // 정확히 6자리 숫자
    const verificationCodePattern = /^\d{6}$/;
    return verificationCodePattern.test(verificationCode);
  }

  defaultMessage(): string {
    return AUTH_ERROR_MESSAGES.VERIFICATION_CODE_INVALID_FORMAT;
  }
}

/**
 * 사업자등록번호 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidBusinessRegistrationNumber", async: false })
export class IsValidBusinessRegistrationNumberConstraint implements ValidatorConstraintInterface {
  validate(businessNumber: string): boolean {
    if (!businessNumber || typeof businessNumber !== "string") {
      return false;
    }

    // 하이픈 제거
    const normalizedNumber = businessNumber.replace(/[-\s]/g, "");

    // 10자리 숫자인지 확인
    if (normalizedNumber.length !== 10 || !/^\d{10}$/.test(normalizedNumber)) {
      return false;
    }

    // 사업자등록번호 체크섬 검증
    const digits = normalizedNumber.split("").map(Number);
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * weights[i];
    }
    
    sum += Math.floor((digits[8] * 5) / 10);
    const remainder = sum % 10;
    const checkDigit = remainder === 0 ? 0 : 10 - remainder;
    
    return checkDigit === digits[9];
  }

  defaultMessage(): string {
    return BUSINESS_ERROR_MESSAGES.BUSINESS_REGISTRATION_NUMBER_INVALID_FORMAT;
  }
}

/**
 * 개업일자 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidOpeningDate", async: false })
export class IsValidOpeningDateConstraint implements ValidatorConstraintInterface {
  validate(date: string): boolean {
    if (!date || typeof date !== "string") {
      return false;
    }

    // YYYYMMDD 형식인지 확인
    const datePattern = /^\d{8}$/;
    if (!datePattern.test(date)) {
      return false;
    }

    // 실제 날짜인지 확인
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6));
    const day = parseInt(date.substring(6, 8));

    if (year < 1900 || year > new Date().getFullYear()) {
      return false;
    }

    if (month < 1 || month > 12) {
      return false;
    }

    if (day < 1 || day > 31) {
      return false;
    }

    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getDate() === day
    );
  }

  defaultMessage(): string {
    return BUSINESS_ERROR_MESSAGES.OPENING_DATE_INVALID_FORMAT;
  }
}

/**
 * 사용자 ID 유효성 검증 데코레이터
 */
export function IsValidUserId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUserIdConstraint,
    });
  };
}

/**
 * 비밀번호 정책 유효성 검증 데코레이터
 */
export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordConstraint,
    });
  };
}

/**
 * 한국 휴대폰 번호 유효성 검증 데코레이터
 */
export function IsValidKoreanPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidKoreanPhoneConstraint,
    });
  };
}

/**
 * 인증번호 유효성 검증 데코레이터
 */
export function IsValidVerificationCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidVerificationCodeConstraint,
    });
  };
}

/**
 * 사업자등록번호 유효성 검증 데코레이터
 */
export function IsValidBusinessRegistrationNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidBusinessRegistrationNumberConstraint,
    });
  };
}

/**
 * 개업일자 유효성 검증 데코레이터
 */
export function IsValidOpeningDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidOpeningDateConstraint,
    });
  };
}
