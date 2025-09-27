import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("구글 로그인 API (POST /auth/google/login)", () => {
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
    it("유효한 구글 코드로 로그인 성공 (휴대폰 인증 완료된 사용자)", async () => {
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

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 구글 로그인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 구글 코드로 로그인 실패", async () => {
      const invalidCodes = TestDataFactory.createInvalidGoogleCodes();

      for (const code of invalidCodes) {
        const response = await request(app.getHttpServer())
          .post("/auth/google/login")
          .send({ code })
          .expect(400);

        expect(response.body.success).toBe(false);
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("등록되지 않은 구글 사용자로 로그인 실패 (새 사용자)", async () => {
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

    it("휴대폰 인증이 완료되지 않은 구글 사용자로 로그인 실패", async () => {
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

    it("잘못된 구글 코드로 로그인 실패", async () => {
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

  describe("엣지 케이스", () => {
    it("매우 긴 구글 코드로 로그인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({
          code: "a".repeat(10000),
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("특수문자가 포함된 구글 코드로 로그인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/google/login")
        .send({
          code: "code!@#$%^&*()",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});

describe("구글 회원가입 API (POST /auth/google/register)", () => {
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
    it("유효한 구글 정보로 회원가입 성공", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, googleUserData.phone);

      // 구글 회원가입
      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(201);

      TestHelpers.expectUserDataResponse(response);
      expect(response.body.data.googleId).toBe(googleUserData.googleId);
      expect(response.body.data.googleEmail).toBe(googleUserData.googleEmail);
      expect(response.body.data.phone).toBe(googleUserData.phone);
    });

    it("다양한 구글 사용자로 회원가입 성공", async () => {
      const testPhones = TestDataFactory.createTestPhones();

      for (let i = 0; i < testPhones.length; i++) {
        const googleUserData = {
          ...TestDataFactory.createGoogleUser(),
          googleId: `google${i}123456789`,
          googleEmail: `test${i}@gmail.com`,
          phone: testPhones[i],
        };

        // 휴대폰 인증 완료
        await TestHelpers.completePhoneVerification(app, googleUserData.phone);

        // 구글 회원가입
        const response = await request(app.getHttpServer())
          .post("/auth/google/register")
          .send(googleUserData)
          .expect(201);

        TestHelpers.expectUserDataResponse(response);
      }
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 구글 회원가입 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 구글 ID로 회원가입 실패", async () => {
      const googleUserData = {
        ...TestDataFactory.createGoogleUser(),
        googleId: "", // 빈 구글 ID
      };

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 구글 이메일로 회원가입 실패", async () => {
      const googleUserData = {
        ...TestDataFactory.createGoogleUser(),
        googleEmail: "invalid-email", // 잘못된 이메일 형식
      };

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 휴대폰 번호로 구글 회원가입 실패", async () => {
      const invalidPhones = TestDataFactory.createInvalidPhones();

      for (const phone of invalidPhones) {
        const googleUserData = {
          ...TestDataFactory.createGoogleUser(),
          phone,
        };

        const response = await request(app.getHttpServer())
          .post("/auth/google/register")
          .send(googleUserData)
          .expect(400);

        expect(response.body.success).toBe(false);
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("휴대폰 인증이 완료되지 않은 상태로 구글 회원가입 실패", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 휴대폰 인증 없이 구글 회원가입 시도
      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰 인증");
    });

    it("중복된 구글 ID로 회원가입 실패", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 첫 번째 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData);

      // 두 번째 구글 사용자 생성 시도 (같은 구글 ID)
      const duplicateGoogleUserData = {
        ...googleUserData,
        phone: "01087654321", // 다른 휴대폰 번호
      };

      // 휴대폰 인증 완료
      await TestHelpers.completePhoneVerification(app, duplicateGoogleUserData.phone);

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(duplicateGoogleUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("이미 존재");
    });

    it("중복된 휴대폰 번호로 구글 회원가입 실패", async () => {
      const googleUserData = TestDataFactory.createGoogleUser();

      // 첫 번째 구글 사용자 생성
      await TestHelpers.createGoogleUser(app, googleUserData);

      // 두 번째 구글 사용자 생성 시도 (같은 휴대폰 번호)
      const duplicateGoogleUserData = {
        ...googleUserData,
        googleId: "anothergoogle123456789", // 다른 구글 ID
      };

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(duplicateGoogleUserData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("휴대폰");
    });

    it("이미 일반 계정으로 등록된 휴대폰 번호로 구글 회원가입 실패", async () => {
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
  });

  describe("엣지 케이스", () => {
    it("매우 긴 구글 ID로 회원가입 실패", async () => {
      const googleUserData = {
        ...TestDataFactory.createGoogleUser(),
        googleId: "a".repeat(1000),
      };

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("매우 긴 구글 이메일로 회원가입 실패", async () => {
      const googleUserData = {
        ...TestDataFactory.createGoogleUser(),
        googleEmail: "a".repeat(1000) + "@gmail.com",
      };

      const response = await request(app.getHttpServer())
        .post("/auth/google/register")
        .send(googleUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
