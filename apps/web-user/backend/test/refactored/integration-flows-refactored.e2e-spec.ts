import { AuthTestBase } from '../base/auth-test-base';
import { TestGroup, TestScenario, TestSetup, IntegrationTest } from '../base/test-decorators';
import { TEST_CONSTANTS } from '../base/test-constants';

@TestGroup('통합 테스트')
@TestScenario('인증 플로우')
@TestSetup({ timeout: TEST_CONSTANTS.TIMEOUT.LONG })
@IntegrationTest
describe('인증 플로우 통합 테스트 - 리팩터링 버전', () => {
  class IntegrationTest extends AuthTestBase {
    async beforeAll() {
      await this.initializeApp();
    }

    async afterAll() {
      await this.cleanupApp();
    }

    async beforeEach() {
      await this.beforeEachSetup();
    }

    async afterEach() {
      await this.afterEachCleanup();
    }
  }

  const testInstance = new IntegrationTest();

  beforeAll(async () => {
    await testInstance.beforeAll();
  });

  afterAll(async () => {
    await testInstance.afterAll();
  });

  beforeEach(async () => {
    await testInstance.beforeEach();
  });

  afterEach(async () => {
    await testInstance.afterEach();
  });

  describe('플로우 1: 일반 회원가입 - 휴대폰 인증 완료 후 회원가입', () => {
    it('1-1. 휴대폰 인증이 완료되지 않은 상태에서 회원가입', async () => {
      const userData = testInstance.createValidUser();
      
      // 회원가입 플로우 실행
      const { user, response } = await testInstance.executeGeneralRegistrationFlow(userData);
      
      // 응답 검증
      testInstance.expectUserDataResponse(response, user.userId);
      
      // 데이터베이스 검증
      const createdUser = await testInstance.getUserFromDatabase(user.userId);
      expect(createdUser).toBeDefined();
      expect(createdUser?.phoneVerified).toBe(true);
    });

    it('1-2. 휴대폰 인증이 이미 완료된 상태에서 회원가입', async () => {
      const userData = testInstance.createValidUser();
      
      // 회원가입 플로우 실행
      const { user, response } = await testInstance.executeGeneralRegistrationFlow(userData);
      
      // 응답 검증
      testInstance.expectUserDataResponse(response, user.userId);
    });
  });

  describe('플로우 2: 일반 로그인', () => {
    it('2-1. 유효한 아이디/비밀번호로 로그인', async () => {
      const userData = testInstance.createValidUser();
      
      // 사용자 생성
      await testInstance.executeGeneralRegistrationFlow(userData);
      
      // 로그인
      const loginResponse = await testInstance.executeGeneralLoginFlow(userData.userId, userData.password);
      
      // 응답 검증
      testInstance.expectUserDataResponse(loginResponse, userData.userId);
    });
  });

  describe('플로우 3: 소셜 로그인 - 등록되지 않은 사용자', () => {
    it('3-1. 등록되지 않은 구글 사용자로 로그인 시도', async () => {
      const response = await testInstance.app.getHttpServer()
        .post('/auth/google/login')
        .send({
          code: 'new_user_code'
        })
        .expect(TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('등록되지 않은 사용자');
      expect(response.body.googleId).toBeDefined();
      expect(response.body.googleEmail).toBeDefined();
    });
  });

  describe('플로우 4: 소셜 로그인 - 휴대폰 인증 미완료', () => {
    it('4-1. 휴대폰 인증이 완료되지 않은 구글 사용자로 로그인 시도', async () => {
      const googleUserData = testInstance.createValidGoogleUser();
      
      // 데이터베이스에 직접 구글 사용자 생성 (휴대폰 인증 없이)
      await testInstance.createUserInDatabase({
        ...googleUserData,
        phoneVerified: false
      });
      
      const response = await testInstance.app.getHttpServer()
        .post('/auth/google/login')
        .send({
          code: 'unverified_phone_code'
        })
        .expect(TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.BUSINESS.PHONE_VERIFICATION_REQUIRED);
      expect(response.body.googleId).toBeDefined();
      expect(response.body.googleEmail).toBeDefined();
    });
  });

  describe('플로우 5: 소셜 로그인 - 성공', () => {
    it('5-1. 휴대폰 인증이 완료된 구글 사용자로 로그인', async () => {
      const googleUserData = testInstance.createValidGoogleUser();
      
      // 구글 사용자 생성 (휴대폰 인증 완료)
      await testInstance.executeGoogleRegistrationFlow(googleUserData);
      
      // 구글 로그인
      const response = await testInstance.executeGoogleLoginFlow();
      
      // 응답 검증
      testInstance.expectUserDataResponse(response);
      expect(response.data.googleId).toBe(googleUserData.googleId);
      expect(response.data.googleEmail).toBe(googleUserData.googleEmail);
    });
  });

  describe('플로우 6: 소셜 회원가입 - 새 사용자', () => {
    it('6-1. 등록되지 않은 구글 사용자의 회원가입', async () => {
      const googleUserData = testInstance.createValidGoogleUser();
      
      // 구글 회원가입 플로우 실행
      const { user, response } = await testInstance.executeGoogleRegistrationFlow(googleUserData);
      
      // 응답 검증
      testInstance.expectUserDataResponse(response);
      expect(response.data.googleId).toBe(user.googleId);
      expect(response.data.googleEmail).toBe(user.googleEmail);
    });
  });

  describe('플로우 7: 소셜 회원가입 - 휴대폰 중복', () => {
    it('7-1. 이미 사용 중인 휴대폰 번호로 구글 회원가입', async () => {
      const userData = testInstance.createValidUser();
      const googleUserData = {
        ...testInstance.createValidGoogleUser(),
        phone: userData.phone
      };
      
      // 일반 사용자 생성
      await testInstance.executeGeneralRegistrationFlow(userData);
      
      // 같은 휴대폰 번호로 구글 회원가입 시도
      await testInstance.completePhoneVerification(googleUserData.phone);

      const response = await testInstance.app.getHttpServer()
        .post('/auth/google/register')
        .send(googleUserData)
        .expect(TEST_CONSTANTS.HTTP_STATUS.CONFLICT);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('일반 계정');
    });
  });

  describe('플로우 8: 계정 찾기', () => {
    it('8-1. 휴대폰 인증을 통한 계정 찾기', async () => {
      const userData = testInstance.createValidUser();
      
      // 사용자 생성
      await testInstance.executeGeneralRegistrationFlow(userData);
      
      // 계정 찾기 플로우 실행
      const response = await testInstance.executeFindAccountFlow(userData.phone);
      
      // 응답 검증
      expect(response.success).toBe(true);
      expect(response.data.userId).toBe(userData.userId);
    });
  });

  describe('플로우 9: 비밀번호 변경', () => {
    it('9-1. 휴대폰 인증을 통한 비밀번호 변경', async () => {
      const userData = testInstance.createValidUser();
      
      // 사용자 생성
      await testInstance.executeGeneralRegistrationFlow(userData);
      
      // 비밀번호 변경 플로우 실행
      const newPassword = testInstance.createNewPasswords()[0];
      const response = await testInstance.executeChangePasswordFlow(userData.userId, userData.phone, newPassword);
      
      // 응답 검증
      expect(response.success).toBe(true);
      expect(response.message).toContain(TEST_CONSTANTS.SUCCESS_MESSAGES.PASSWORD_CHANGED);
      
      // 새 비밀번호로 로그인 가능한지 확인
      const loginResponse = await testInstance.executeGeneralLoginFlow(userData.userId, newPassword);
      expect(loginResponse.success).toBe(true);
    });
  });

  describe('플로우 10: 휴대폰 번호 변경', () => {
    it('10-1. 인증된 사용자의 휴대폰 번호 변경', async () => {
      const userData = testInstance.createValidUser();
      
      // 사용자 생성 및 로그인
      const { response: userResponse } = await testInstance.executeGeneralRegistrationFlow(userData);
      const { accessToken } = testInstance.extractTokensFromResponse(userResponse);
      
      // 휴대폰 번호 변경 플로우 실행
      const newPhone = testInstance.createNewPhones()[0];
      const response = await testInstance.executeChangePhoneFlow(accessToken, newPhone);
      
      // 응답 검증
      expect(response.success).toBe(true);
      expect(response.message).toContain(TEST_CONSTANTS.SUCCESS_MESSAGES.PHONE_CHANGED);
      
      // 데이터베이스에서 휴대폰 번호가 변경되었는지 확인
      const updatedUser = await testInstance.getUserFromDatabase(userData.userId);
      expect(updatedUser?.phone).toBe(newPhone);
    });
  });

  describe('플로우 11: 토큰 갱신 - 성공', () => {
    it('11-1. 유효한 refresh token으로 access token 갱신', async () => {
      const userData = testInstance.createValidUser();
      
      // 사용자 생성 및 로그인
      const { response: userResponse } = await testInstance.executeGeneralRegistrationFlow(userData);
      const { refreshToken } = testInstance.extractTokensFromResponse(userResponse);
      
      // 토큰 갱신 플로우 실행
      const response = await testInstance.executeRefreshTokenFlow(refreshToken);
      
      // 응답 검증
      expect(response.success).toBe(true);
      expect(response.data.accessToken).toBeDefined();
      
      // 갱신된 access token으로 인증된 API 호출
      const newPhone = testInstance.createNewPhones()[0];
      await testInstance.completePhoneVerification(newPhone);
      
      const authResponse = await testInstance.app.getHttpServer()
        .post('/auth/change-phone')
        .set(testInstance.createAuthHeader(response.data.accessToken))
        .send({ newPhone })
        .expect(TEST_CONSTANTS.HTTP_STATUS.OK);

      expect(authResponse.body.success).toBe(true);
    });
  });

  describe('플로우 12: 토큰 갱신 - 실패', () => {
    it('12-1. 유효하지 않은 refresh token으로 갱신 시도', async () => {
      const response = await testInstance.app.getHttpServer()
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid_refresh_token' })
        .expect(TEST_CONSTANTS.HTTP_STATUS.UNAUTHORIZED);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.BUSINESS.INVALID_REFRESH_TOKEN);
    });
  });

  describe('복합 플로우 테스트', () => {
    it('전체 사용자 생명주기 테스트', async () => {
      const userData = testInstance.createValidUser();
      
      // 1. 회원가입
      const { response: registerResponse } = await testInstance.executeGeneralRegistrationFlow(userData);
      const { accessToken, refreshToken } = testInstance.extractTokensFromResponse(registerResponse);

      // 2. 로그인
      const loginResponse = await testInstance.executeGeneralLoginFlow(userData.userId, userData.password);
      expect(loginResponse.success).toBe(true);

      // 3. 토큰 갱신
      const refreshResponse = await testInstance.executeRefreshTokenFlow(refreshToken);
      expect(refreshResponse.success).toBe(true);

      // 4. 비밀번호 변경
      const newPassword = testInstance.createNewPasswords()[0];
      await testInstance.executeChangePasswordFlow(userData.userId, userData.phone, newPassword);

      // 5. 새 비밀번호로 로그인
      const newLoginResponse = await testInstance.executeGeneralLoginFlow(userData.userId, newPassword);
      expect(newLoginResponse.success).toBe(true);

      // 6. 휴대폰 번호 변경
      const newPhone = testInstance.createNewPhones()[0];
      const { accessToken: newAccessToken } = testInstance.extractTokensFromResponse(newLoginResponse);
      
      await testInstance.executeChangePhoneFlow(newAccessToken, newPhone);

      // 7. 계정 찾기
      await testInstance.executeFindAccountFlow(newPhone);
    });

    it('구글 사용자 전체 생명주기 테스트', async () => {
      const googleUserData = testInstance.createValidGoogleUser();
      
      // 1. 구글 회원가입
      const { response: registerResponse } = await testInstance.executeGoogleRegistrationFlow(googleUserData);
      const { accessToken, refreshToken } = testInstance.extractTokensFromResponse(registerResponse);

      // 2. 구글 로그인
      const loginResponse = await testInstance.executeGoogleLoginFlow();
      expect(loginResponse.success).toBe(true);

      // 3. 토큰 갱신
      const refreshResponse = await testInstance.executeRefreshTokenFlow(refreshToken);
      expect(refreshResponse.success).toBe(true);

      // 4. 휴대폰 번호 변경
      const newPhone = testInstance.createNewPhones()[0];
      const { accessToken: newAccessToken } = testInstance.extractTokensFromResponse(loginResponse);
      
      await testInstance.executeChangePhoneFlow(newAccessToken, newPhone);

      // 5. 계정 찾기
      await testInstance.executeFindAccountFlow(newPhone);
    });
  });

  describe('성능 테스트', () => {
    it('동시에 여러 사용자 생성 및 로그인', async () => {
      const userDataList = Array.from({ length: 3 }, (_, i) => ({
        ...testInstance.createValidUser(),
        userId: TEST_CONSTANTS.DATA_GENERATORS.generateRandomUserId(`user${i}`),
        phone: TEST_CONSTANTS.DATA_GENERATORS.generateRandomPhone()
      }));

      // 모든 사용자에 대해 휴대폰 인증 완료
      await Promise.all(
        userDataList.map(userData => testInstance.completePhoneVerification(userData.phone))
      );

      // 동시에 회원가입
      const registerPromises = userDataList.map(userData =>
        testInstance.app.getHttpServer()
          .post('/auth/register')
          .send(userData)
      );

      const registerResponses = await Promise.all(registerPromises);

      // 모든 회원가입이 성공인지 확인
      registerResponses.forEach((response, index) => {
        expect(response.status).toBe(TEST_CONSTANTS.HTTP_STATUS.CREATED);
        expect(response.body.success).toBe(true);
      });

      // 동시에 로그인
      const loginPromises = userDataList.map(userData =>
        testInstance.app.getHttpServer()
          .post('/auth/login')
          .send({
            userId: userData.userId,
            password: userData.password
          })
      );

      const loginResponses = await Promise.all(loginPromises);

      // 모든 로그인이 성공인지 확인
      loginResponses.forEach((response, index) => {
        expect(response.status).toBe(TEST_CONSTANTS.HTTP_STATUS.OK);
        expect(response.body.success).toBe(true);
      });
    });
  });
});
