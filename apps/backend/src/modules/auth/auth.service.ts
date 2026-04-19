import { Injectable } from "@nestjs/common";
import { PhoneService } from "@apps/backend/modules/auth/services/phone.service";
import { ConsumerService } from "@apps/backend/modules/auth/services/consumer.service";
import { SellerService } from "@apps/backend/modules/auth/services/seller.service";
import { GoogleService } from "@apps/backend/modules/auth/services/google.service";
import {
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
  ChangePhoneRequestDto,
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
  FindAccountRequestDto,
} from "@apps/backend/modules/auth/dto/auth-request.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/** 세션(액세스 토큰) 유효 확인 API 공통 응답 — DB 조회 없음 */
type SessionAvailabilityResponse = { available: true };

@Injectable()
export class AuthService {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly sellerService: SellerService,
    private readonly phoneService: PhoneService,
    private readonly googleService: GoogleService,
  ) {}

  private getSessionAvailabilityResponse(): SessionAvailabilityResponse {
    return { available: true as const };
  }

  /**
   * 구글 — Authorization Code 로그인 (구매자). 리다이렉트 URI는 구매자 앱 기준.
   */
  async consumerGoogleLoginWithCode(dto: GoogleLoginRequestDto) {
    return this.googleService.consumerGoogleLoginWithCode(dto);
  }

  /**
   * 구글 — Authorization Code 로그인 (판매자). 리다이렉트 URI는 판매자 앱 기준.
   */
  async sellerGoogleLoginWithCode(dto: GoogleLoginRequestDto) {
    return this.googleService.sellerGoogleLoginWithCode(dto);
  }

  /**
   * 구글 — 회원가입·최초 연동 (휴대폰 인증 완료 후, 구매자)
   */
  async consumerGoogleRegisterWithPhone(dto: GoogleRegisterRequestDto) {
    return this.googleService.consumerGoogleRegisterWithPhone(dto);
  }

  /**
   * 구글 — 회원가입·최초 연동 (휴대폰 인증 완료 후, 판매자)
   */
  async sellerGoogleRegisterWithPhone(dto: GoogleRegisterRequestDto) {
    return this.googleService.sellerGoogleRegisterWithPhone(dto);
  }

  /**
   * 구매자 액세스 토큰이 가드·전략을 통과했을 때의 확인 응답 (DB 조회 없음)
   */
  getCurrentUser(user: JwtVerifiedPayload): SessionAvailabilityResponse {
    void user.sub;
    return this.getSessionAvailabilityResponse();
  }

  /**
   * 판매자 액세스 토큰이 가드·전략을 통과했을 때의 확인 응답 (DB 조회 없음)
   */
  getCurrentSeller(user: JwtVerifiedPayload): SessionAvailabilityResponse {
    void user.sub;
    return this.getSessionAvailabilityResponse();
  }

  /**
   * 계정 찾기 (구매자) — 발송/확인 시 `audience: consumer`, `purpose: find_account`로 인증 완료 후 호출
   */
  async findAccountConsumer(dto: FindAccountRequestDto) {
    return this.consumerService.findAccount(dto);
  }

  /**
   * 계정 찾기 (판매자) — 발송/확인 시 `audience: seller`, `purpose: find_account`로 인증 완료 후 호출
   */
  async findAccountSeller(dto: FindAccountRequestDto) {
    return this.sellerService.findAccount(dto);
  }

  /** 휴대폰 번호 변경 (구매자) */
  async changePhoneConsumer(dto: ChangePhoneRequestDto, user: JwtVerifiedPayload) {
    await this.consumerService.changePhone(dto, user);
  }

  /** 휴대폰 번호 변경 (판매자) */
  async changePhoneSeller(dto: ChangePhoneRequestDto, user: JwtVerifiedPayload) {
    await this.sellerService.changePhone(dto, user);
  }

  /**
   * 휴대폰 인증번호 발송
   * `audience`(consumer | seller)와 `purpose`(종류)를 함께 보내면 DB에는 `consumer:google_registration` 형태로 저장됩니다.
   */
  async sendVerificationCode(dto: SendVerificationCodeRequestDto) {
    return await this.phoneService.sendVerificationCode(dto);
  }

  /**
   * 휴대폰 인증번호 확인 — 발송 시와 동일한 `audience`·`purpose`를 전달해야 합니다.
   */
  async verifyPhoneCode(dto: VerifyPhoneCodeRequestDto) {
    await this.phoneService.verifyPhoneCode(dto);
  }

  /**
   * 헤더 기반 인증 — 클라이언트에서 토큰 삭제로 처리; 서버는 동작 없음
   */
  logout(): void {
    // 헤더 기반 인증에서는 클라이언트에서 토큰을 삭제하면 되므로 서버에서는 별도 처리 불필요
  }
}
