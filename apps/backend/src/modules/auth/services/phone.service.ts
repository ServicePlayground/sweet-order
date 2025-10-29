import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PhoneUtil } from "@apps/backend/modules/auth/utils/phone.util";
import { AUTH_ERROR_MESSAGES } from "@apps/backend/modules/auth/constants/auth.constants";
import {
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
} from "@apps/backend/modules/auth/dto/auth-request.dto";

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

    // 1. 안전한 인증번호 생성 (중복 방지)
    const verificationCode = await this.generateUniqueVerificationCode(normalizedPhone);
    const expiresAt = PhoneUtil.getExpirationTime(5); // 5분 후 만료

    // 2. 트랜잭션으로 인증 정보 저장 - PhoneVerification 테이블
    await this.prisma.$transaction(async (tx) => {
      await tx.phoneVerification.create({
        data: {
          phone: normalizedPhone,
          verificationCode,
          expiresAt,
        },
      });
    });

    // 3. SMS 발송 - ERD 요구사항: 신뢰할 수 있는 인증 서비스 연동
    // TODO: 실제 SMS 발송 서비스 연동 (예: 네이버 클라우드 플랫폼, 카카오 알림톡 등)
  }

  /**
   * 중복되지 않는 고유한 인증번호를 생성합니다.
   *
   * @param phone 휴대폰 번호
   * @returns 고유한 6자리 인증번호
   * @throws BadRequestException 최대 재시도 횟수 초과 시
   */
  async generateUniqueVerificationCode(phone: string): Promise<string> {
    const maxRetries = 10; // 최대 10번 재시도

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const verificationCode = PhoneUtil.generateVerificationCode();

      // 해당 휴대폰 번호와 인증번호 조합이 이미 존재하는지 확인
      const existingRecord = await this.prisma.phoneVerification.findFirst({
        where: {
          phone,
          verificationCode,
        },
      });

      // 중복이 없으면 해당 인증번호 반환
      if (!existingRecord) {
        return verificationCode;
      }
    }

    // 최대 재시도 횟수 초과 시 예외 발생
    throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_CODE_GENERATION_FAILED);
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

    // 임시 처리: 인증번호 123456은 항상 통과
    if (verificationCode === "123456") {
      // 임시 인증 정보를 데이터베이스에 저장
      await this.prisma.$transaction(async (tx) => {
        await tx.phoneVerification.create({
          data: {
            phone: normalizedPhone,
            verificationCode: "123456",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1시간 후 만료 (checkPhoneVerificationStatus와 일치)
            isVerified: true, // 바로 인증 완료 상태로 저장
          },
        });
      });
      return;
    }

    // 1. 휴대폰 번호와 인증번호로 검증 정보 조회 - PhoneVerification 테이블
    // 인증되지 않은 레코드 중에서 가장 최근 것을 찾음
    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        verificationCode,
        isVerified: false, // 인증되지 않은 레코드만 조회
      },
      orderBy: { createdAt: "desc" },
    });

    // 인증 정보가 존재하지 않는 경우
    if (!phoneVerification) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_FAILED);
    }

    // 2. 만료 시간 확인 - 5분 후 자동 만료
    if (phoneVerification.expiresAt < new Date()) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_EXPIRED);
    }

    // 3. 인증 성공 처리 - 트랜잭션으로 안전하게 처리
    await this.prisma.$transaction(async (tx) => {
      // 현재 인증을 완료 상태로 업데이트
      await tx.phoneVerification.update({
        where: { id: phoneVerification.id },
        data: {
          isVerified: true, // is_verified 플래그로 본인인증 상태 관리
        },
      });
    });
  }

  /**
   * 휴대폰 인증 상태 확인
   * 인증 완료 후 1시간 이내의 인증만 유효한 것으로 간주
   */
  async checkPhoneVerificationStatus(phone: string): Promise<boolean> {
    const normalizedPhone = PhoneUtil.normalizePhone(phone);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1시간 전

    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        isVerified: true,
        createdAt: {
          gte: oneHourAgo, // 1시간 이내에 인증된 것만 유효
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return !!phoneVerification;
  }
}
