import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("ID 중복 확인 API (GET /auth/check-user-id)", () => {
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
    it("사용 가능한 사용자 ID 확인 성공", async () => {
      const userId = TestDataFactory.createValidUser().userId;

      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(true);
    });

    it("다양한 사용 가능한 사용자 ID 확인 성공", async () => {
      const testUserIds = TestDataFactory.createTestUserIds();

      for (const userId of testUserIds) {
        const response = await request(app.getHttpServer())
          .get("/auth/check-user-id")
          .query({ userId })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.available).toBe(true);
      }
    });

    it("이미 존재하는 사용자 ID 확인 성공 (사용 불가능)", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // ID 중복 확인
      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: userData.userId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(false);
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("쿼리 파라미터 없이 요청 시 실패", async () => {
      const response = await request(app.getHttpServer()).get("/auth/check-user-id").expect(400);

      expect(response.body.success).toBe(false);
    });

    it("빈 사용자 ID로 확인 시 실패", async () => {
      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: "" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("사용자 ID");
    });

    it("유효하지 않은 사용자 ID로 확인 시 실패", async () => {
      const invalidUserIds = TestDataFactory.createInvalidUserIds();

      for (const userId of invalidUserIds) {
        const response = await request(app.getHttpServer())
          .get("/auth/check-user-id")
          .query({ userId })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("사용자 ID");
      }
    });
  });

  describe("엣지 케이스", () => {
    it("최소 길이 사용자 ID 확인 성공", async () => {
      const userId = "ab"; // 최소 길이

      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(true);
    });

    it("최대 길이 사용자 ID 확인 성공", async () => {
      const userId = "a".repeat(20); // 최대 길이

      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(true);
    });

    it("대소문자 구분하여 확인", async () => {
      const userData = TestDataFactory.createValidUser();

      // 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 대문자로 확인
      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: userData.userId.toUpperCase() })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.available).toBe(true); // 대소문자 구분하므로 사용 가능
    });

    it("공백이 포함된 사용자 ID로 확인 시 실패", async () => {
      const userId = " testuser "; // 앞뒤 공백

      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("보안 테스트", () => {
    it("SQL 인젝션 시도로 확인 실패", async () => {
      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: "'; DROP TABLE users; --" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("XSS 시도로 확인 실패", async () => {
      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: '<script>alert("xss")</script>' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("특수문자가 포함된 사용자 ID로 확인 시 실패", async () => {
      const response = await request(app.getHttpServer())
        .get("/auth/check-user-id")
        .query({ userId: "test@user" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("성능 테스트", () => {
    it("동시에 여러 ID 중복 확인 요청 처리", async () => {
      const userIds = TestDataFactory.createTestUserIds();

      const promises = userIds.map((userId) =>
        request(app.getHttpServer()).get("/auth/check-user-id").query({ userId }),
      );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.available).toBe(true);
      });
    });
  });
});
