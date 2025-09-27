import { Injectable, ConflictException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@web-user/backend/database/prisma.service";
import { JwtUtil } from "@web-user/backend/modules/auth/utils/jwt.util";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { UserDataResponseDto } from "@web-user/backend/modules/auth/dto/auth-data-response.dto";
import { GoogleUserInfo, JwtPayload } from "@web-user/backend/common/types/auth.types";
import { PhoneService } from "./phone.service";
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
  async googleLoginWithCode(codeDto: GoogleLoginRequestDto): Promise<UserDataResponseDto> {
    try {
      const { code } = codeDto;

      // Authorization Code를 Access Token으로 교환하고 사용자 정보 가져오기
      const googleUserInfo = await this.exchangeCodeForToken(code);

      return this.googleLogin(googleUserInfo);
    } catch (error) {
      // ConflictException이면서 객체 형태인 경우 그대로 전달
      if (error instanceof ConflictException) {
        throw error;
      }
      // 다른 에러인 경우 string 형태로 변환
      throw new BadRequestException(
        `구글 로그인에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
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
        // accessToken: access_token,
        // refreshToken: refresh_token,
        userInfo: {
          googleId: userInfo.id,
          googleEmail: userInfo.email,
        },
      };
    } catch (error) {
      throw new Error(
        `구글 OAuth 토큰 교환 실패: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * 구글 로그인 처리 (내부 메서드)
   * @param googleUserInfo - 구글 사용자 정보
   * @returns JWT 토큰과 사용자 정보
   */
  async googleLogin(googleUserInfo: GoogleUserInfo): Promise<UserDataResponseDto> {
    const {
      // accessToken,
      // refreshToken,
      userInfo: { googleId, googleEmail },
    } = googleUserInfo;

    // googleId로 기존 사용자 확인
    const user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (user) {
      // 기존 사용자가 있는 경우
      // 휴대폰 인증이 되어있는지 확인
      if (user.phone && user.isPhoneVerified) {
        // 휴대폰 인증이 완료된 경우 -> 로그인 완료
        const jwtPayload: JwtPayload = {
          sub: user.id,
          phone: user.phone,
          loginType: "google",
          loginId: user.googleId ?? "",
        };

        const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } =
          await this.jwtUtil.generateTokenPair(jwtPayload);

        // 마지막 로그인 시간 업데이트
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
          },
        });

        return {
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name ?? "",
            nickname: user.nickname ?? "",
            email: user.email ?? "",
            profileImageUrl: user.profileImageUrl ?? "",
            isPhoneVerified: user.isPhoneVerified,
            isActive: user.isActive,
            userId: user.userId ?? "",
            googleId: user.googleId ?? "",
            googleEmail: user.googleEmail ?? "",
            createdAt: user.createdAt,
            lastLoginAt: new Date(),
          },
        };
      } else {
        // 휴대폰 인증이 안된 경우 -> 휴대폰 인증 필요
        throw new ConflictException({
          message: "휴대폰 인증이 필요합니다. 휴대폰 번호를 등록하고 인증을 완료해주세요.",
          googleId: googleId,
          googleEmail: googleEmail,
        });
      }
    } else {
      // 새 사용자인 경우 -> 휴대폰 인증 필요
      throw new ConflictException({
        message: "휴대폰 인증이 필요합니다. 휴대폰 번호를 등록하고 인증을 완료해주세요.",
        googleId: googleId,
        googleEmail: googleEmail,
      });
    }
  }

  /**
   * 구글 로그인 회원가입 (휴대폰 인증 완료 후)
   * @param googleId - 구글 ID
   * @param phone - 휴대폰 번호
   * @returns JWT 토큰과 사용자 정보
   */
  async googleRegisterWithPhone(
    googleRegisterDto: GoogleRegisterRequestDto,
  ): Promise<UserDataResponseDto> {
    try {
      const { googleId, googleEmail, phone } = googleRegisterDto;

      // 1. 휴대폰 번호로 기존 사용자 확인 (모든 계정 유형)
      const existingPhoneUser = await this.prisma.user.findFirst({
        where: { phone },
      });

      // 2. googleId로 기존 사용자 확인
      const existingGoogleUser = await this.prisma.user.findUnique({
        where: { googleId },
      });

      let user;

      if (existingPhoneUser && existingGoogleUser) {
        // 케이스: googleId, phone이 모두 중복되어 있는 경우
        // 둘 다 정보 업데이트 후 로그인 처리
        user = await this.prisma.user.update({
          where: { id: existingGoogleUser.id },
          data: {
            phone,
            googleEmail,
            isPhoneVerified: true,
            lastLoginAt: new Date(),
          },
        });
      } else if (existingPhoneUser && !existingGoogleUser) {
        // 케이스: phone이 중복되어 있지만 googleId는 중복되지 않은 경우
        if (existingPhoneUser.googleId) {
          // 케이스: 휴대폰번호가 구글 계정에서 사용중인 경우
          // 현재 googleId 정보 업데이트 후 로그인 처리
          user = await this.prisma.user.update({
            where: { id: existingPhoneUser.id },
            data: {
              googleId,
              googleEmail,
              lastLoginAt: new Date(),
            },
          });
        } else if (existingPhoneUser.userId) {
          // 케이스: 휴대폰번호가 일반 로그인에 사용중인 경우
          // googleId 정보 업데이트 후 로그인 처리
          user = await this.prisma.user.update({
            where: { id: existingPhoneUser.id },
            data: {
              googleId,
              googleEmail,
              lastLoginAt: new Date(),
            },
          });
        } else {
          // 케이스: 휴대폰번호만 있고 계정 정보가 없는 경우
          // googleId 정보 업데이트 후 로그인 처리
          user = await this.prisma.user.update({
            where: { id: existingPhoneUser.id },
            data: {
              googleId,
              googleEmail,
              lastLoginAt: new Date(),
            },
          });
        }
      } else if (!existingPhoneUser && existingGoogleUser) {
        // 케이스: googleId가 중복되어 있지만 phone은 중복되지 않은 경우
        // 휴대폰번호가 인증되어 있지만 않다면 phone 업데이트 후 로그인 처리
        user = await this.prisma.user.update({
          where: { id: existingGoogleUser.id },
          data: {
            phone,
            googleEmail,
            isPhoneVerified: true,
            lastLoginAt: new Date(),
          },
        });
      } else {
        // 케이스: googleId, phone이 모두 중복되지 않은 경우
        // 새 사용자 생성
        user = await this.prisma.user.create({
          data: {
            googleId,
            googleEmail,
            phone,
            isPhoneVerified: true,
            lastLoginAt: new Date(),
          },
        });
      }

      // 3. JWT 토큰 생성
      const jwtPayload: JwtPayload = {
        sub: user.id,
        phone: user.phone,
        loginType: "google",
        loginId: user.googleId ?? "",
      };

      const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } =
        await this.jwtUtil.generateTokenPair(jwtPayload);

      return {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name ?? "",
          nickname: user.nickname ?? "",
          email: user.email ?? "",
          profileImageUrl: user.profileImageUrl ?? "",
          isPhoneVerified: user.isPhoneVerified,
          isActive: user.isActive,
          userId: user.userId ?? "",
          googleId: user.googleId ?? "",
          googleEmail: user.googleEmail ?? "",
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt ?? new Date(),
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `구글 로그인 회원가입에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
