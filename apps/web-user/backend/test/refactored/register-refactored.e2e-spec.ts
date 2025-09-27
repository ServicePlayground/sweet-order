import { AuthTestBase } from '../base/auth-test-base';
import { TestGroup, TestScenario, TestSetup } from '../base/test-decorators';
import { TEST_CONSTANTS } from '../base/test-constants';

@TestGroup('회원가입')
@TestScenario('일반 회원가입')
@TestSetup({ timeout: TEST_CONSTANTS.TIMEOUT.DEFAULT })
describe('일반 회원가입 API (POST /auth/register) - 리팩터링 버전', () => {
  class RegisterTest extends AuthTestBase {
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

  const testInstance = new RegisterTest();

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

  describe('성공 케이스', () => {
    it('유효한 데이터로 회원가입 성공', async () => {
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

    it('다양한 유효한 사용자 ID로 회원가입 성공', async () => {
      const testUserIds = testInstance.createTestUserIds();
      
      for (const userId of testUserIds) {
        const userData = {
          ...testInstance.createValidUser(),
          userId,
          phone: TEST_CONSTANTS.DATA_GENERATORS.generateRandomPhone()
        };

        // 회원가입 플로우 실행
        const { response } = await testInstance.executeGeneralRegistrationFlow(userData);
        
        // 응답 검증
        testInstance.expectUserDataResponse(response, userId);
      }
    });
  });

  describe('실패 케이스 - 유효성 검증', () => {
    it('빈 요청 본문으로 회원가입 실패', async () => {
      const response = await testInstance.app.getHttpServer()
        .post('/auth/register')
        .send({})
        .expect(TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
    });

    it('유효하지 않은 사용자 ID로 회원가입 실패', async () => {
      const invalidUserIds = testInstance.createInvalidUserIds();
      
      for (const userId of invalidUserIds) {
        const userData = {
          ...testInstance.createValidUser(),
          userId
        };

        const response = await testInstance.app.getHttpServer()
          .post('/auth/register')
          .send(userData)
          .expect(TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.VALIDATION.USER_ID_INVALID);
      }
    });

    it('유효하지 않은 비밀번호로 회원가입 실패', async () => {
      const invalidPasswords = testInstance.createInvalidPasswords();
      
      for (const password of invalidPasswords) {
        const userData = {
          ...testInstance.createValidUser(),
          password
        };

        const response = await testInstance.app.getHttpServer()
          .post('/auth/register')
          .send(userData)
          .expect(TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.VALIDATION.PASSWORD_INVALID);
      }
    });

    it('유효하지 않은 휴대폰 번호로 회원가입 실패', async () => {
      const invalidPhones = testInstance.createInvalidPhones();
      
      for (const phone of invalidPhones) {
        const userData = {
          ...testInstance.createValidUser(),
          phone
        };

        const response = await testInstance.app.getHttpServer()
          .post('/auth/register')
          .send(userData)
          .expect(TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.VALIDATION.PHONE_INVALID);
      }
    });
  });

  describe('실패 케이스 - 비즈니스 로직', () => {
    it('중복된 사용자 ID로 회원가입 실패', async () => {
      const userData1 = testInstance.createValidUser();
      const userData2 = {
        ...testInstance.createValidUser(),
        userId: userData1.userId,
        phone: TEST_CONSTANTS.DATA_GENERATORS.generateRandomPhone()
      };
      
      // 첫 번째 사용자 생성
      await testInstance.executeGeneralRegistrationFlow(userData1);
      
      // 두 번째 사용자 생성 시도
      await testInstance.completePhoneVerification(userData2.phone);
      
      const response = await testInstance.app.getHttpServer()
        .post('/auth/register')
        .send(userData2)
        .expect(TEST_CONSTANTS.HTTP_STATUS.CONFLICT);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.BUSINESS.USER_ALREADY_EXISTS);
    });

    it('중복된 휴대폰 번호로 회원가입 실패', async () => {
      const userData1 = testInstance.createValidUser();
      const userData2 = {
        ...testInstance.createValidUser(),
        userId: TEST_CONSTANTS.DATA_GENERATORS.generateRandomUserId(),
        phone: userData1.phone
      };
      
      // 첫 번째 사용자 생성
      await testInstance.executeGeneralRegistrationFlow(userData1);
      
      // 두 번째 사용자 생성 시도
      const response = await testInstance.app.getHttpServer()
        .post('/auth/register')
        .send(userData2)
        .expect(TEST_CONSTANTS.HTTP_STATUS.CONFLICT);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.BUSINESS.PHONE_ALREADY_EXISTS);
    });

    it('휴대폰 인증이 완료되지 않은 상태로 회원가입 실패', async () => {
      const userData = testInstance.createValidUser();
      
      const response = await testInstance.app.getHttpServer()
        .post('/auth/register')
        .send(userData)
        .expect(TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(TEST_CONSTANTS.ERROR_MESSAGES.BUSINESS.PHONE_VERIFICATION_REQUIRED);
    });

    it('이미 구글 계정으로 등록된 휴대폰 번호로 일반 회원가입 실패', async () => {
      const userData = testInstance.createValidUser();
      const googleUserData = {
        ...testInstance.createValidGoogleUser(),
        phone: userData.phone
      };
      
      // 구글 사용자 생성
      await testInstance.executeGoogleRegistrationFlow(googleUserData);
      
      // 일반 회원가입 시도
      await testInstance.completePhoneVerification(userData.phone);
      
      const response = await testInstance.app.getHttpServer()
        .post('/auth/register')
        .send(userData)
        .expect(TEST_CONSTANTS.HTTP_STATUS.CONFLICT);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('구글 계정');
    });
  });

  describe('엣지 케이스', () => {
    it('최소 길이 사용자 ID로 회원가입 성공', async () => {
      const userData = {
        ...testInstance.createValidUser(),
        userId: 'ab' // 최소 길이
      };

      const { response } = await testInstance.executeGeneralRegistrationFlow(userData);
      testInstance.expectUserDataResponse(response, userData.userId);
    });

    it('최대 길이 사용자 ID로 회원가입 성공', async () => {
      const userData = {
        ...testInstance.createValidUser(),
        userId: 'a'.repeat(20) // 최대 길이
      };

      const { response } = await testInstance.executeGeneralRegistrationFlow(userData);
      testInstance.expectUserDataResponse(response, userData.userId);
    });

    it('최소 길이 비밀번호로 회원가입 성공', async () => {
      const userData = {
        ...testInstance.createValidUser(),
        password: 'Ab1!@#$' // 최소 길이
      };

      const { response } = await testInstance.executeGeneralRegistrationFlow(userData);
      testInstance.expectUserDataResponse(response, userData.userId);
    });

    it('최대 길이 비밀번호로 회원가입 성공', async () => {
      const userData = {
        ...testInstance.createValidUser(),
        password: 'Ab1!@#$' + 'a'.repeat(94) // 최대 길이
      };

      const { response } = await testInstance.executeGeneralRegistrationFlow(userData);
      testInstance.expectUserDataResponse(response, userData.userId);
    });
  });

  describe('성능 테스트', () => {
    it('동시에 여러 회원가입 요청 처리', async () => {
      const userDataList = Array.from({ length: 5 }, (_, i) => ({
        ...testInstance.createValidUser(),
        userId: TEST_CONSTANTS.DATA_GENERATORS.generateRandomUserId(`user${i}`),
        phone: TEST_CONSTANTS.DATA_GENERATORS.generateRandomPhone()
      }));

      // 모든 사용자에 대해 휴대폰 인증 완료
      await Promise.all(
        userDataList.map(userData => testInstance.completePhoneVerification(userData.phone))
      );

      // 동시에 회원가입 요청
      const promises = userDataList.map(userData =>
        testInstance.app.getHttpServer()
          .post('/auth/register')
          .send(userData)
      );

      const responses = await Promise.all(promises);

      // 모든 응답이 성공인지 확인
      responses.forEach((response, index) => {
        expect(response.status).toBe(TEST_CONSTANTS.HTTP_STATUS.CREATED);
        expect(response.body.success).toBe(true);
        expect(response.body.data.userId).toBe(userDataList[index].userId);
      });
    });
  });
});
