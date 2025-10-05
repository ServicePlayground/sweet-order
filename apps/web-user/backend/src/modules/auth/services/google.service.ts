import { Injectable, ConflictException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@web-user/backend/database/prisma.service";
import { JwtUtil } from "@web-user/backend/modules/auth/utils/jwt.util";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { AUTH_ERROR_MESSAGES } from "@web-user/backend/modules/auth/constants/auth.constants";
import { UserMapperUtil } from "@web-user/backend/modules/auth/utils/user-mapper.util";
import { GoogleUserInfo, JwtPayload } from "@web-user/backend/common/types/auth.types";
import { PhoneService } from "./phone.service";
import { PhoneUtil } from "@web-user/backend/modules/auth/utils/phone.util";
import { Prisma } from "@sweet-order/shared-database";
import {
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";

/**
 * 구글 OAuth 서비스
 * 구글 로그인 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class GoogleService {
  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly googleRedirectUri: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtUtil: JwtUtil,
    private readonly configService: ConfigService,
    private readonly phoneService: PhoneService,
  ) {
    this.googleClientId = configService.get<string>("GOOGLE_CLIENT_ID")!;
    this.googleClientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET")!;
    this.googleRedirectUri = configService.get<string>("GOOGLE_REDIRECT_URI")!;
  }

  /**
   * Authorization Code로 구글 로그인 처리
   * @param code - 구글에서 받은 Authorization Code
   * @returns JWT 토큰과 사용자 정보
   */
  async googleLoginWithCode(codeDto: GoogleLoginRequestDto) {
    const { code } = codeDto;

    // Authorization Code를 Access Token으로 교환하고 사용자 정보 가져오기
    const googleUserInfo = await this.exchangeCodeForToken(code);

    return this.googleLogin(googleUserInfo);
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
          code: decodeURIComponent(code),
          grant_type: "authorization_code",
          redirect_uri: this.googleRedirectUri,
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
    } catch (error) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.GOOGLE_OAUTH_TOKEN_EXCHANGE_FAILED);
    }
  }

  /**
   * 구글 로그인 처리 (내부 메서드)
   * @param googleUserInfo - 구글 사용자 정보
   * @returns JWT 토큰과 사용자 정보
   */
  async googleLogin(googleUserInfo: GoogleUserInfo) {
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
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // JWT 토큰 생성
      const jwtPayload: JwtPayload = {
        sub: user.id,
        phone: user.phone,
        loginType: "google",
        loginId: user.googleId ?? "",
      };

      const { accessToken, refreshToken } = await this.jwtUtil.generateTokenPair(jwtPayload);

      // 마지막 로그인 시간 업데이트
      await tx.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      return {
        accessToken,
        refreshToken,
        user: UserMapperUtil.mapToUserInfo(user, new Date()),
      };
    });
  }

  /**
   * 구글 로그인 회원가입 (휴대폰 인증 완료 후)
   * @param googleId - 구글 ID
   * @param phone - 휴대폰 번호
   * @returns JWT 토큰과 사용자 정보
   */
  async googleRegisterWithPhone(googleRegisterDto: GoogleRegisterRequestDto) {
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
        return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
          });

          // 응답 data 반환
          return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: UserMapperUtil.mapToUserInfo(user),
          };
        });
      }
    }

    // 3. 휴대폰번호가 중복되지 않은 경우 - 새 사용자 생성
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
      });

      // 응답 data 반환
      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
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
