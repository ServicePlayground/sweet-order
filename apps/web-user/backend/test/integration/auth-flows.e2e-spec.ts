import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("인증 플로우 통합 테스트", () => {
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

  describe("플로우 1: 일반 회원가입 - 휴대폰 인증 완료 후 회원가입", () => {
    it("1-1. 휴대폰 인증이 완료되지 않은 상태에서 회원가입", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. ID 중복 확인
      await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: userData.userId })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.available).toBe(true);
        });

      // 2. 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 3. 회원가입
      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(userData)
        .expect(201);

      TestHelpers.expectUserDataResponse(response, userData.userId);

      // 4. 데이터베이스에 사용자가 생성되었는지 확인
      const createdUser = await TestHelpers.getUserFromDatabase(userData.userId);
      expect(createdUser).toBeDefined();
      expect(createdUser?.phoneVerified).toBe(true);
    });

    it("1-2. 휴대폰 인증이 이미 완료된 상태에서 회원가입", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. ID 중복 확인
      await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: userData.userId })
        .expect(200);

      // 2. 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 3. 회원가입
      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(userData)
        .expect(201);

      TestHelpers.expectUserDataResponse(response, userData.userId);
    });
  });

  describe("플로우 2: 일반 로그인", () => {
    it("2-1. 유효한 아이디/비밀번호로 로그인", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 2. 로그인
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: userData.password,
        })
        .expect(200);

      TestHelpers.expectUserDataResponse(response, userData.userId);
    });
  });

  describe("플로우 3: 소셜 로그인 - 등록되지 않은 사용자", () => {
    it("3-1. 등록되지 않은 구글 사용자로 로그인 시도", async () => {
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
  });

  describe("플로우 4: 소셜 로그인 - 휴대폰 인증 미완료", () => {
    it("4-1. 휴대폰 인증이 완료되지 않은 구글 사용자로 로그인 시도", async () => {
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
  });

  describe("플로우 5: 소셜 로그인 - 성공", () => {
    it("5-1. 휴대폰 인증이 완료된 구글 사용자로 로그인", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 구글 사용자 생성 (휴대폰 인증 완료)
      await TestHelpers.createGoogleUser(app, googleUserData);

      // 구글 로그인
      const response = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({
          code: "valid_google_code",
        })
        .expect(200);

      TestHelpers.expectUserDataResponse(response);
      expect(response.body.data.googleId).toBe(googleUserData.googleId);
      expect(response.body.data.googleEmail).toBe(googleUserData.googleEmail);
    });
  });

  describe("플로우 6: 소셜 회원가입 - 새 사용자", () => {
    it("6-1. 등록되지 않은 구글 사용자의 회원가입", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 1. 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, googleUserData.phone);

      // 2. 구글 회원가입
      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(201);

      TestHelpers.expectUserDataResponse(response);
      expect(response.body.data.googleId).toBe(googleUserData.googleId);
      expect(response.body.data.googleEmail).toBe(googleUserData.googleEmail);
    });
  });

  describe("플로우 7: 소셜 회원가입 - 휴대폰 중복", () => {
    it("7-1. 이미 사용 중인 휴대폰 번호로 구글 회원가입", async () => {
      const userData = TestDataFactory.createValidUser();
      const googleUserData = TestDataFactory.createGoogleUser();

      // 1. 일반 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 2. 같은 휴대폰 번호로 구글 회원가입 시도
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
  });

  describe("플로우 8: 계정 찾기", () => {
    it("8-1. 휴대폰 인증을 통한 계정 찾기", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 2. 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 3. 계정 찾기
      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone: userData.phone })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(userData.userId);
    });
  });

  describe("플로우 9: 비밀번호 변경", () => {
    it("9-1. 휴대폰 인증을 통한 비밀번호 변경", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 2. 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 3. 비밀번호 변경
      const newPassword = TestDataFactory.createNewPasswords()[0];
      const response = await request(app.getHttpServer())
        .post("/auth/change-password")
        .send({
          userId: userData.userId,
          phone: userData.phone,
          newPassword,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("비밀번호가 변경되었습니다");

      // 4. 새 비밀번호로 로그인 가능한지 확인
      const loginResponse = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: newPassword,
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });
  });

  describe("플로우 10: 휴대폰 번호 변경", () => {
    it("10-1. 인증된 사용자의 휴대폰 번호 변경", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 2. 새 휴대폰 번호 인증 완료
      const newPhone = TestDataFactory.createNewPhones()[0];
      await TestHelpers.completePhoneVerification(app, newPhone);

      // 3. 휴대폰 번호 변경
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(accessToken))
        .send({ newPhone })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("휴대폰 번호가 변경되었습니다");

      // 4. 데이터베이스에서 휴대폰 번호가 변경되었는지 확인
      const updatedUser = await TestHelpers.getUserFromDatabase(userData.userId);
      expect(updatedUser?.phone).toBe(newPhone);
    });
  });

  describe("플로우 11: 토큰 갱신 - 성공", () => {
    it("11-1. 유효한 refresh token으로 access token 갱신", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { refreshToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 2. 토큰 갱신
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();

      // 3. 갱신된 access token으로 인증된 API 호출
      const newPhone = TestDataFactory.createNewPhones()[0];
      await TestHelpers.completePhoneVerification(app, newPhone);

      const authResponse = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(response.body.data.accessToken))
        .send({ newPhone })
        .expect(200);

      expect(authResponse.body.success).toBe(true);
    });
  });

  describe("플로우 12: 토큰 갱신 - 실패", () => {
    it("12-1. 유효하지 않은 refresh token으로 갱신 시도", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "invalid_refresh_token" })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("유효하지 않은");
    });
  });

  describe("복합 플로우 테스트", () => {
    it("전체 사용자 생명주기 테스트", async () => {
      const userData = TestDataFactory.createValidUser();

      // 1. ID 중복 확인
      await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: userData.userId })
        .expect(200);

      // 2. 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 3. 회원가입
      const { response: registerResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken, refreshToken } = TestHelpers.extractTokensFromResponse(registerResponse);

      // 4. 로그인
      const loginResponse = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: userData.password,
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);

      // 5. 토큰 갱신
      const refreshResponse = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(refreshResponse.body.success).toBe(true);

      // 6. 비밀번호 변경
      const newPassword = TestDataFactory.createNewPasswords()[0];
      await request(app.getHttpServer())
        .post("/auth/change-password")
        .send({
          userId: userData.userId,
          phone: userData.phone,
          newPassword,
        })
        .expect(200);

      // 7. 새 비밀번호로 로그인
      const newLoginResponse = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: newPassword,
        })
        .expect(200);

      expect(newLoginResponse.body.success).toBe(true);

      // 8. 휴대폰 번호 변경
      const newPhone = TestDataFactory.createNewPhones()[0];
      await TestHelpers.completePhoneVerification(app, newPhone);

      const { accessToken: newAccessToken } =
        TestHelpers.extractTokensFromResponse(newLoginResponse);

      await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(newAccessToken))
        .send({ newPhone })
        .expect(200);

      // 9. 계정 찾기
      await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone: newPhone })
        .expect(200);
    });

    it("구글 사용자 전체 생명주기 테스트", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 1. 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, googleUserData.phone);

      // 2. 구글 회원가입
      const { response: registerResponse } = await TestHelpers.createGoogleUser(
        app,
        googleUserData,
      );
      const { accessToken, refreshToken } = TestHelpers.extractTokensFromResponse(registerResponse);

      // 3. 구글 로그인
      const loginResponse = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({
          code: "valid_google_code",
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);

      // 4. 토큰 갱신
      const refreshResponse = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(refreshResponse.body.success).toBe(true);

      // 5. 휴대폰 번호 변경
      const newPhone = TestDataFactory.createNewPhones()[0];
      await TestHelpers.completePhoneVerification(app, newPhone);

      const { accessToken: newAccessToken } = TestHelpers.extractTokensFromResponse(loginResponse);

      await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(newAccessToken))
        .send({ newPhone })
        .expect(200);

      // 6. 계정 찾기
      await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone: newPhone })
        .expect(200);
    });
  });
});
