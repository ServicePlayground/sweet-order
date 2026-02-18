import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from "class-validator";

/**
 * 사업자등록번호 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidBusinessNo", async: false })
export class IsValidBusinessNoConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(businessNo: string): boolean {
    const BUSINESS_NO_PATTERN = /^\d{10}$/; // 사업자등록번호: 10자리 숫자

    if (!businessNo || !businessNo.trim()) {
      this.errorType = "미입력";
      return false;
    }

    // 숫자가 아닌 문자가 포함되어 있는지 확인
    if (!/^\d+$/.test(businessNo)) {
      this.errorType = "숫자만";
      return false;
    }

    // 자리 수 확인 (패턴 사용)
    if (!BUSINESS_NO_PATTERN.test(businessNo)) {
      this.errorType = "자리수부족";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "사업자등록번호를 입력해주세요.";
    }
    if (this.errorType === "숫자만") {
      return "숫자만 입력 가능합니다.";
    }
    if (this.errorType === "자리수부족") {
      return "사업자 등록번호는 10자리 숫자로 입력해주세요.";
    }
    return "사업자등록번호를 입력해주세요.";
  }
}

/**
 * 대표자명 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidRepresentativeName", async: false })
export class IsValidRepresentativeNameConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(representativeName: string): boolean {
    const REPRESENTATIVE_NAME_PATTERN = /^[가-힣\s()&.,-]+$/; // 대표자명 허용 문자: 한글, 공백, 괄호(), &, ., ,, -

    if (!representativeName || !representativeName.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmed = representativeName.trim();

    // 2자 미만 체크
    if (trimmed.length < 2) {
      this.errorType = "2자미만";
      return false;
    }

    // 30자 초과 체크
    if (trimmed.length > 30) {
      this.errorType = "30자초과";
      return false;
    }

    // 한글 포함 여부 체크 (숫자나 영어만으로 구성된 경우 방지)
    if (!/[가-힣]/.test(trimmed)) {
      this.errorType = "한글미포함";
      return false;
    }

    // 허용된 문자 패턴 체크 (한글, 공백, 괄호(), &, ., ,, -)
    if (!REPRESENTATIVE_NAME_PATTERN.test(trimmed)) {
      this.errorType = "특수문자";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "대표자명을 입력해주세요.";
    }
    if (this.errorType === "2자미만") {
      return "2자 이상 입력해주세요.";
    }
    if (this.errorType === "30자초과") {
      return "30자 이하로 입력해주세요.";
    }
    if (this.errorType === "한글미포함") {
      return "한글을 포함해서 입력해주세요.";
    }
    if (this.errorType === "특수문자") {
      return "특수문자, 이모지는 입력할 수 없습니다.";
    }
    return "대표자명을 입력해주세요.";
  }
}

/**
 * 개업일 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidStartDate", async: false })
export class IsValidStartDateConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(startDate: string): boolean {
    const START_DATE_PATTERN = /^\d{8}$/; // 개업일: YYYYMMDD 8자리 숫자

    if (!startDate || !startDate.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmed = startDate.trim();

    // 형식 체크 (8자리 숫자)
    if (!START_DATE_PATTERN.test(trimmed)) {
      this.errorType = "형식오류";
      return false;
    }

    // 날짜 파싱
    const year = parseInt(trimmed.substring(0, 4), 10);
    const month = parseInt(trimmed.substring(4, 6), 10);
    const day = parseInt(trimmed.substring(6, 8), 10);

    // 1900년 이전 체크
    if (year < 1900) {
      this.errorType = "1900년이전";
      return false;
    }

    // 날짜 유효성 체크
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      this.errorType = "유효하지않은날짜";
      return false;
    }

    // 미래 날짜 체크
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      this.errorType = "미래날짜";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "개업일을 입력해주세요.";
    }
    if (this.errorType === "형식오류") {
      return "YYYYMMDD 형식으로 입력해주세요.";
    }
    if (this.errorType === "1900년이전") {
      return "1900년 이후 날짜를 입력해주세요.";
    }
    if (this.errorType === "유효하지않은날짜") {
      return "유효하지 않은 날짜입니다. 다시 확인해주세요.";
    }
    if (this.errorType === "미래날짜") {
      return "개업일은 오늘 이후 날짜로 입력할 수 없습니다.";
    }
    return "개업일을 입력해주세요.";
  }
}

/**
 * 상호 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidBusinessName", async: false })
export class IsValidBusinessNameConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(businessName: string): boolean {
    if (!businessName || !businessName.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmed = businessName.trim();

    // 2자 미만 체크
    if (trimmed.length < 2) {
      this.errorType = "2자미만";
      return false;
    }

    // 50자 초과 체크
    if (trimmed.length > 50) {
      this.errorType = "50자초과";
      return false;
    }

    // 의미 없는 반복 문자 체크 (같은 문자가 3번 이상 연속 반복)
    if (/(.)\1{2,}/.test(trimmed)) {
      this.errorType = "반복문자";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "상호를 입력해주세요.";
    }
    if (this.errorType === "2자미만") {
      return "상호는 2자 이상 입력해주세요.";
    }
    if (this.errorType === "50자초과") {
      return "상호는 50자 이하로 입력해주세요.";
    }
    if (this.errorType === "반복문자") {
      return "의미 없는 반복 문자는 입력할 수 없습니다.";
    }
    return "상호를 입력해주세요.";
  }
}

/**
 * 업태 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidBusinessSector", async: false })
export class IsValidBusinessSectorConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(businessSector: string): boolean {
    if (!businessSector || !businessSector.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmed = businessSector.trim();

    // 2자 미만 체크
    if (trimmed.length < 2) {
      this.errorType = "2자미만";
      return false;
    }

    // 50자 초과 체크
    if (trimmed.length > 50) {
      this.errorType = "50자초과";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "업태를 입력해주세요.";
    }
    if (this.errorType === "2자미만") {
      return "업태는 2자 이상 입력해주세요.";
    }
    if (this.errorType === "50자초과") {
      return "업태는 50자 이하로 입력해주세요.";
    }
    return "업태를 입력해주세요.";
  }
}

/**
 * 종목 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidBusinessType", async: false })
export class IsValidBusinessTypeConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(businessType: string): boolean {
    if (!businessType || !businessType.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmed = businessType.trim();

    // 2자 미만 체크
    if (trimmed.length < 2) {
      this.errorType = "2자미만";
      return false;
    }

    // 50자 초과 체크
    if (trimmed.length > 50) {
      this.errorType = "50자초과";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "종목을 입력해주세요.";
    }
    if (this.errorType === "2자미만") {
      return "종목은 2자 이상 입력해주세요.";
    }
    if (this.errorType === "50자초과") {
      return "종목은 50자 이하로 입력해주세요.";
    }
    return "종목을 입력해주세요.";
  }
}

/**
 * 인허가관리번호 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidPermissionManagementNumber", async: false })
export class IsValidPermissionManagementNumberConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(prmmiMnno: string): boolean {
    const PERMISSION_MANAGEMENT_NUMBER_PATTERN = /^\d{4}-[가-힣]+-\d{4}$/; // 인허가관리번호: YYYY-한글지역명-숫자4자리

    if (!prmmiMnno || !prmmiMnno.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmed = prmmiMnno.trim();

    // 인허가관리번호 형식: YYYY-한글지역명-숫자4자리
    if (!PERMISSION_MANAGEMENT_NUMBER_PATTERN.test(trimmed)) {
      this.errorType = "형식오류";
      return false;
    }

    // 연도 검증 (1900년부터 현재 연도까지)
    const parts = trimmed.split("-");
    if (parts.length !== 3) {
      this.errorType = "형식오류";
      return false;
    }

    const year = parseInt(parts[0], 10);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {
      this.errorType = "연도범위오류";
      return false;
    }

    // 지역명이 한글로만 이루어져 있는지 확인
    const regionName = parts[1];
    if (!/^[가-힣]+$/.test(regionName)) {
      this.errorType = "지역명오류";
      return false;
    }

    // 마지막 숫자 4자리 검증
    const number = parts[2];
    if (!/^\d{4}$/.test(number)) {
      this.errorType = "숫자4자리오류";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "인허가관리번호를 입력해주세요.";
    }
    if (this.errorType === "형식오류") {
      return "YYYY-한글지역명-숫자4자리 형식으로 입력해주세요. (예: 2021-서울강동-0422)";
    }
    if (this.errorType === "연도범위오류") {
      const currentYear = new Date().getFullYear();
      return `연도는 1900년부터 ${currentYear}년까지 입력 가능합니다.`;
    }
    if (this.errorType === "지역명오류") {
      return "지역명은 한글로만 입력해주세요.";
    }
    if (this.errorType === "숫자4자리오류") {
      return "마지막 숫자는 4자리로 입력해주세요.";
    }
    return "인허가관리번호는 YYYY-한글지역명-숫자4자리 형식이어야 합니다. (예: 2021-서울강동-0422)";
  }
}

/**
 * 공통 데코레이터 팩토리 함수
 */
function createValidatorDecorator(
  validator: ValidatorConstraintInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: validator,
    });
  };
}

/**
 * 사업자등록번호 유효성 검증 데코레이터
 */
export function IsValidBusinessNo(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidBusinessNoConstraint(), validationOptions);
}

/**
 * 대표자명 유효성 검증 데코레이터
 */
export function IsValidRepresentativeName(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidRepresentativeNameConstraint(), validationOptions);
}

/**
 * 개업일 유효성 검증 데코레이터
 */
export function IsValidStartDate(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidStartDateConstraint(), validationOptions);
}

/**
 * 상호 유효성 검증 데코레이터
 */
export function IsValidBusinessName(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidBusinessNameConstraint(), validationOptions);
}

/**
 * 업태 유효성 검증 데코레이터
 */
export function IsValidBusinessSector(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidBusinessSectorConstraint(), validationOptions);
}

/**
 * 종목 유효성 검증 데코레이터
 */
export function IsValidBusinessType(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidBusinessTypeConstraint(), validationOptions);
}

/**
 * 인허가관리번호 유효성 검증 데코레이터
 */
export function IsValidPermissionManagementNumber(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(
    new IsValidPermissionManagementNumberConstraint(),
    validationOptions,
  );
}
