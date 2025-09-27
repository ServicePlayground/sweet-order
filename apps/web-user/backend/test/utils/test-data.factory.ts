/**
 * 테스트 데이터 팩토리
 * 테스트에 사용할 다양한 데이터를 생성하는 유틸리티
 */

export class TestDataFactory {
  // 기본 테스트 사용자 데이터
  static createValidUser() {
    return {
      userId: "testuser123",
      password: "Test123!@#",
      phone: "01012345678",
    };
  }

  // 유효하지 않은 사용자 ID들
  static createInvalidUserIds() {
    return [
      "", // 빈 문자열
      "a", // 너무 짧음
      "a".repeat(21), // 너무 김
      "test@user", // 특수문자 포함
      "test user", // 공백 포함
      "123456", // 숫자만
      "TESTUSER", // 대문자만
      "testuser!@#", // 특수문자 포함
    ];
  }

  // 유효하지 않은 비밀번호들
  static createInvalidPasswords() {
    return [
      "", // 빈 문자열
      "123456", // 너무 짧음
      "password", // 소문자만
      "PASSWORD", // 대문자만
      "Password", // 숫자 없음
      "Password123", // 특수문자 없음
      "Pass1!", // 너무 짧음
      "a".repeat(101), // 너무 김
    ];
  }

  // 유효하지 않은 휴대폰 번호들
  static createInvalidPhones() {
    return [
      "", // 빈 문자열
      "0101234567", // 10자리
      "010123456789", // 12자리
      "010-1234-5678", // 하이픈 포함
      "010 1234 5678", // 공백 포함
      "0101234567a", // 문자 포함
      "02012345678", // 잘못된 지역번호
      "0101234567!", // 특수문자 포함
    ];
  }

  // 유효하지 않은 인증번호들
  static createInvalidVerificationCodes() {
    return [
      "", // 빈 문자열
      "12345", // 5자리
      "1234567", // 7자리
      "12345a", // 문자 포함
      "12345!", // 특수문자 포함
      "123 456", // 공백 포함
    ];
  }

  // 구글 로그인 테스트 데이터
  static createGoogleUser() {
    return {
      googleId: "google123456789",
      googleEmail: "test@gmail.com",
      phone: "01087654321",
    };
  }

  // 유효하지 않은 구글 코드들
  static createInvalidGoogleCodes() {
    return [
      "", // 빈 문자열
      "invalid_code", // 잘못된 형식
      "a".repeat(1000), // 너무 김
    ];
  }

  // 다양한 휴대폰 번호들 (테스트용)
  static createTestPhones() {
    return ["01012345678", "01087654321", "01011111111", "01099999999", "01055555555"];
  }

  // 다양한 사용자 ID들 (테스트용)
  static createTestUserIds() {
    return ["testuser1", "testuser2", "testuser3", "googleuser1", "googleuser2"];
  }

  // 새 비밀번호들
  static createNewPasswords() {
    return ["NewPass123!", "Another123!", "Updated123!"];
  }

  // 새 휴대폰 번호들
  static createNewPhones() {
    return ["01098765432", "01011112222", "01033334444"];
  }
}
