import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { TestDataFactory } from "../utils/test-data.factory";
import { TestHelpers } from "../utils/test-helpers";
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

describe("휴대폰 인증번호 발송 API (POST /auth/send-verification-code)", () => {
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
    it("유효한 휴대폰 번호로 인증번호 발송 성공", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("인증번호가 발송되었습니다");
    });

    it("다양한 유효한 휴대폰 번호로 인증번호 발송 성공", async () => {
      const testPhones = TestDataFactory.createTestPhones();

      for (const phone of testPhones) {
        const response = await request(app.getHttpServer())
          .post("/auth/send-verification-code")
          .send({ phone })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain("인증번호가 발송되었습니다");
      }
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 인증번호 발송 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 휴대폰 번호로 인증번호 발송 실패", async () => {
      const invalidPhones = TestDataFactory.createInvalidPhones();

      for (const phone of invalidPhones) {
        const response = await request(app.getHttpServer())
          .post("/auth/send-verification-code")
          .send({ phone })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("휴대폰");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("이미 인증된 휴대폰 번호로 인증번호 발송 실패", async () => {
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

    it("인증번호 발송 제한 초과 시 실패", async () => {
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
  });

  describe("엣지 케이스", () => {
    it("공백이 포함된 휴대폰 번호로 인증번호 발송 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone: " 01012345678 " })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("특수문자가 포함된 휴대폰 번호로 인증번호 발송 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone: "010-1234-5678" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("보안 테스트", () => {
    it("SQL 인젝션 시도로 인증번호 발송 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone: "'; DROP TABLE users; --" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("XSS 시도로 인증번호 발송 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone: '<script>alert("xss")</script>' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});

describe("휴대폰 인증번호 확인 API (POST /auth/verify-phone-code)", () => {
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
    it("유효한 인증번호로 휴대폰 인증 성공", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      // 1. 인증번호 발송
      await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone })
        .expect(200);

      // 2. 인증번호 확인
      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone,
          verificationCode: "123456",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("인증이 완료되었습니다");
    });

    it("다양한 휴대폰 번호로 인증 성공", async () => {
      const testPhones = TestDataFactory.createTestPhones();

      for (const phone of testPhones) {
        // 인증번호 발송
        await request(app.getHttpServer())
          .post("/auth/send-verification-code")
          .send({ phone })
          .expect(200);

        // 인증번호 확인
        const response = await request(app.getHttpServer())
          .post("/auth/verify-phone-code")
          .send({
            phone,
            verificationCode: "123456",
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      }
    });
  });

  describe("실패 케이스 - 유효성 검증", () => {
    it("빈 요청 본문으로 인증번호 확인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("유효하지 않은 휴대폰 번호로 인증번호 확인 실패", async () => {
      const invalidPhones = TestDataFactory.createInvalidPhones();

      for (const phone of invalidPhones) {
        const response = await request(app.getHttpServer())
          .post("/auth/verify-phone-code")
          .send({
            phone,
            verificationCode: "123456",
          })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("휴대폰");
      }
    });

    it("유효하지 않은 인증번호로 인증번호 확인 실패", async () => {
      const phone = TestDataFactory.createValidUser().phone;
      const invalidCodes = TestDataFactory.createInvalidVerificationCodes();

      // 인증번호 발송
      await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone })
        .expect(200);

      for (const verificationCode of invalidCodes) {
        const response = await request(app.getHttpServer())
          .post("/auth/verify-phone-code")
          .send({ phone, verificationCode })
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("인증번호");
      }
    });
  });

  describe("실패 케이스 - 비즈니스 로직", () => {
    it("인증번호 발송 없이 인증번호 확인 시 실패", async () => {
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

    it("잘못된 인증번호로 인증번호 확인 시 실패", async () => {
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

    it("이미 인증된 휴대폰 번호로 인증번호 확인 시 실패", async () => {
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

    it("만료된 인증번호로 인증번호 확인 시 실패", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      // 인증번호 발송
      await request(app.getHttpServer())
        .post("/auth/send-verification-code")
        .send({ phone })
        .expect(200);

      // 만료된 인증번호로 확인 시도 (실제로는 시간이 지나야 하지만 테스트에서는 모킹)
      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone,
          verificationCode: "123456",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("만료");
    });
  });

  describe("엣지 케이스", () => {
    it("공백이 포함된 인증번호로 확인 시 실패", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone,
          verificationCode: " 123456 ",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("특수문자가 포함된 인증번호로 확인 시 실패", async () => {
      const phone = TestDataFactory.createValidUser().phone;

      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone,
          verificationCode: "12345!",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("보안 테스트", () => {
    it("SQL 인젝션 시도로 인증번호 확인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone: "'; DROP TABLE users; --",
          verificationCode: "123456",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("XSS 시도로 인증번호 확인 실패", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/verify-phone-code")
        .send({
          phone: '<script>alert("xss")</script>',
          verificationCode: "123456",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("성능 테스트", () => {
    it("동시에 여러 휴대폰 인증 요청 처리", async () => {
      const testPhones = TestDataFactory.createTestPhones();

      // 모든 휴대폰에 인증번호 발송
      const sendPromises = testPhones.map((phone) =>
        request(app.getHttpServer()).post("/auth/send-verification-code").send({ phone }),
      );

      await Promise.all(sendPromises);

      // 모든 휴대폰 인증번호 확인
      const verifyPromises = testPhones.map((phone) =>
        request(app.getHttpServer())
          .post("/auth/verify-phone-code")
          .send({ phone, verificationCode: "123456" }),
      );

      const responses = await Promise.all(verifyPromises);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });
});
