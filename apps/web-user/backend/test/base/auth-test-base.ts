import { BaseTest } from "./base-test";
import { TestDataFactory } from "../utils/test-data.factory";

/**
 * 인증 관련 테스트 베이스 클래스
 * 인증 API 테스트에서 공통으로 사용되는 메서드들을 제공
 */
export abstract class AuthTestBase extends BaseTest {
  /**
   * 유효한 사용자 데이터 생성
   */
  protected createValidUser() {
    return TestDataFactory.createValidUser();
  }

  /**
   * 유효한 구글 사용자 데이터 생성
   */
  protected createValidGoogleUser() {
    return TestDataFactory.createGoogleUser();
  }

  /**
   * 유효하지 않은 사용자 ID들 생성
   */
  protected createInvalidUserIds() {
    return TestDataFactory.createInvalidUserIds();
  }

  /**
   * 유효하지 않은 비밀번호들 생성
   */
  protected createInvalidPasswords() {
    return TestDataFactory.createInvalidPasswords();
  }

  /**
   * 유효하지 않은 휴대폰 번호들 생성
   */
  protected createInvalidPhones() {
    return TestDataFactory.createInvalidPhones();
  }

  /**
   * 유효하지 않은 인증번호들 생성
   */
  protected createInvalidVerificationCodes() {
    return TestDataFactory.createInvalidVerificationCodes();
  }

  /**
   * 유효하지 않은 구글 코드들 생성
   */
  protected createInvalidGoogleCodes() {
    return TestDataFactory.createInvalidGoogleCodes();
  }

  /**
   * 테스트용 휴대폰 번호들 생성
   */
  protected createTestPhones() {
    return TestDataFactory.createTestPhones();
  }

  /**
   * 테스트용 사용자 ID들 생성
   */
  protected createTestUserIds() {
    return TestDataFactory.createTestUserIds();
  }

  /**
   * 새 비밀번호들 생성
   */
  protected createNewPasswords() {
    return TestDataFactory.createNewPasswords();
  }

  /**
   * 새 휴대폰 번호들 생성
   */
  protected createNewPhones() {
    return TestDataFactory.createNewPhones();
  }

  /**
   * 일반 회원가입 플로우 실행
   */
  protected async executeGeneralRegistrationFlow(userData?: any) {
    const user = userData || this.createValidUser();

    // 1. ID 중복 확인
    await this.app
      .getHttpServer()
      .get("/auth/check-user-id")
      .query({ userId: user.userId })
      .expect(200);

    // 2. 휴대폰 인증 완료
    await this.completePhoneVerification(user.phone);

    // 3. 회원가입
    const response = await this.app.getHttpServer().post("/auth/register").send(user).expect(201);

    return { user, response: response.body };
  }

  /**
   * 구글 회원가입 플로우 실행
   */
  protected async executeGoogleRegistrationFlow(googleUserData?: any) {
    const googleUser = googleUserData || this.createValidGoogleUser();

    // 1. 휴대폰 인증 완료
    await this.completePhoneVerification(googleUser.phone);

    // 2. 구글 회원가입
    const response = await this.app
      .getHttpServer()
      .post("/auth/google/register")
      .send(googleUser)
      .expect(201);

    return { user: googleUser, response: response.body };
  }

  /**
   * 일반 로그인 플로우 실행
   */
  protected async executeGeneralLoginFlow(userId: string, password: string) {
    const response = await this.app
      .getHttpServer()
      .post("/auth/login")
      .send({ userId, password })
      .expect(200);

    return response.body;
  }

  /**
   * 구글 로그인 플로우 실행
   */
  protected async executeGoogleLoginFlow(code: string = "valid_google_code") {
    const response = await this.app
      .getHttpServer()
      .post("/auth/google/login")
      .send({ code })
      .expect(200);

    return response.body;
  }

