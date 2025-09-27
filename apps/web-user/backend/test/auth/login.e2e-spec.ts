import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("일반 로그인 API (POST /auth/login)", () => {
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
    it("유효한 아이디와 비밀번호로 로그인 성공", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 로그인
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: userData.password,
        })
        .expect(200);

      TestHelpers.expectUserDataResponse(response, userData.userId);
    });

    it("다양한 사용자로 로그인 성공", async () => {
      const testUserIds = TestDataFactory.createTestUserIds();

      for (const userId of testUserIds) {
        const userData = {
          ...TestDataFactory.createValidUser(),
          userId,
          phone: `010${Math.random().toString().slice(2, 10)}`,
        };

        // 사용자 생성
        await TestHelpers.createUser(app, userData);

        // 로그인
        const response = await request(app.getHttpServer())
          .post("/auth/login")
          .send({
            userId: userData.userId,
            password: userData.password,
          })
          .expect(200);

        TestHelpers.expectUserDataResponse(response, userData.userId);
      }
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 로그인 실패", async () => {
      const response = await request(app.getHttpServer()).post("/auth/login").send({}).expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 사용자 ID로 로그인 실패", async () => {
      const invalidUserIds = TestDataFactory.createInvalidUserIds();

      for (const userId of invalidUserIds) {
        const response = await request(app.getHttpServer())
          .post("/auth/login")
          .send({
            userId,
            password: TestDataFactory.createValidUser().password,
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("사용자 ID");
      }
    });

    it("유효하지 않은 비밀번호로 로그인 실패", async () => {
      const invalidPasswords = TestDataFactory.createInvalidPasswords();

      for (const password of invalidPasswords) {
        const response = await request(app.getHttpServer())
          .post("/auth/login")
          .send({
            userId: TestDataFactory.createValidUser().userId,
            password,
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("비밀번호");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("존재하지 않는 사용자 ID로 로그인 실패", async () => {
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

    it("잘못된 비밀번호로 로그인 실패", async () => {
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

    it("휴대폰 인증이 완료되지 않은 사용자로 로그인 실패", async () => {
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

    it("구글 계정으로 일반 로그인 시도 실패", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData);

      // 일반 로그인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: googleUserData.googleId, // 구글 ID로 시도
          password: "SomePassword123!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("계정을 찾을 수 없습니다");
    });
  });

  describe("엣지 케이스", () => {
    it("대소문자 구분하여 로그인", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 대문자로 로그인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId.toUpperCase(),
          password: userData.password,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("공백이 포함된 사용자 ID로 로그인 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 공백이 포함된 ID로 로그인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: ` ${userData.userId} `, // 앞뒤 공백
          password: userData.password,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("공백이 포함된 비밀번호로 로그인 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 공백이 포함된 비밀번호로 로그인 시도
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: userData.userId,
          password: ` ${userData.password} `, // 앞뒤 공백
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("보안 테스트", () => {
    it("SQL 인젝션 시도로 로그인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: "'; DROP TABLE users; --",
          password: "SomePassword123!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("XSS 시도로 로그인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: '<script>alert("xss")</script>',
          password: "SomePassword123!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("빈 문자열로 로그인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          userId: "",
          password: "",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
