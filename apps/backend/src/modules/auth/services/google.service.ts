import { Injectable, ConflictException, BadRequestException, Logger } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtUtil } from "@apps/backend/modules/auth/utils/jwt.util";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import {
  AUTH_ERROR_MESSAGES,
  PhoneVerificationPurpose,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { GoogleUserInfo } from "@apps/backend/modules/auth/types/auth.types";
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
  private readonly httpClient: AxiosInstance;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtUtil: JwtUtil,
    private readonly configService: ConfigService,
    private readonly phoneService: PhoneService,
  ) {
    this.googleClientId = configService.get<string>("GOOGLE_CLIENT_ID")!;
    this.googleClientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET")!;
    this.googleRedirectUri = configService.get<string>("GOOGLE_REDIRECT_URI")!;
    this.userDomain = configService.get<string>("PUBLIC_USER_DOMAIN")!;

    // 안정적인 HTTP 클라이언트 설정
    this.httpClient = axios.create({
      timeout: 30000, // 30초 타임아웃
      headers: {
        "User-Agent": "SweetOrder-Backend/1.0",
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
      // 연결 재사용을 위한 설정
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // 5xx 에러만 재시도
      // 배포환경에서의 네트워크 안정성을 위한 설정
      httpsAgent: new (require("https").Agent)({
        keepAlive: true,
        keepAliveMsecs: 30000,
        maxSockets: 50,
        maxFreeSockets: 10,
        timeout: 30000,
        freeSocketTimeout: 30000,
      }),
    });
  }

  /**
   * Authorization Code로 구글 로그인 처리
   * @param codeDto - 구글에서 받은 Authorization Code
   * @returns 사용자 정보 (토큰은 응답 본문에 포함)
   */
  async googleLoginWithCode(codeDto: GoogleLoginRequestDto) {
    const { code } = codeDto;

    // Authorization Code를 Access Token으로 교환하고 사용자 정보 가져오기
    const googleUserInfo = await this.exchangeCodeForToken(code);

    return await this.googleLogin(googleUserInfo);
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
      const tokenResponse = await this.httpClient.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: this.googleClientId,
          client_secret: this.googleClientSecret,
          code: decodeURIComponent(code),
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
      this.logger.log("사용자 정보 요청 시작");
      const userInfoResponse = await this.httpClient.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        },
      );

      const userInfo = userInfoResponse.data;

      return {
        userInfo: {
          googleId: userInfo.id,
          googleEmail: userInfo.email,
        },
      };
    } catch (error: any) {
      // ETIMEDOUT 에러에 대한 특별 처리
      if (error.code === "ETIMEDOUT") {
        this.logger.error("구글 토큰 교환 타임아웃 발생:", error.message);
      }
      console.error("=== Google OAuth 에러 상세 정보 ===");
      console.error("error.code:", error.code);
      console.error("error.message:", error.message);
      console.error("error.response.status:", error.response?.status);
      console.error("error.response.statusText:", error.response?.statusText);
      console.error("===========================");
      throw error;
    }
  }

  /**
   * 구글 로그인 처리 (내부 메서드)
   * @param googleUserInfo - 구글 사용자 정보
   * @returns 사용자 정보 (토큰은 응답 본문에 포함)
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
    return await this.prisma.$transaction(async (tx) => {
      // JWT 토큰 생성 (최소 정보만 포함: sub만)
      const tokenPair = await this.jwtUtil.generateTokenPair({
        sub: user.id,
      });

      // 마지막 로그인 시간 업데이트
      await tx.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // 응답에 토큰만 반환 (사용자 정보는 제외)
      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      };
    });
  }

  /**
   * 구글 로그인 회원가입 (휴대폰 인증 완료 후)
   * @param googleRegisterDto - 구글 회원가입 정보
   * @returns 사용자 정보 (토큰은 응답 본문에 포함)
   */
  async googleRegisterWithPhone(googleRegisterDto: GoogleRegisterRequestDto) {
    const { googleId, googleEmail, phone } = googleRegisterDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 1. 구글 ID 중복 검증 (필수)
    await this.checkGoogleIdDuplication(googleId);

    // 2. 휴대폰 인증 상태 확인 (1시간 이내 인증만 유효)
    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedPhone,
      PhoneVerificationPurpose.GOOGLE_REGISTRATION,
    );
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

          // JWT 토큰 생성 (최소 정보만 포함: sub만)
          const tokenPair = await this.jwtUtil.generateTokenPair({
            sub: user.id,
          });

          // 응답에 토큰만 반환 (사용자 정보는 제외)
          return {
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
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

      // JWT 토큰 생성 (최소 정보만 포함: sub만)
      const tokenPair = await this.jwtUtil.generateTokenPair({
        sub: user.id,
      });

      // 응답에 토큰만 반환 (사용자 정보는 제외)
      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
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
