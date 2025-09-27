import { Injectable } from "@nestjs/common";
import { PhoneService } from "@web-user/backend/modules/auth/services/phone.service";
import { UserService } from "@web-user/backend/modules/auth/services/user.service";
import { GoogleService } from "@web-user/backend/modules/auth/services/google.service";
import {
  RegisterRequestDto,
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
  CheckUserIdRequestDto,
  LoginRequestDto,
  FindUserIdRequestDto,
  ChangePasswordRequestDto,
  ChangePhoneRequestDto,
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
  RefreshTokenRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import {
  UserDataResponseDto,
  FindUserIdDataResponseDto,
  RefreshTokenResponseDto,
} from "@web-user/backend/modules/auth/dto/auth-data-response.dto";
import { AvailabilityResponseDto } from "@web-user/backend/common/dto/common.dto";
import { JwtUtil } from "@web-user/backend/modules/auth/utils/jwt.util";

/**
 * 인증 서비스
 *
 * 모든 인증 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * UserManagementService, PhoneVerificationService, GoogleService를 조합하여 사용합니다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly phoneService: PhoneService,
    private readonly googleService: GoogleService,
    private readonly jwtUtil: JwtUtil,
  ) {}

  /**
   * 일반 - 회원가입
   */
  async register(registerDto: RegisterRequestDto): Promise<UserDataResponseDto> {
    return this.userService.register(registerDto);
  }

  /**
   * 일반 - ID 중복 확인
   */
  async checkUserIdAvailability(
    checkUserIdDto: CheckUserIdRequestDto,
  ): Promise<AvailabilityResponseDto> {
    return this.userService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 일반 - 로그인
   */
  async login(loginDto: LoginRequestDto): Promise<UserDataResponseDto> {
    return this.userService.login(loginDto);
  }

  /**
   * 일반 - ID 찾기
   */
  async findUserId(findUserIdDto: FindUserIdRequestDto): Promise<FindUserIdDataResponseDto> {
    return this.userService.findUserId(findUserIdDto);
  }

  /**
   * 일반 - 비밀번호 변경
   */
  async changePassword(changePasswordDto: ChangePasswordRequestDto): Promise<void> {
    return this.userService.changePassword(changePasswordDto);
  }

  /**
   * 휴대폰 인증번호 발송
   */
  async sendVerificationCode(sendCodeDto: SendVerificationCodeRequestDto): Promise<void> {
    return this.phoneService.sendVerificationCode(sendCodeDto);
  }

  /**
   * 휴대폰 인증번호 확인
   */
  async verifyPhoneCode(verifyCodeDto: VerifyPhoneCodeRequestDto): Promise<void> {
    return this.phoneService.verifyPhoneCode(verifyCodeDto);
  }

  /**
   * 휴대폰 번호 변경
   */
  async changePhone(changePhoneDto: ChangePhoneRequestDto): Promise<void> {
    return this.userService.changePhone(changePhoneDto);
  }

  /**
   * 구글 - Authorization Code로 구글 로그인 처리
   */
  async googleLoginWithCode(codeDto: GoogleLoginRequestDto): Promise<UserDataResponseDto> {
    return this.googleService.googleLoginWithCode(codeDto);
  }

  /**
   * 구글 - 로그인 회원가입 (휴대폰 인증 완료 후)
   */
  async googleRegisterWithPhone(
    googleRegisterDto: GoogleRegisterRequestDto,
  ): Promise<UserDataResponseDto> {
    return this.googleService.googleRegisterWithPhone(googleRegisterDto);
  }

  /**
   * Refresh Token을 사용하여 Access Token을 갱신합니다.
   */
  async refreshToken(refreshTokenDto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    const newAccessToken = await this.jwtUtil.refreshAccessToken(refreshTokenDto);
    return { accessToken: newAccessToken };
  }
}
