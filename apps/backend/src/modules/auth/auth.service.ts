import { Injectable } from "@nestjs/common";
import { PhoneService } from "@apps/backend/modules/auth/services/phone.service";
import { UserService } from "@apps/backend/modules/auth/services/user.service";
import { GoogleService } from "@apps/backend/modules/auth/services/google.service";
import {
  RegisterRequestDto,
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
  CheckUserIdRequestDto,
  LoginRequestDto,
  FindAccountRequestDto,
  ChangePasswordRequestDto,
  ChangePhoneRequestDto,
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
  RefreshTokenRequestDto,
} from "@apps/backend/modules/auth/dto/auth-request.dto";
import { JwtUtil } from "@apps/backend/modules/auth/utils/jwt.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

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
  async register(registerDto: RegisterRequestDto) {
    return this.userService.register(registerDto);
  }

  /**
   * 일반 - ID 중복 확인
   */
  async checkUserIdAvailability(checkUserIdDto: CheckUserIdRequestDto) {
    return this.userService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 일반 - 로그인
   */
  async login(loginDto: LoginRequestDto) {
    return this.userService.login(loginDto);
  }

  /**
   * 일반 - 비밀번호 변경
   */
  async changePassword(changePasswordDto: ChangePasswordRequestDto) {
    return this.userService.changePassword(changePasswordDto);
  }

  /**
   * 계정 찾기
   * 휴대폰 인증을 통해 계정 정보를 찾습니다.
   * 일반 로그인 계정인 경우 userId를, 구글 로그인 계정인 경우 googleEmail을 반환합니다.
   * 둘 다 있는 경우 모두 반환합니다.
   */
  async findAccount(findAccountDto: FindAccountRequestDto) {
    return this.userService.findAccount(findAccountDto);
  }

  /**
   * 구글 - Authorization Code로 구글 로그인 처리
   */
  async googleLoginWithCode(codeDto: GoogleLoginRequestDto) {
    return this.googleService.googleLoginWithCode(codeDto);
  }

  /**
   * 구글 - 로그인 회원가입 (휴대폰 인증 완료 후)
   */
  async googleRegisterWithPhone(googleRegisterDto: GoogleRegisterRequestDto) {
    return this.googleService.googleRegisterWithPhone(googleRegisterDto);
  }

  /**
   * 휴대폰 인증번호 발송
   */
  async sendVerificationCode(sendCodeDto: SendVerificationCodeRequestDto) {
    return this.phoneService.sendVerificationCode(sendCodeDto);
  }

  /**
   * 휴대폰 인증번호 확인
   */
  async verifyPhoneCode(verifyCodeDto: VerifyPhoneCodeRequestDto) {
    return this.phoneService.verifyPhoneCode(verifyCodeDto);
  }

  /**
   * 휴대폰 번호 변경
   */
  async changePhone(changePhoneDto: ChangePhoneRequestDto, user: JwtVerifiedPayload) {
    return this.userService.changePhone(changePhoneDto, user);
  }

  /**
   * Refresh Token을 사용하여 Access Token을 갱신합니다.
   */
  async refreshToken(refreshTokenDto: RefreshTokenRequestDto) {
    const newAccessToken = await this.jwtUtil.refreshAccessToken(refreshTokenDto);
    return { accessToken: newAccessToken };
  }
}
