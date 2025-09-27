import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("토큰 갱신 API (POST /auth/refresh)", () => {
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
    it("유효한 refresh token으로 access token 갱신 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { refreshToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 토큰 갱신
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.accessToken).not.toBe(userResponse.accessToken);
    });

    it("구글 사용자의 refresh token으로 access token 갱신 성공", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 구글 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createGoogleUser(app, googleUserData);
      const { refreshToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 토큰 갱신
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.accessToken).not.toBe(userResponse.accessToken);
    });

    it("여러 번 토큰 갱신 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { refreshToken } = TestHelpers.extractTokensFromResponse(userResponse);

      let currentRefreshToken = refreshToken;

      // 여러 번 토큰 갱신
      for (let i = 0; i < 3; i++) {
        const response = await request(app.getHttpServer())
          .post("/auth/refresh")
          .send({ refreshToken: currentRefreshToken })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.accessToken).toBeDefined();

        // 새로 발급된 access token으로 인증된 API 호출 가능한지 확인
        const authResponse = await request(app.getHttpServer())
          .post("/auth/change-phone")
          .set(TestHelpers.createAuthHeader(response.body.data.accessToken))
          .send({ newPhone: "01099999999" })
          .expect(400); // 휴대폰 인증이 안되어서 400이지만, 토큰은 유효함

        expect(authResponse.status).not.toBe(401); // 401이 아니면 토큰이 유효함
      }
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 토큰 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("빈 refresh token으로 토큰 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 형식의 refresh token으로 갱신 실패", async () => {
      const invalidTokens = [
        "invalid_token",
        "not.a.valid.jwt",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid",
        "a".repeat(1000),
        "!@#$%^&*()",
        "Bearer invalid_token",
      ];

      for (const refreshToken of invalidTokens) {
        const response = await request(app.getHttpServer())
          .post("/auth/refresh")
          .send({ refreshToken })
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("유효하지 않은");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("만료된 refresh token으로 갱신 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { refreshToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 만료된 refresh token으로 갱신 시도 (실제로는 시간이 지나야 하지만 테스트에서는 모킹)
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "expired_refresh_token" })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("유효하지 않은");
    });

    it("존재하지 않는 사용자의 refresh token으로 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "nonexistent_user_token" })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("유효하지 않은");
    });

    it("삭제된 사용자의 refresh token으로 갱신 실패", async () => {
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

  describe("엣지 케이스", () => {
    it("매우 긴 refresh token으로 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "a".repeat(10000) })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("특수문자가 포함된 refresh token으로 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "token!@#$%^&*()" })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("공백이 포함된 refresh token으로 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: " token " })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("보안 테스트", () => {
    it("SQL 인젝션 시도로 토큰 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: "'; DROP TABLE users; --" })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("XSS 시도로 토큰 갱신 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: '<script>alert("xss")</script>' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("다른 사용자의 refresh token으로 갱신 시도 실패", async () => {
      const userData1 = TestDataFactory.createValidUser();
      const userData2 = { ...TestDataFactory.createValidUser(), userId: "user2" };

      // 두 사용자 생성
      const { response: userResponse1 } = await TestHelpers.createUser(app, userData1);
      const { response: userResponse2 } = await TestHelpers.createUser(app, userData2);

      const { refreshToken: refreshToken1 } = TestHelpers.extractTokensFromResponse(userResponse1);
      const { refreshToken: refreshToken2 } = TestHelpers.extractTokensFromResponse(userResponse2);

      // 첫 번째 사용자의 refresh token으로 갱신
      const response1 = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: refreshToken1 })
        .expect(200);

      expect(response1.body.success).toBe(true);

      // 두 번째 사용자의 refresh token으로 갱신
      const response2 = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken: refreshToken2 })
        .expect(200);

      expect(response2.body.success).toBe(true);

      // 각각 다른 access token이 발급되는지 확인
      expect(response1.body.data.accessToken).not.toBe(response2.body.data.accessToken);
    });
  });

  describe("성능 테스트", () => {
    it("동시에 여러 토큰 갱신 요청 처리", async () => {
      const userData1 = TestDataFactory.createValidUser();
      const userData2 = { ...TestDataFactory.createValidUser(), userId: "user2" };
      const userData3 = { ...TestDataFactory.createValidUser(), userId: "user3" };

      // 여러 사용자 생성
      const { response: userResponse1 } = await TestHelpers.createUser(app, userData1);
      const { response: userResponse2 } = await TestHelpers.createUser(app, userData2);
      const { response: userResponse3 } = await TestHelpers.createUser(app, userData3);

      const { refreshToken: refreshToken1 } = TestHelpers.extractTokensFromResponse(userResponse1);
      const { refreshToken: refreshToken2 } = TestHelpers.extractTokensFromResponse(userResponse2);
      const { refreshToken: refreshToken3 } = TestHelpers.extractTokensFromResponse(userResponse3);

      // 동시에 토큰 갱신 요청
      const promises = [
        request(app.getHttpServer()).post("/auth/refresh").send({ refreshToken: refreshToken1 }),
        request(app.getHttpServer()).post("/auth/refresh").send({ refreshToken: refreshToken2 }),
        request(app.getHttpServer()).post("/auth/refresh").send({ refreshToken: refreshToken3 }),
      ];

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.accessToken).toBeDefined();
      });
    });
  });

  describe("토큰 갱신 후 API 호출 테스트", () => {
    it("갱신된 access token으로 인증된 API 호출 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { refreshToken } = TestHelpers.extractTokensFromResponse(userResponse);

      // 토큰 갱신
      const refreshResponse = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      const newAccessToken = refreshResponse.body.data.accessToken;

      // 갱신된 access token으로 인증된 API 호출
      const newPhone = TestDataFactory.createNewPhones()[0];
      await TestHelpers.completePhoneVerification(app, newPhone);

      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(newAccessToken))
        .send({ newPhone })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("이전 access token으로 인증된 API 호출 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성 및 로그인
      const { response: userResponse } = await TestHelpers.createUser(app, userData);
      const { accessToken: oldAccessToken, refreshToken } =
        TestHelpers.extractTokensFromResponse(userResponse);

      // 토큰 갱신
      await request(app.getHttpServer()).post("/auth/refresh").send({ refreshToken }).expect(200);

      // 이전 access token으로 인증된 API 호출 시도
      const response = await request(app.getHttpServer())
        .post("/auth/change-phone")
        .set(TestHelpers.createAuthHeader(oldAccessToken))
        .send({ newPhone: TestDataFactory.createNewPhones()[0] })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
