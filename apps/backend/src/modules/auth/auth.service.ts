import { Injectable } from "@nestjs/common";
import { Response } from "express";
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
} from "@apps/backend/modules/auth/dto/auth-request.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 인증 서비스
 *
 * 모든 인증 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * UserService, PhoneService, GoogleService를 조합하여 사용합니다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly phoneService: PhoneService,
    private readonly googleService: GoogleService,
  ) {}

  /**
   * 일반 - 회원가입
   */
  async register(registerDto: RegisterRequestDto, res: Response) {
    return await this.userService.register(registerDto, res);
  }

  /**
   * 일반 - ID 중복 확인
   */
  async checkUserIdAvailability(checkUserIdDto: CheckUserIdRequestDto) {
    return await this.userService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 일반 - 로그인
   */
  async login(loginDto: LoginRequestDto, res: Response) {
    return await this.userService.login(loginDto, res);
  }

  /**
   * 일반 - 비밀번호 변경
   */
  async changePassword(changePasswordDto: ChangePasswordRequestDto) {
    await this.userService.changePassword(changePasswordDto);
  }

  /**
   * 계정 찾기
   * 휴대폰 인증을 통해 계정 정보를 찾습니다.
   * 일반 로그인 계정인 경우 userId를, 구글 로그인 계정인 경우 googleEmail을 반환합니다.
   * 둘 다 있는 경우 모두 반환합니다.
   */
  async findAccount(findAccountDto: FindAccountRequestDto) {
    return await this.userService.findAccount(findAccountDto);
  }

  /**
   * 구글 - Authorization Code로 구글 로그인 처리
   */
  async googleLoginWithCode(codeDto: GoogleLoginRequestDto, res: Response) {
    return await this.googleService.googleLoginWithCode(codeDto, res);
  }

  /**
   * 구글 - 로그인 회원가입 (휴대폰 인증 완료 후)
   */
  async googleRegisterWithPhone(googleRegisterDto: GoogleRegisterRequestDto, res: Response) {
    return await this.googleService.googleRegisterWithPhone(googleRegisterDto, res);
  }

  /**
   * 휴대폰 인증번호 발송
   */
  async sendVerificationCode(sendCodeDto: SendVerificationCodeRequestDto) {
    await this.phoneService.sendVerificationCode(sendCodeDto);
  }

  /**
   * 휴대폰 인증번호 확인
   */
  async verifyPhoneCode(verifyCodeDto: VerifyPhoneCodeRequestDto) {
    await this.phoneService.verifyPhoneCode(verifyCodeDto);
  }

  /**
   * 휴대폰 번호 변경
   */
  async changePhone(changePhoneDto: ChangePhoneRequestDto, user: JwtVerifiedPayload) {
    await this.userService.changePhone(changePhoneDto, user);
  }

  /**
   * Refresh Token을 사용하여 Access Token을 갱신합니다.
   */
  async refreshToken(res: Response) {
    await this.userService.refreshAccessTokenFromCookie(res);
  }

  /**
   * 현재 로그인한 사용자 정보 조회
   */
  async getCurrentUser(user: JwtVerifiedPayload) {
    return await this.userService.getCurrentUser(user);
  }

  /**
   * 로그아웃 처리
   */
  async logout(res: Response) {
    await this.userService.logout(res);
  }
}
