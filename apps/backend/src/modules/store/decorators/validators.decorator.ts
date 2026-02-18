import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
} from "class-validator";

/**
 * 스토어 로고 이미지 URL 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidLogoImageUrl", async: false })
export class IsValidLogoImageUrlConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(logoImageUrl: string | undefined): boolean {
    // 선택 필드이므로 값이 없으면 통과
    if (!logoImageUrl) {
      this.errorType = "";
      return true;
    }

    const trimmed = logoImageUrl.trim();

    // URL 형식 검증 (http:// 또는 https://로 시작)
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(trimmed)) {
      this.errorType = "URL형식오류";
      return false;
    }

    // 허용된 이미지 확장자 검증 (.jpg, .png, .webp)
    const allowedExtensions = [".jpg", ".png", ".webp"];
    const urlLower = trimmed.toLowerCase();

    // URL에서 확장자 추출 (쿼리 파라미터 이전까지)
    const urlWithoutQuery = urlLower.split("?")[0];
    const lastDotIndex = urlWithoutQuery.lastIndexOf(".");
    if (lastDotIndex === -1 || lastDotIndex === urlWithoutQuery.length - 1) {
      this.errorType = "확장자없음";
      return false;
    }

    const extension = urlWithoutQuery.substring(lastDotIndex);
    if (!allowedExtensions.includes(extension)) {
      this.errorType = "확장자오류";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "URL형식오류") {
      return "올바른 이미지 URL 형식이 아닙니다.";
    }
    if (this.errorType === "확장자없음") {
      return "이미지 파일 확장자가 필요합니다.";
    }
    if (this.errorType === "확장자오류") {
      return "jpg, png, webp 형식의 이미지만 사용할 수 있습니다.";
    }
    return "올바른 이미지 URL 형식이 아닙니다.";
  }
}

/**
 * 스토어 이름 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidStoreName", async: false })
export class IsValidStoreNameConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(storeName: string): boolean {
    const STORE_NAME_PATTERN = /^[가-힣a-zA-Z0-9\s]+$/; // 스토어 이름 허용 문자: 한글, 영문, 숫자, 공백

    if (!storeName || !storeName.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmed = storeName.trim();

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

    // 허용된 문자 패턴 체크 (한글, 영문, 숫자, 공백만 허용)
    if (!STORE_NAME_PATTERN.test(trimmed)) {
      this.errorType = "특수문자";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "스토어 이름을 입력해주세요.";
    }
    if (this.errorType === "2자미만") {
      return "스토어 이름을 2자 이상 입력해주세요.";
    }
    if (this.errorType === "30자초과") {
      return "스토어 이름은 30자 이하여야 합니다.";
    }
    if (this.errorType === "특수문자") {
      return "스토어 이름은 한글, 영문, 숫자만 사용할 수 있습니다.";
    }
    return "스토어 이름을 입력해주세요.";
  }
}

/**
 * 스토어 설명 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidStoreDescription", async: false })
export class IsValidStoreDescriptionConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(description: string | undefined): boolean {
    // 선택 필드이므로 값이 없으면 통과
    if (!description) {
      this.errorType = "";
      return true;
    }

    // 500자 초과 체크
    if (description.length > 500) {
      this.errorType = "500자초과";
      return false;
    }

    // HTML 태그 검증 (< > 태그가 포함되어 있는지 확인)
    const htmlTagPattern = /<[^>]*>/;
    if (htmlTagPattern.test(description)) {
      this.errorType = "HTML태그";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "500자초과") {
      return "스토어 설명은 500자 이하로 입력해주세요.";
    }
    if (this.errorType === "HTML태그") {
      return "스토어 설명에는 HTML 태그를 사용할 수 없습니다.";
    }
    return "스토어 설명을 확인해주세요.";
  }
}

/**
 * 상세주소 유효성 검증 제약 조건
 */
@ValidatorConstraint({ name: "isValidDetailAddress", async: false })
export class IsValidDetailAddressConstraint implements ValidatorConstraintInterface {
  private errorType: string = "";

  validate(detailAddress: string): boolean {
    // 미입력 검증
    if (!detailAddress || !detailAddress.trim()) {
      this.errorType = "미입력";
      return false;
    }

    const trimmedAddress = detailAddress.trim();

    // 2자 미만 검증
    if (trimmedAddress.length < 2) {
      this.errorType = "2자미만";
      return false;
    }

    // 1000자 초과 검증
    if (trimmedAddress.length > 1000) {
      this.errorType = "1000자초과";
      return false;
    }

    this.errorType = "";
    return true;
  }

  defaultMessage(): string {
    if (this.errorType === "미입력") {
      return "상세주소를 입력해주세요.";
    }
    if (this.errorType === "2자미만") {
      return "상세주소를 2자 이상 입력해주세요.";
    }
    if (this.errorType === "1000자초과") {
      return "상세주소는 1000자 이하여야 합니다.";
    }
    return "상세주소를 입력해주세요.";
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
 * 스토어 로고 이미지 URL 유효성 검증 데코레이터
 */
export function IsValidLogoImageUrl(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidLogoImageUrlConstraint(), validationOptions);
}

/**
 * 스토어 이름 유효성 검증 데코레이터
 */
export function IsValidStoreName(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidStoreNameConstraint(), validationOptions);
}

/**
 * 스토어 설명 유효성 검증 데코레이터
 */
export function IsValidStoreDescription(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidStoreDescriptionConstraint(), validationOptions);
}

/**
 * 상세주소 유효성 검증 데코레이터
 */
export function IsValidDetailAddress(validationOptions?: ValidationOptions) {
  return createValidatorDecorator(new IsValidDetailAddressConstraint(), validationOptions);
}
