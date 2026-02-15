import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PhoneUtil } from "@apps/backend/modules/auth/utils/phone.util";
import {
  AUTH_ERROR_MESSAGES,
  PhoneVerificationPurpose,
} from "@apps/backend/modules/auth/constants/auth.constants";
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
   * @param sendCodeDto 휴대폰 번호와 인증 목적
   * @throws BadRequestException 잘못된 휴대폰 번호 형식이거나 재발송 제한에 걸린 경우
   */
  async sendVerificationCode(sendCodeDto: SendVerificationCodeRequestDto): Promise<void> {
    const { phone, purpose } = sendCodeDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 1. 인증번호 생성
    const verificationCode = PhoneUtil.generateVerificationCode();
    const expiresAt = PhoneUtil.getExpirationTime(5); // 5분 후 만료

    // 2. 트랜잭션으로 인증 정보 저장 - PhoneVerification 테이블
    await this.prisma.$transaction(
      async (tx) => {
        // 기존 미인증 레코드 삭제 (같은 목적의 인증코드만 삭제하여 다른 목적의 인증코드는 유지)
        await tx.phoneVerification.deleteMany({
          where: {
            phone: normalizedPhone,
            purpose,
            isVerified: false,
          },
        });

        // 새 인증 정보 생성
        await tx.phoneVerification.create({
          data: {
            phone: normalizedPhone,
            verificationCode,
            expiresAt,
            purpose,
          },
        });
      },
      {
        maxWait: 5000, // 최대 대기 시간 (5초)
        timeout: 10000, // 타임아웃 (10초)
      },
    );

    // 3. SMS 발송 - ERD 요구사항: 신뢰할 수 있는 인증 서비스 연동
    // TODO: 실제 SMS 발송 서비스 연동 (예: 네이버 클라우드 플랫폼, 카카오 알림톡 등)
  }

  /**
   * 휴대폰 인증번호 확인
   *
   * @param verifyCodeDto 휴대폰 번호, 인증번호, 인증 목적
   * @throws BadRequestException 인증번호가 잘못되었거나 만료되었거나 시도 횟수를 초과한 경우
   */
  async verifyPhoneCode(verifyCodeDto: VerifyPhoneCodeRequestDto): Promise<void> {
    const { phone, verificationCode, purpose } = verifyCodeDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // ------- TODO: 삭제 필요 (임시 처리: 인증 통과) -------
    if (verificationCode === "777777") {
      const existingVerification = await this.prisma.phoneVerification.findFirst({
        where: {
          phone: normalizedPhone,
          purpose,
          isVerified: false, // 인증되지 않은 레코드만 조회
        },
        orderBy: { createdAt: "desc" }, // 가장 최근 순 정렬
      });

      // 인증 정보가 존재하지 않는 경우
      if (!existingVerification) {
        throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_FAILED);
      }

      // 2. 만료 시간 확인 - 5분 후 자동 만료
      if (existingVerification.expiresAt < new Date()) {
        throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_EXPIRED);
      }

      await this.prisma.$transaction(
        async (tx) => {
          await tx.phoneVerification.update({
            where: { id: existingVerification.id },
            data: {
              isVerified: true, // is_verified 플래그로 본인인증 상태 관리
            },
          });
        },
        {
          maxWait: 5000, // 최대 대기 시간 (5초)
          timeout: 10000, // 타임아웃 (10초)
        },
      );
      return;
    }

    // 1. 휴대폰 번호, 인증번호, 목적으로 검증 정보 조회 - PhoneVerification 테이블
    // 인증되지 않은 레코드 중에서 가장 최근 것을 찾음
    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        verificationCode,
        purpose, // 목적별로 구분하여 검증
        isVerified: false, // 인증되지 않은 레코드만 조회
      },
      orderBy: { createdAt: "desc" }, // 가장 최근 순 정렬
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
    await this.prisma.$transaction(
      async (tx) => {
        // 현재 인증을 완료 상태로 업데이트
        await tx.phoneVerification.update({
          where: { id: phoneVerification.id },
          data: {
            isVerified: true, // is_verified 플래그로 본인인증 상태 관리
          },
        });
      },
      {
        maxWait: 5000, // 최대 대기 시간 (5초)
        timeout: 10000, // 타임아웃 (10초)
      },
    );
  }

  /**
   * 휴대폰 인증 상태 확인
   * 인증 완료 후 1시간 이내의 인증만 유효한 것으로 간주
   * createdAt과 expiresAt 모두 확인하여 안전하게 검증
   *
   * @param phone 휴대폰 번호
   * @param purpose 인증 목적 (선택적, 기본값: 회원가입)
   * @returns 인증 상태 유효 여부
   */
  async checkPhoneVerificationStatus(
    phone: string,
    purpose: PhoneVerificationPurpose,
  ): Promise<boolean> {
    const normalizedPhone = PhoneUtil.normalizePhone(phone);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1시간 전

    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        purpose, // 목적별로 구분하여 확인
        isVerified: true, // 인증된 레코드만 유효
        createdAt: {
          gte: oneHourAgo, // 1시간 이내에 인증된 것만 유효
        },
      },
      orderBy: { createdAt: "desc" }, // 가장 최근 인증 레코드만 유효
    });

    return !!phoneVerification;
  }
}
