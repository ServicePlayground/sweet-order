import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { TestDataFactory } from "./test-data.factory";

/**
 * 테스트 헬퍼 유틸리티
 * 테스트에서 자주 사용되는 공통 기능들을 제공
 */

export class TestHelpers {
  private static prisma = new PrismaClient();

  /**
   * 휴대폰 인증을 완료하는 헬퍼 함수
   */
  static async completePhoneVerification(app: INestApplication, phone: string) {
    // 1. 인증번호 발송
    await request(app.getHttpServer())
      .post("/auth/send-verification-code")
      .send({ phone })
      .expect(200);

    // 2. 인증번호 확인 (테스트 환경에서는 실제 SMS를 보내지 않으므로 모킹 필요)
    // 실제 구현에서는 테스트용 인증번호를 사용하거나 모킹해야 함
    const verificationCode = "123456"; // 테스트용 고정 인증번호

    await request(app.getHttpServer())
      .post("/auth/verify-phone-code")
      .send({
        phone,
        verificationCode,
      })
      .expect(200);
  }

  /**
   * 일반 사용자를 생성하는 헬퍼 함수
   */
  static async createUser(app: INestApplication, userData?: any) {
    const user = userData || TestDataFactory.createValidUser();

    // 1. ID 중복 확인
    await request(app.getHttpServer())
      .get("/auth/check-user-id")
      .query({ userId: user.userId })
      .expect(200);

    // 2. 휴대폰 인증 완료
    await this.completePhoneVerification(app, user.phone);

    // 3. 회원가입
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send(user)
      .expect(201);

    return {
      user,
      response: response.body,
    };
  }

  /**
   * 구글 사용자를 생성하는 헬퍼 함수
   */
  static async createGoogleUser(app: INestApplication, googleData?: any) {
    const googleUser = googleData || TestDataFactory.createGoogleUser();

    // 1. 휴대폰 인증 완료
    await this.completePhoneVerification(app, googleUser.phone);

    // 2. 구글 회원가입
    const response = await request(app.getHttpServer())
      .post("/auth/google/register")
      .send(googleUser)
      .expect(201);

    return {
      user: googleUser,
      response: response.body,
    };
  }

  /**
   * 로그인을 수행하는 헬퍼 함수
   */
  static async loginUser(app: INestApplication, userId: string, password: string) {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ userId, password })
      .expect(200);

    return response.body;
  }

  /**
   * 구글 로그인을 수행하는 헬퍼 함수 (모킹된 코드 사용)
   */
  static async loginGoogleUser(app: INestApplication, code: string = "mock_google_code") {
    const response = await request(app.getHttpServer())
      .post("/auth/google/login")
      .send({ code })
      .expect(200);

    return response.body;
  }

  /**
   * 데이터베이스에서 사용자를 직접 생성하는 헬퍼 함수
   */
  static async createUserInDatabase(userData: any) {
    return await this.prisma.user.create({
      data: {
        userId: userData.userId,
        passwordHash: userData.password, // 실제로는 해시화되어야 함
        phone: userData.phone,
        isPhoneVerified: true,
        googleId: userData.googleId || null,
        googleEmail: userData.googleEmail || null,
      },
    });
  }

  /**
   * 데이터베이스에서 휴대폰 인증 정보를 생성하는 헬퍼 함수
   */
  static async createPhoneVerificationInDatabase(phone: string, verified: boolean = true) {
    return await this.prisma.phoneVerification.create({
      data: {
        phone,
        verificationCode: "123456",
        isVerified: verified,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10분 후 만료
      },
    });
  }

  /**
   * 데이터베이스 정리 헬퍼 함수
   */
  static async cleanupDatabase() {
    await this.prisma.user.deleteMany();
    await this.prisma.phoneVerification.deleteMany();
  }

  /**
   * 특정 사용자를 데이터베이스에서 삭제하는 헬퍼 함수
   */
  static async deleteUserFromDatabase(userId: string) {
    await this.prisma.user.deleteMany({
      where: { userId },
    });
  }

  /**
   * 특정 휴대폰 번호의 인증 정보를 삭제하는 헬퍼 함수
   */
  static async deletePhoneVerificationFromDatabase(phone: string) {
    await this.prisma.phoneVerification.deleteMany({
      where: { phone },
    });
  }

  /**
   * 데이터베이스에서 사용자 정보를 조회하는 헬퍼 함수
   */
  static async getUserFromDatabase(userId: string) {
    return await this.prisma.user.findUnique({
      where: { userId },
    });
  }

  /**
   * 데이터베이스에서 휴대폰 인증 정보를 조회하는 헬퍼 함수
   */
  static async getPhoneVerificationFromDatabase(phone: string) {
    return await this.prisma.phoneVerification.findFirst({
      where: { phone },
    });
  }

  /**
   * JWT 토큰을 추출하는 헬퍼 함수
   */
  static extractTokensFromResponse(response: any) {
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };
  }

  /**
   * 인증 헤더를 생성하는 헬퍼 함수
   */
  static createAuthHeader(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  /**
   * 에러 응답을 검증하는 헬퍼 함수
   */
  static expectErrorResponse(response: any, expectedStatus: number, expectedMessage?: string) {
    expect(response.status).toBe(expectedStatus);
    if (expectedMessage) {
      expect(response.body.message).toContain(expectedMessage);
    }
  }

  /**
   * 성공 응답을 검증하는 헬퍼 함수
   */
  static expectSuccessResponse(response: any, expectedStatus: number) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body.success).toBe(true);
  }

  /**
   * 사용자 데이터 응답을 검증하는 헬퍼 함수
   */
  static expectUserDataResponse(response: any, expectedUserId?: string) {
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();

    if (expectedUserId) {
      expect(response.body.data.userId).toBe(expectedUserId);
    }
  }
}
