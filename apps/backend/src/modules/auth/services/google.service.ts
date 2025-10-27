import { Injectable, ConflictException, BadRequestException, Logger } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtUtil } from "@apps/backend/modules/auth/utils/jwt.util";
import { CookieUtil } from "@apps/backend/modules/auth/utils/cookie.util";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import {
  AUTH_ERROR_MESSAGES,
  COOKIE_CONFIG,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { UserMapperUtil } from "@apps/backend/modules/auth/utils/user-mapper.util";
import { GoogleUserInfo, JwtPayload } from "@apps/backend/modules/auth/types/auth.types";
import { PhoneService } from "@apps/backend/modules/auth/services/phone.service";
import { PhoneUtil } from "@apps/backend/modules/auth/utils/phone.util";
import {
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
} from "@apps/backend/modules/auth/dto/auth-request.dto";

/**
 * 구글 OAuth 서비스
 * 구글 로그인 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly googleRedirectUri: string;
  private readonly userDomain: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtUtil: JwtUtil,
    private readonly cookieUtil: CookieUtil,
    private readonly configService: ConfigService,
    private readonly phoneService: PhoneService,
  ) {
    this.googleClientId = configService.get<string>("GOOGLE_CLIENT_ID")!;
    this.googleClientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET")!;
    this.googleRedirectUri = configService.get<string>("GOOGLE_REDIRECT_URI")!;
    this.userDomain = configService.get<string>("PUBLIC_USER_DOMAIN")!;
  }

  /**
   * Authorization Code로 구글 로그인 처리
   * @param codeDto - 구글에서 받은 Authorization Code
   * @param res - Express Response 객체
   * @returns 사용자 정보 (토큰은 쿠키에 설정)
   */
  async googleLoginWithCode(codeDto: GoogleLoginRequestDto, res: Response) {
    const { code } = codeDto;

    // Authorization Code를 Access Token으로 교환하고 사용자 정보 가져오기
    const googleUserInfo = await this.exchangeCodeForToken(code);

    return await this.googleLogin(googleUserInfo, res);
  }

  /**
   * Authorization Code를 Access Token으로 교환
   * @param code - 구글에서 받은 Authorization Code
   * @returns Access Token과 사용자 정보
   */
  async exchangeCodeForToken(code: string): Promise<GoogleUserInfo> {
    try {
      // Authorization Code를 Access Token으로 교환
      // Google OAuth는 application/x-www-form-urlencoded 형식을 요구
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: this.googleClientId,
          client_secret: this.googleClientSecret,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: `${this.userDomain}${this.googleRedirectUri}`,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token, token_type } = tokenResponse.data;

      // Access Token으로 사용자 정보 요청
      const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      });

      const userInfo = userInfoResponse.data;

      return {
        userInfo: {
          googleId: userInfo.id,
          googleEmail: userInfo.email,
        },
      };
    } catch (error: any) {
      // Google OAuth 에러 상세 분석
      console.error('=== Google OAuth 에러 상세 정보 ===');
      console.error('error.code:', error.code);
      console.error('error.message:', error.message);
      console.error('error.response.status:', error.response?.status);
      console.error('error.response.statusText:', error.response?.statusText);
      console.error('error.response.data:', error.response?.data);      
      console.error('OAuth Error:', error.response?.data?.error);
      console.error('OAuth Error Description:', error.response?.data?.error_description);
      console.error('OAuth Error URI:', error.response?.data?.error_uri);
      console.error("Request error:", error.request);
      console.error("Axios error:", JSON.stringify(error, null, 2));
      console.error("Axios error:", error.toJSON ? error.toJSON() : error);
      this.logger.error('===========================');      
      
      const util = require('util'); // Node util 모듈 사용 (for deep inspection)

      console.error('=== Google OAuth 에러 상세 정보 ===');

      // 1️⃣ Axios 에러 기본 필드
      console.error('error.name:', error.name);
      console.error('error.code:', error.code);
      console.error('error.message:', error.message);

      // 2️⃣ HTTP 응답 정보 (axios error.response)
      if (error.response) {
        console.error('error.response.status:', error.response.status);
        console.error('error.response.statusText:', error.response.statusText);
        console.error('error.response.data:', error.response.data);

        // 3️⃣ OAuth 관련 세부 필드
        console.error('OAuth Error:', error.response.data?.error);
        console.error('OAuth Error Description:', error.response.data?.error_description);
        console.error('OAuth Error URI:', error.response.data?.error_uri);
      } else if (error.request) {
        console.error('요청은 전송되었으나 응답이 없습니다.');
        console.error('error.request:', util.inspect(error.request, { depth: 3 }));
      } else {
        console.error('요청 설정 중 에러 발생:', error.message);
      }

      // 4️⃣ Axios 내부 구조를 강제로 JSON 출력
      try {
        console.error('--- Axios toJSON ---');
        console.error(
          JSON.stringify(error.toJSON ? error.toJSON() : error, null, 2)
        );
      } catch (jsonErr) {
        console.error('--- Fallback util.inspect ---');
        console.error(util.inspect(error, { depth: 5, colors: false }));
      }

      // 5️⃣ 완전한 에러 덤프
      console.error('--- Full Error Dump ---');
      console.error(util.inspect(error, { depth: 10, colors: false }));

      console.error('===========================');

      this.logger.error(`[Google OAuth Error] ${error.message}`);

      throw error;

      //throw new BadRequestException(AUTH_ERROR_MESSAGES.GOOGLE_OAUTH_TOKEN_EXCHANGE_FAILED);
    }
  }

  /**
   * 구글 로그인 처리 (내부 메서드)
   * @param googleUserInfo - 구글 사용자 정보
   * @param res - Express Response 객체
   * @returns 사용자 정보 (토큰은 쿠키에 설정)
   */
  async googleLogin(googleUserInfo: GoogleUserInfo, res: Response) {
    const {
      userInfo: { googleId, googleEmail },
    } = googleUserInfo;

    // 1. googleId로 기존 사용자 확인
    const user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      // 새 사용자인 경우 -> 휴대폰 인증 필요
      throw new BadRequestException({
        message: AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED,
        googleId: googleId,
        googleEmail: googleEmail,
      });
    }

    // 2. 휴대폰 인증 상태 확인
    if (!user.phone || !user.isPhoneVerified) {
      throw new BadRequestException({
        message: AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED,
        googleId: googleId,
        googleEmail: googleEmail,
      });
    }

    // 3. 트랜잭션으로 JWT 토큰 생성 및 마지막 로그인 시간 업데이트
    return await this.prisma.$transaction(async (tx) => {
      // JWT 토큰 생성
      const jwtPayload: JwtPayload = {
        sub: user.id,
        phone: user.phone,
        loginType: "google",
        loginId: user.googleId ?? "",
        role: user.role,
      };

      const tokenPair = await this.jwtUtil.generateTokenPair(jwtPayload);

      // 마지막 로그인 시간 업데이트
      await tx.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // 쿠키에 토큰 설정 (서브도메인 통합 로그인)
      if (res) {
        this.cookieUtil.setAccessTokenCookie(
          res,
          tokenPair.accessToken,
          COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE,
        );
        this.cookieUtil.setRefreshTokenCookie(
          res,
          tokenPair.refreshToken,
          COOKIE_CONFIG.REFRESH_TOKEN_MAX_AGE,
        );
      }

      // 보안상 응답에서는 토큰을 제외하고 사용자 정보만 반환
      return {
        user: UserMapperUtil.mapToUserInfo(user, new Date()),
      };
    });
  }

  /**
   * 구글 로그인 회원가입 (휴대폰 인증 완료 후)
   * @param googleRegisterDto - 구글 회원가입 정보
   * @param res - Express Response 객체
   * @returns 사용자 정보 (토큰은 쿠키에 설정)
   */
  async googleRegisterWithPhone(googleRegisterDto: GoogleRegisterRequestDto, res: Response) {
    const { googleId, googleEmail, phone } = googleRegisterDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 1. 구글 ID 중복 검증 (필수)
    await this.checkGoogleIdDuplication(googleId);

    // 2. 휴대폰 인증 상태 확인 (1시간 이내 인증만 유효)
    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(normalizedPhone);
    if (!isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    // 3. 휴대폰번호 중복 확인 및 계정 타입별 처리
    const existingPhoneUser = await this.prisma.user.findFirst({
      where: { phone: normalizedPhone },
    });

    if (existingPhoneUser) {
      // 휴대폰번호가 중복되는 경우, 기존 계정의 타입을 확인
      if (existingPhoneUser.googleId) {
        // 구글 계정(googleId)에서 이미 사용중인 경우 -> 에러 발생
        if (existingPhoneUser.userId && existingPhoneUser.googleId) {
          // 일반 로그인과 구글 로그인 모두 가능한 계정
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_MULTIPLE_ACCOUNTS);
        } else {
          // 구글 로그인 계정만 존재
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_GOOGLE_ACCOUNT_EXISTS);
        }
      } else if (existingPhoneUser.userId) {
        // 일반 계정(userId)에서만 사용중인 경우 -> 업데이트 후 로그인 처리
        return await this.prisma.$transaction(async (tx) => {
          const user = await tx.user.update({
            where: { id: existingPhoneUser.id },
            data: {
              googleId,
              googleEmail,
              lastLoginAt: new Date(),
            },
          });

          // JWT 토큰 생성
          const tokenPair = await this.jwtUtil.generateTokenPair({
            sub: user.id,
            phone: user.phone,
            loginType: "google",
            loginId: user.googleId ?? "",
            role: user.role,
          });

          // 쿠키에 토큰 설정 (서브도메인 통합 로그인)
          if (res) {
            this.cookieUtil.setAccessTokenCookie(
              res,
              tokenPair.accessToken,
              COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE,
            );
            this.cookieUtil.setRefreshTokenCookie(
              res,
              tokenPair.refreshToken,
              COOKIE_CONFIG.REFRESH_TOKEN_MAX_AGE,
            );
          }

          // 보안상 응답에서는 토큰을 제외하고 사용자 정보만 반환
          return {
            user: UserMapperUtil.mapToUserInfo(user),
          };
        });
      }
    }

    // 3. 휴대폰번호가 중복되지 않은 경우 - 새 사용자 생성
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          googleId,
          googleEmail,
          phone: normalizedPhone,
          isPhoneVerified: true,
          lastLoginAt: new Date(),
        },
      });

      // JWT 토큰 생성
      const tokenPair = await this.jwtUtil.generateTokenPair({
        sub: user.id,
        phone: user.phone,
        loginType: "google",
        loginId: user.googleId ?? "",
        role: user.role,
      });

      // 쿠키에 토큰 설정 (서브도메인 통합 로그인)
      if (res) {
        this.cookieUtil.setAccessTokenCookie(
          res,
          tokenPair.accessToken,
          COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE,
        );
        this.cookieUtil.setRefreshTokenCookie(
          res,
          tokenPair.refreshToken,
          COOKIE_CONFIG.REFRESH_TOKEN_MAX_AGE,
        );
      }

      // 보안상 응답에서는 토큰을 제외하고 사용자 정보만 반환
      return {
        user: UserMapperUtil.mapToUserInfo(user),
      };
    });
  }

  /**
   * 구글 ID 중복 검증 (내부 메서드)
   */
  private async checkGoogleIdDuplication(googleId: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (existingUser) {
      throw new ConflictException(AUTH_ERROR_MESSAGES.GOOGLE_ID_ALREADY_EXISTS);
    }
  }
}