  /**
   * 계정 찾기 플로우 실행
   */
  protected async executeFindAccountFlow(phone: string) {
    // 휴대폰 인증 완료
    await this.completePhoneVerification(phone);

    // 계정 찾기
    const response = await this.app
      .getHttpServer()
      .post("/auth/find-account")
      .send({ phone })
      .expect(200);

    return response.body;
  }

  /**
   * 비밀번호 변경 플로우 실행
   */
  protected async executeChangePasswordFlow(userId: string, phone: string, newPassword: string) {
    // 휴대폰 인증 완료
    await this.completePhoneVerification(phone);

    // 비밀번호 변경
    const response = await this.app
      .getHttpServer()
      .post("/auth/change-password")
      .send({ userId, phone, newPassword })
      .expect(200);

    return response.body;
  }

  /**
   * 휴대폰 번호 변경 플로우 실행
   */
  protected async executeChangePhoneFlow(accessToken: string, newPhone: string) {
    // 새 휴대폰 번호 인증 완료
    await this.completePhoneVerification(newPhone);

    // 휴대폰 번호 변경
    const response = await this.app
      .getHttpServer()
      .post("/auth/change-phone")
      .set(this.createAuthHeader(accessToken))
      .send({ newPhone })
      .expect(200);

    return response.body;
  }

  /**
   * 토큰 갱신 플로우 실행
   */
  protected async executeRefreshTokenFlow(refreshToken: string) {
    const response = await this.app
      .getHttpServer()
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    return response.body;
  }

  /**
   * 휴대폰 인증 플로우 실행
   */
  protected async executePhoneVerificationFlow(phone: string) {
    // 1. 인증번호 발송
    await this.app.getHttpServer().post("/auth/send-verification-code").send({ phone }).expect(200);

    // 2. 인증번호 확인
    const response = await this.app
      .getHttpServer()
      .post("/auth/verify-phone-code")
      .send({ phone, verificationCode: "123456" })
      .expect(200);

    return response.body;
  }

  /**
   * ID 중복 확인 플로우 실행
   */
  protected async executeCheckUserIdFlow(userId: string) {
    const response = await this.app
      .getHttpServer()
      .get("/auth/check-user-id")
      .query({ userId })
      .expect(200);

    return response.body;
  }

  /**
   * 성공적인 회원가입 후 로그인 테스트
   */
  protected async testRegistrationAndLogin(userData?: any) {
    const user = userData || this.createValidUser();

    // 회원가입
    const { response: registerResponse } = await this.executeGeneralRegistrationFlow(user);

    // 로그인
    const loginResponse = await this.executeGeneralLoginFlow(user.userId, user.password);

    return { registerResponse, loginResponse };
  }

  /**
   * 성공적인 구글 회원가입 후 로그인 테스트
   */
  protected async testGoogleRegistrationAndLogin(googleUserData?: any) {
    const googleUser = googleUserData || this.createValidGoogleUser();

    // 구글 회원가입
    const { response: registerResponse } = await this.executeGoogleRegistrationFlow(googleUser);

    // 구글 로그인
    const loginResponse = await this.executeGoogleLoginFlow();

    return { registerResponse, loginResponse };
  }

  /**
   * 비밀번호 변경 후 로그인 테스트
   */
  protected async testPasswordChangeAndLogin(userData: any, newPassword: string) {
    // 비밀번호 변경
    await this.executeChangePasswordFlow(userData.userId, userData.phone, newPassword);

    // 새 비밀번호로 로그인
    const loginResponse = await this.executeGeneralLoginFlow(userData.userId, newPassword);

    return loginResponse;
  }

  /**
   * 토큰 갱신 후 API 호출 테스트
   */
  protected async testTokenRefreshAndApiCall(refreshToken: string, apiCall: () => Promise<any>) {
    // 토큰 갱신
    const refreshResponse = await this.executeRefreshTokenFlow(refreshToken);
    const newAccessToken = refreshResponse.data.accessToken;

    // 갱신된 토큰으로 API 호출
    const apiResponse = await apiCall();

    return { refreshResponse, apiResponse, newAccessToken };
  }
}
