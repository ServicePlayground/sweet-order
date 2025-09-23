import { Injectable } from "@nestjs/common";
import { PhoneService } from "@web-user/backend/modules/auth/services/phone.service";
import { UserService } from "@web-user/backend/modules/auth/services/user.service";
import {
  RegisterRequestDto,
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
  CheckUserIdRequestDto,
  CheckPhoneRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import { RegisterDataResponseDto } from "@web-user/backend/modules/auth/dto/auth-data-response.dto";
import { AvailabilityResponseDto } from "@web-user/backend/common/dto/common.dto";

/**
 * 인증 서비스
 *
 * 모든 인증 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * UserManagementService, PhoneVerificationService를 조합하여 사용합니다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly phoneService: PhoneService,
  ) {}

  /**
   * 회원가입
   */
  async register(registerDto: RegisterRequestDto): Promise<RegisterDataResponseDto> {
    return this.userService.register(registerDto);
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
   * 사용자 ID 중복 확인
   */
  async checkUserIdAvailability(
    checkUserIdDto: CheckUserIdRequestDto,
  ): Promise<AvailabilityResponseDto> {
    return this.userService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 휴대폰 번호 중복 확인
   */
  async checkPhoneAvailability(
    checkPhoneDto: CheckPhoneRequestDto,
  ): Promise<AvailabilityResponseDto> {
    return this.userService.checkPhoneAvailability(checkPhoneDto);
  }
}
