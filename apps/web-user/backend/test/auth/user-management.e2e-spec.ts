import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("계정 찾기 API (POST /auth/find-account)", () => {
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

  describe("성공 케이스", () => {
    it("일반 계정 찾기 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 계정 찾기
      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone: userData.phone })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(userData.userId);
      expect(response.body.data.googleEmail).toBeUndefined();
    });

    it("구글 계정 찾기 성공", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData);

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, googleUserData.phone);

      // 계정 찾기
      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone: googleUserData.phone })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.googleEmail).toBe(googleUserData.googleEmail);
      expect(response.body.data.userId).toBeUndefined();
    });

    it("일반 계정과 구글 계정이 모두 있는 경우 찾기 성공", async () => {
      const phone = TestDataFactory.createValidUser().phone;
      const userData = { ...TestDataFactory.createValidUser(), phone };
      const googleUserData = { ...TestDataFactory.createGoogleUser(), phone };

      // 일반 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData);

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, phone);

      // 계정 찾기
      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(userData.userId);
      expect(response.body.data.googleEmail).toBe(googleUserData.googleEmail);
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 계정 찾기 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 휴대폰 번호로 계정 찾기 실패", async () => {
      const invalidPhones = TestDataFactory.createInvalidPhones();

      for (const phone of invalidPhones) {
        const response = await request(app.getHttpServer())
          .post("/auth/find-account")
          .send({ phone })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("휴대폰");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("휴대폰 인증이 완료되지 않은 상태로 계정 찾기 실패", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      const response = await request(app.getHttpServer())
        .post("/auth/find-account")
        .send({ phone })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });

    it("등록되지 않은 휴대폰 번호로 계정 찾기 실패", async () => {
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
  });
});

describe("비밀번호 변경 API (POST /auth/change-password)", () => {
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

  describe("성공 케이스", () => {
    it("유효한 정보로 비밀번호 변경 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 비밀번호 변경
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

      // 새 비밀번호로 로그인 가능한지 확인
      const loginResponse = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: newPassword,
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it("다양한 새 비밀번호로 변경 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      const newPasswords = TestDataFactory.createNewPasswords();

      for (const newPassword of newPasswords) {
        // 비밀번호 변경
        const response = await request(app.getHttpServer())
          .post("/auth/change-password")
          .send({
            userId: userData.userId,
            phone: userData.phone,
            newPassword,
          })
          .expect(200);

        expect(response.body.success).toBe(true);

        // 새 비밀번호로 로그인 가능한지 확인
        const loginResponse = await request(app.getHttpServer())
          .post("/auth/login")
          .send({
            userId: userData.userId,
            password: newPassword,
          })
          .expect(200);

        expect(loginResponse.body.success).toBe(true);
      }
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 비밀번호 변경 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/change-password")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 사용자 ID로 비밀번호 변경 실패", async () => {
      const invalidUserIds = TestDataFactory.createInvalidUserIds();

      for (const userId of invalidUserIds) {
        const response = await request(app.getHttpServer())
          .post("/auth/change-password")
          .send({
            userId,
            phone: TestDataFactory.createValidUser().phone,
            newPassword: TestDataFactory.createNewPasswords()[0],
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("사용자 ID");
      }
    });

    it("유효하지 않은 휴대폰 번호로 비밀번호 변경 실패", async () => {
      const invalidPhones = TestDataFactory.createInvalidPhones();

      for (const phone of invalidPhones) {
        const response = await request(app.getHttpServer())
          .post("/auth/change-password")
          .send({
            userId: TestDataFactory.createValidUser().userId,
            phone,
            newPassword: TestDataFactory.createNewPasswords()[0],
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("휴대폰");
      }
    });

    it("유효하지 않은 새 비밀번호로 비밀번호 변경 실패", async () => {
      const invalidPasswords = TestDataFactory.createInvalidPasswords();

      for (const newPassword of invalidPasswords) {
        const response = await request(app.getHttpServer())
          .post("/auth/change-password")
          .send({
            userId: TestDataFactory.createValidUser().userId,
            phone: TestDataFactory.createValidUser().phone,
            newPassword,
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("비밀번호");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("존재하지 않는 사용자 ID로 비밀번호 변경 실패", async () => {
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

    it("휴대폰 인증이 완료되지 않은 상태로 비밀번호 변경 실패", async () => {
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

    it("사용자 ID와 휴대폰 번호가 일치하지 않을 때 비밀번호 변경 실패", async () => {
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

    it("구글 계정으로 비밀번호 변경 시도 실패", async () => {
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
});

describe("휴대폰 번호 변경 API (POST /auth/change-phone)", () => {
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

  describe("성공 케이스", () => {
    it("유효한 정보로 휴대폰 번호 변경 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 새 휴대폰 번호 인증 완료
      const newPhone = TestDataFactory.createNewPhones()[0];
      await TestHelpers.completePhoneVerification(app, newPhone);

      // 휴대폰 번호 변경
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(accessToken))
        .send({ newPhone })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("휴대폰 번호가 변경되었습니다");

      // 데이터베이스에서 휴대폰 번호가 변경되었는지 확인
      const updatedUser = await TestHelpers.getUserFromDatabase(userData.userId);
      expect(updatedUser?.phone).toBe(newPhone);
    });

    it("다양한 새 휴대폰 번호로 변경 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse);

      const newPhones = TestDataFactory.createNewPhones();

      for (const newPhone of newPhones) {
        // 새 휴대폰 번호 인증 완료
        await TestHelpers.completePhoneVerification(app, newPhone);

        // 휴대폰 번호 변경
        const response = await request(app.getHttpServer())
          .post("/auth/change-phone")
          .set(TestHelpers.createAuthHeader(accessToken))
          .send({ newPhone })
          .expect(200);

        expect(response.body.success).toBe(true);

        // 데이터베이스에서 휴대폰 번호가 변경되었는지 확인
        const updatedUser = await TestHelpers.getUserFromDatabase(userData.userId);
        expect(updatedUser?.phone).toBe(newPhone);
      }
    });
  });

  describe("실패 케이스 - 인증", () => {
    it("인증 토큰 없이 휴대폰 번호 변경 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .send({ newPhone: TestDataFactory.createNewPhones()[0] })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 인증 토큰으로 휴대폰 번호 변경 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader("invalid_token"))
        .send({ newPhone: TestDataFactory.createNewPhones()[0] })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 휴대폰 번호 변경 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse);

      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(accessToken))
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 새 휴대폰 번호로 변경 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken } = TestHelpers.extractTokensFromResponse(userResponse);

      const invalidPhones = TestDataFactory.createInvalidPhones();

      for (const newPhone of invalidPhones) {
        const response = await request(app.getHttpServer())
          .post("/auth/change-phone")
          .set(TestHelpers.createAuthHeader(accessToken))
          .send({ newPhone })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("휴대폰");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("새 휴대폰 번호 인증이 완료되지 않은 상태로 변경 실패", async () => {
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

    it("이미 사용 중인 휴대폰 번호로 변경 실패", async () => {
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

    it("현재 휴대폰 번호와 같은 번호로 변경 실패", async () => {
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
  });
});
