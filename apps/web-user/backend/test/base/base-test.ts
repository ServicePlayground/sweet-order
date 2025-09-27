import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "@web-user/backend/app.module";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

/**
 * 기본 테스트 클래스
 * 모든 테스트에서 공통으로 사용되는 설정과 헬퍼 메서드를 제공
 */
export abstract class BaseTest {
  protected app: INestApplication;
  protected moduleFixture: TestingModule;

  /**
   * 테스트 모듈 초기화
   */
  protected async initializeApp(): Promise<void> {
    setupAllMocks();

    this.moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = this.moduleFixture.createNestApplication();
    await this.app.init();
  }

  /**
   * 테스트 모듈 정리
   */
  protected async cleanupApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
  }

  /**
   * 각 테스트 전 실행되는 공통 설정
   */
  protected async beforeEachSetup(): Promise<void> {
    resetAllMocks();
    await TestHelpers.cleanupDatabase();
  }

  /**
   * 각 테스트 후 실행되는 공통 정리
   */
  protected async afterEachCleanup(): Promise<void> {
    await TestHelpers.cleanupDatabase();
  }

  /**
   * 테스트 데이터베이스 정리
   */
  protected async cleanupDatabase(): Promise<void> {
    await TestHelpers.cleanupDatabase();
  }

  /**
   * 사용자 생성 헬퍼
   */
  protected async createUser(userData?: any) {
    return await TestHelpers.createUser(this.app, userData);
  }

  /**
   * 구글 사용자 생성 헬퍼
   */
  protected async createGoogleUser(googleData?: any) {
    return await TestHelpers.createGoogleUser(this.app, googleData);
  }

  /**
   * 휴대폰 인증 완료 헬퍼
   */
  protected async completePhoneVerification(phone: string) {
    return await TestHelpers.completePhoneVerification(this.app, phone);
  }

  /**
   * 로그인 헬퍼
   */
  protected async loginUser(userId: string, password: string) {
    return await TestHelpers.loginUser(this.app, userId, password);
  }

  /**
   * 구글 로그인 헬퍼
   */
  protected async loginGoogleUser(code: string = "mock_google_code") {
    return await TestHelpers.loginGoogleUser(this.app, code);
  }

  /**
   * 데이터베이스에서 사용자 조회 헬퍼
   */
  protected async getUserFromDatabase(userId: string) {
    return await TestHelpers.getUserFromDatabase(userId);
  }

  /**
   * 데이터베이스에서 사용자 삭제 헬퍼
   */
  protected async deleteUserFromDatabase(userId: string) {
    return await TestHelpers.deleteUserFromDatabase(userId);
  }

  /**
   * 데이터베이스에 직접 사용자 생성 헬퍼
   */
  protected async createUserInDatabase(userData: any) {
    return await TestHelpers.createUserInDatabase(userData);
  }

  /**
   * 데이터베이스에 직접 휴대폰 인증 정보 생성 헬퍼
   */
  protected async createPhoneVerificationInDatabase(phone: string, verified: boolean = true) {
    return await TestHelpers.createPhoneVerificationInDatabase(phone, verified);
  }

  /**
   * JWT 토큰 추출 헬퍼
   */
  protected extractTokensFromResponse(response: any) {
    return TestHelpers.extractTokensFromResponse(response);
  }

  /**
   * 인증 헤더 생성 헬퍼
   */
  protected createAuthHeader(accessToken: string) {
    return TestHelpers.createAuthHeader(accessToken);
  }

  /**
   * 에러 응답 검증 헬퍼
   */
  protected expectErrorResponse(response: any, expectedStatus: number, expectedMessage?: string) {
    return TestHelpers.expectErrorResponse(response, expectedStatus, expectedMessage);
  }

  /**
   * 성공 응답 검증 헬퍼
   */
  protected expectSuccessResponse(response: any, expectedStatus: number) {
    return TestHelpers.expectSuccessResponse(response, expectedStatus);
  }

  /**
   * 사용자 데이터 응답 검증 헬퍼
   */
  protected expectUserDataResponse(response: any, expectedUserId?: string) {
    return TestHelpers.expectUserDataResponse(response, expectedUserId);
  }
}
