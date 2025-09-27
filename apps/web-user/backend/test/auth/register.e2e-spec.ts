import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("일반 회원가입 API (POST /auth/register)", () => {
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
    it("유효한 데이터로 회원가입 성공", async () => {
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
      expect(createdUser?.userId).toBe(userData.userId);
      expect(createdUser?.phone).toBe(userData.phone);
      expect(createdUser?.phoneVerified).toBe(true);
    });

    it("다양한 유효한 사용자 ID로 회원가입 성공", async () => {
      const testUserIds = TestDataFactory.createTestUserIds();

      for (const userId of testUserIds) {
        const userData = {
          ...TestDataFactory.createValidUser(),
          userId,
          phone: `010${Math.random().toString().slice(2, 10)}`,
        };

        // ID 중복 확인
        await request(app.getHttpServer()).get("/auth/check-user-id").query({ userId }).expect(200);

        // 휴대폰 인증 완료
        await TestHelpers.completePhoneVerification(app, userData.phone);

        // 회원가입
        const response = await request(app.getHttpServer())
          .post("/auth/register")
          .send(userData)
          .expect(201);

        TestHelpers.expectUserDataResponse(response, userId);
      }
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 회원가입 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 사용자 ID로 회원가입 실패", async () => {
      const invalidUserIds = TestDataFactory.createInvalidUserIds();

      for (const userId of invalidUserIds) {
        const userData = {
          ...TestDataFactory.createValidUser(),
          userId,
        };

        const response = await request(app.getHttpServer())
          .post("/auth/register")
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("사용자 ID");
      }
    });

    it("유효하지 않은 비밀번호로 회원가입 실패", async () => {
      const invalidPasswords = TestDataFactory.createInvalidPasswords();

      for (const password of invalidPasswords) {
        const userData = {
          ...TestDataFactory.createValidUser(),
          password,
        };

        const response = await request(app.getHttpServer())
          .post("/auth/register")
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("비밀번호");
      }
    });

    it("유효하지 않은 휴대폰 번호로 회원가입 실패", async () => {
      const invalidPhones = TestDataFactory.createInvalidPhones();

      for (const phone of invalidPhones) {
        const userData = {
          ...TestDataFactory.createValidUser(),
          phone,
        };

        const response = await request(app.getHttpServer())
          .post("/auth/register")
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("휴대폰");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("중복된 사용자 ID로 회원가입 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 첫 번째 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 두 번째 사용자 생성 시도 (같은 ID)
      const duplicateUserData = {
        ...userData,
        phone: "01087654321", // 다른 휴대폰 번호
      };

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, duplicateUserData.phone);

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(duplicateUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 존재");
    });

    it("중복된 휴대폰 번호로 회원가입 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 첫 번째 사용자 생성
      await TestHelpers.createUser(app, userData);

      // 두 번째 사용자 생성 시도 (같은 휴대폰 번호)
      const duplicateUserData = {
        ...userData,
        userId: "anotheruser123", // 다른 사용자 ID
      };

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(duplicateUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰");
    });

    it("휴대폰 인증이 완료되지 않은 상태로 회원가입 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 휴대폰 인증 없이 회원가입 시도
      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });

    it("이미 구글 계정으로 등록된 휴대폰 번호로 일반 회원가입 실패", async () => {
      const userData = TestDataFactory.createValidUser();

      // 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, {
        ...TestDataFactory.createGoogleUser(),
        phone: userData.phone,
      });

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, userData.phone);

      // 일반 회원가입 시도
      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("구글 계정");
    });
  });

  describe("엣지 케이스", () => {
    it("최소 길이 사용자 ID로 회원가입 성공", async () => {
      const userData = {
        ...TestDataFactory.createValidUser(),
        userId: "ab", // 최소 길이
      };

      await TestHelpers.createUser(app, userData);
    });

    it("최대 길이 사용자 ID로 회원가입 성공", async () => {
      const userData = {
        ...TestDataFactory.createValidUser(),
        userId: "a".repeat(20), // 최대 길이
      };

      await TestHelpers.createUser(app, userData);
    });

    it("최소 길이 비밀번호로 회원가입 성공", async () => {
      const userData = {
        ...TestDataFactory.createValidUser(),
        password: "Ab1!@#$", // 최소 길이
      };

      await TestHelpers.createUser(app, userData);
    });

    it("최대 길이 비밀번호로 회원가입 성공", async () => {
      const userData = {
        ...TestDataFactory.createValidUser(),
        password: "Ab1!@#$" + "a".repeat(94), // 최대 길이
      };

      await TestHelpers.createUser(app, userData);
    });
  });
});
