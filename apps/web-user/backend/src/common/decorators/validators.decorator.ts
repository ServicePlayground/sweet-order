import { registerDecorator, ValidatorConstraint } from "class-validator";
import type { ValidationOptions, ValidatorConstraintInterface } from "class-validator";

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
    return "아이디는 4-20자의 영문, 숫자, 언더스코어만 사용할 수 있습니다.";
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
    return "비밀번호는 8자 이상의 영문 대소문자, 숫자, 특수문자(@$!%*?&)를 포함해야 합니다.";
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
    return "올바른 한국 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)";
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
