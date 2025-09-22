import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@web-user/backend/database/prisma.service";
import { PhoneUtil } from "@web-user/backend/common/utils/phone.util";
import {
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";

/**
 * 휴대폰 인증 서비스
 *
 * 주요 기능:
 * - 휴대폰 인증번호 발송
 * - 휴대폰 인증번호 확인
 * - 인증 상태 관리
 */
@Injectable()
export class PhoneService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 휴대폰 인증번호 발송
   *
   * @param sendCodeDto 휴대폰 번호
   * @throws BadRequestException 잘못된 휴대폰 번호 형식이거나 재발송 제한에 걸린 경우
   */
  async sendVerificationCode(sendCodeDto: SendVerificationCodeRequestDto): Promise<void> {
    const { phone } = sendCodeDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 1. 기존 인증 정보 확인 - PhoneVerification 테이블 조회
    const existingVerification = await this.prisma.phoneVerification.findFirst({
      where: { phone: normalizedPhone },
      orderBy: { createdAt: "desc" },
    });

    // 2. 재발송 제한 확인 - 1분 이내 재발송 방지
    if (existingVerification) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      if (existingVerification.createdAt > oneMinuteAgo) {
        throw new BadRequestException("인증번호는 1분 후에 다시 요청할 수 있습니다.");
      }
    }

    // 3. 인증번호 생성 - 6자리 인증번호
    const verificationCode = PhoneUtil.generateVerificationCode();
    const expiresAt = PhoneUtil.getExpirationTime(5); // 5분 후 만료

    // 4. 인증 정보 저장 - PhoneVerification 테이블
    await this.prisma.phoneVerification.create({
      data: {
        phone: normalizedPhone,
        verificationCode,
        expiresAt,
        attemptCount: 0, // ERD: attempt_count 초기화
      },
    });

    // 5. SMS 발송 - ERD 요구사항: 신뢰할 수 있는 인증 서비스 연동
    // TODO: 실제 SMS 발송 서비스 연동 시 로그 제거
    // console.log(
    //   `SMS 발송: ${PhoneUtil.formatPhoneForDisplay(normalizedPhone)} - 인증번호: ${verificationCode}`,
    // );

    // TODO: 실제 SMS 발송 서비스 연동 (예: 네이버 클라우드 플랫폼, 카카오 알림톡 등)
  }

  /**
   * 휴대폰 인증번호 확인
   *
   * @param verifyCodeDto 휴대폰 번호와 인증번호
   * @throws BadRequestException 인증번호가 잘못되었거나 만료되었거나 시도 횟수를 초과한 경우
   */
  async verifyPhoneCode(verifyCodeDto: VerifyPhoneCodeRequestDto): Promise<void> {
    const { phone, verificationCode } = verifyCodeDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 1. 휴대폰 번호와 인증번호로 검증 정보 조회 - PhoneVerification 테이블
    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        verificationCode,
      },
      orderBy: { createdAt: "desc" },
    });

    // 인증 정보가 존재하지 않는 경우
    if (!phoneVerification) {
      throw new BadRequestException("인증번호가 올바르지 않습니다.");
    }

    // 2. 인증 상태 확인 - is_verified 플래그 확인
    if (phoneVerification.isVerified) {
      throw new BadRequestException("이미 인증된 번호입니다.");
    }

    // 3. 만료 시간 확인 - 5분 후 자동 만료
    if (phoneVerification.expiresAt < new Date()) {
      throw new BadRequestException("인증번호가 만료되었습니다.");
    }

    // 4. 시도 횟수 확인 - 일일 5회 제한
    if (phoneVerification.attemptCount >= 5) {
      throw new BadRequestException("인증 시도 횟수를 초과했습니다.");
    }

    // 5. 인증 성공 처리 - is_verified = true로 업데이트
    await this.prisma.phoneVerification.update({
      where: { id: phoneVerification.id },
      data: {
        isVerified: true, // is_verified 플래그로 본인인증 상태 관리
        attemptCount: phoneVerification.attemptCount + 1, // 시도 횟수 증가
      },
    });
  }
}
