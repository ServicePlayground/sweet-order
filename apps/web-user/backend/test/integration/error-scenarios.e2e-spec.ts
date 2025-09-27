import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("에러 시나리오 통합 테스트", () => {
  let app: INestApplication;

  beforeAll(async () => {
    setupAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    resetAllMocks();
    await TestHelpers.cleanupDatabase();
  });

  describe("회원가입 에러 시나리오", () => {
    it("중복된 사용자 ID로 회원가입 시도", async () => {
      const userData1 = TestDataFactory.createValidUser();
      const userData2 = { ...TestDataFactory.createValidUser(), userId: userData1.userId };

      // 첫 번째 사용자 생성
      await TestHelpers.createUser(app, userData1);

      // 두 번째 사용자 생성 시도 (같은 ID)
      await TestHelpers.completePhoneVerification(app, userData2.phone);

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(userData2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 존재");
    });

    it("중복된 휴대폰 번호로 회원가입 시도", async () => {
      const userData1 = TestDataFactory.createValidUser();
      const userData2 = { ...TestDataFactory.createValidUser(), phone: userData1.phone };

      // 첫 번째 사용자 생성
      await TestHelpers.createUser(app, userData1);

      // 두 번째 사용자 생성 시도 (같은 휴대폰 번호)
      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(userData2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰");
    });

    it("휴대폰 인증 없이 회원가입 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });
  });

  describe("로그인 에러 시나리오", () => {
    it("존재하지 않는 사용자로 로그인 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: "nonexistentuser",
          password: "ValidPass123!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("계정을 찾을 수 없습니다");
    });

    it("잘못된 비밀번호로 로그인 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 잘못된 비밀번호로 로그인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("잘못된 인증 정보");
    });

    it("휴대폰 인증이 완료되지 않은 사용자로 로그인 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      // 데이터베이스에 직접 사용자 생성 (휴대폰 인증 없이)
      await TestHelpers.createUserInDatabase({
        ...userData,
        phoneVerified: false,
      });

      // 로그인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: userData.password,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });
  });

  describe("구글 로그인 에러 시나리오", () => {
    it("등록되지 않은 구글 사용자로 로그인 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({
          code: "new_user_code",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("등록되지 않은 사용자");
      expect(response.body.googleId).toBeDefined();
      expect(response.body.googleEmail).toBeDefined();
    });

    it("휴대폰 인증이 완료되지 않은 구글 사용자로 로그인 시도", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 데이터베이스에 직접 구글 사용자 생성 (휴대폰 인증 없이)
      await TestHelpers.createUserInDatabase({
        ...googleUserData,
        phoneVerified: false,
      });

      const response = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({
          code: "unverified_phone_code",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
      expect(response.body.googleId).toBeDefined();
      expect(response.body.googleEmail).toBeDefined();
    });

    it("잘못된 구글 코드로 로그인 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({
          code: "invalid_google_code",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("구글 로그인 실패");
    });
  });

  describe("구글 회원가입 에러 시나리오", () => {
    it("중복된 구글 ID로 회원가입 시도", async () => {
      const googleUserData1 = TestDataFactory.createGoogleUser();
      const googleUserData2 = {
        ...TestDataFactory.createGoogleUser(),
        googleId: googleUserData1.googleId,
      };

      // 첫 번째 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData1);

      // 두 번째 구글 사용자 생성 시도 (같은 구글 ID)
      await TestHelpers.completePhoneVerification(app, googleUserData2.phone);

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 존재");
    });

    it("중복된 휴대폰 번호로 구글 회원가입 시도", async () => {
      const googleUserData1 = TestDataFactory.createGoogleUser();
      const googleUserData2 = {
        ...TestDataFactory.createGoogleUser(),
        phone: googleUserData1.phone,
      };

      // 첫 번째 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData1);

      // 두 번째 구글 사용자 생성 시도 (같은 휴대폰 번호)
      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰");
    });

    it("이미 일반 계정으로 등록된 휴대폰 번호로 구글 회원가입 시도", async () => {
      const userData = TestDataFactory.createValidUser();
      const googleUserData = TestDataFactory.createGoogleUser();

      // 일반 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 같은 휴대폰 번호로 구글 회원가입 시도
      const duplicateGoogleUserData = {
        ...googleUserData,
        phone: userData.phone,
      };

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, duplicateGoogleUserData.phone);

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(duplicateGoogleUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("일반 계정");
    });

    it("휴대폰 인증 없이 구글 회원가입 시도", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });
  });

  describe("계정 찾기 에러 시나리오", () => {
    it("등록되지 않은 휴대폰 번호로 계정 찾기 시도", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, phone);

      // 계정 찾기 시도
      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("계정을 찾을 수 없습니다");
    });

    it("휴대폰 인증 없이 계정 찾기 시도", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });
  });

  describe("비밀번호 변경 에러 시나리오", () => {
    it("존재하지 않는 사용자로 비밀번호 변경 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/change-password")
        .send({
          userId: "nonexistentuser",
          phone: TestDataFactory.createValidUser().phone,
          newPassword: TestDataFactory.createNewPasswords()[0],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("계정을 찾을 수 없습니다");
    });

    it("사용자 ID와 휴대폰 번호가 일치하지 않을 때 비밀번호 변경 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 다른 휴대폰 번호로 비밀번호 변경 시도
      const response = await request(app.getHttpServer())
        .post("/auth/change-password")
        .send({
          userId: userData.userId,
          phone: "01099999999", // 다른 휴대폰 번호
          newPassword: TestDataFactory.createNewPasswords()[0],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("일치하지 않습니다");
    });

    it("휴대폰 인증 없이 비밀번호 변경 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      const response = await request(app.getHttpServer())
        .post("/auth/change-password")
        .send({
          userId: userData.userId,
          phone: userData.phone,
          newPassword: TestDataFactory.createNewPasswords()[0],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });

    it("구글 계정으로 비밀번호 변경 시도", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData);

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, googleUserData.phone);

      // 구글 계정으로 비밀번호 변경 시도
      const response = await request(app.getHttpServer())
        .post("/auth/change-password")
        .send({
          userId: googleUserData.googleId, // 구글 ID로 시도
          phone: googleUserData.phone,
          newPassword: TestDataFactory.createNewPasswords()[0],
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("계정을 찾을 수 없습니다");
    });
  });

  describe("휴대폰 번호 변경 에러 시나리오", () => {
    it("인증 토큰 없이 휴대폰 번호 변경 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .send({ newPhone: TestDataFactory.createNewPhones()[0] })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 인증 토큰으로 휴대폰 번호 변경 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader("invalid_token"))
        .send({ newPhone: TestDataFactory.createNewPhones()[0] })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("이미 사용 중인 휴대폰 번호로 변경 시도", async () => {
      const userData1 = TestDataFactory.createValidUser();
      const userData2 = { ...TestDataFactory.createValidUser(), userId: "user2" };

      // 두 사용자 생성
      await TestHelpers.createUser(app, userData1);
      const { response: userResponse2 } = await TestHelpers.createUser(app, userData2);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse2);

      // 첫 번째 사용자의 휴대폰 번호로 변경 시도
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(accessToken))
        .send({ newPhone: userData1.phone })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 사용 중");
    });

    it("현재 휴대폰 번호와 같은 번호로 변경 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 현재 휴대폰 번호로 변경 시도
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(accessToken))
        .send({ newPhone: userData.phone })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 사용 중");
    });

    it("새 휴대폰 번호 인증 없이 변경 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse);

      const newPhone = TestDataFactory.createNewPhones()[0];

      // 인증 없이 휴대폰 번호 변경 시도
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(accessToken))
        .send({ newPhone })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });
  });

  describe("토큰 갱신 에러 시나리오", () => {
    it("유효하지 않은 refresh token으로 갱신 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "invalid_refresh_token" })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("유효하지 않은");
    });

    it("만료된 refresh token으로 갱신 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "expired_refresh_token" })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("유효하지 않은");
    });

    it("삭제된 사용자의 refresh token으로 갱신 시도", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { refreshToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 사용자 삭제
      await TestHelpers.deleteUserFromDatabase(userData.userId);

      // 삭제된 사용자의 refresh token으로 갱신 시도
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("유효하지 않은");
    });
  });

  describe("휴대폰 인증 에러 시나리오", () => {
    it("인증번호 발송 제한 초과", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      // 10회 연속으로 인증번호 발송 시도 (제한 초과)
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post("/auth/send-verification-code")
          .send({ phone })
          .expect(200);
      }

      // 11번째 시도 시 제한 초과
      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("제한");
    });

    it("이미 인증된 휴대폰 번호로 인증번호 발송 시도", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, phone);

      // 이미 인증된 번호로 다시 인증번호 발송 시도
      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 인증");
    });

    it("잘못된 인증번호로 확인 시도", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      // 인증번호 발송
      await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone })
        .expect(200);

      // 잘못된 인증번호로 확인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone,
          verificationCode: "654321", // 잘못된 인증번호
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("인증번호가 올바르지 않습니다");
    });

    it("인증번호 발송 없이 인증번호 확인 시도", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone,
          verificationCode: "123456",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("인증번호");
    });

    it("이미 인증된 휴대폰 번호로 인증번호 확인 시도", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, phone);

      // 이미 인증된 번호로 다시 인증번호 확인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone,
          verificationCode: "123456",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 인증");
    });
  });
});
