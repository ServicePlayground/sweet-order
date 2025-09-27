import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@web-user/backend/database/prisma.service";
import { PhoneUtil } from "@web-user/backend/modules/auth/utils/phone.util";
import { AUTH_ERROR_MESSAGES } from "@web-user/backend/modules/auth/constants/auth.constants";
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

    // 1. 24시간 기준 최대 10회 제한 확인 (휴대폰 인증 완료 시 카운트 초기화)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 마지막으로 인증이 완료된 시점을 확인
    const lastVerifiedVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        isVerified: true,
      },
      orderBy: { createdAt: "desc" }, // createdAt 기준
    });

    // 인증 완료 시점 이후의 발송 횟수만 카운트 (카운트 초기화 효과)
    const countFromDate = lastVerifiedVerification
      ? lastVerifiedVerification.createdAt > twentyFourHoursAgo
        ? lastVerifiedVerification.createdAt // 케이스 1: 마지막 인증 완료가 24시간 이내 → 그 시점부터 카운트
        : twentyFourHoursAgo // 케이스 2: 마지막 인증 완료가 24시간 이전 → 24시간 전부터 카운트
      : twentyFourHoursAgo; // 케이스 3: 인증 완료된 적 없음 → 24시간 전부터 카운트

    const recentVerifications = await this.prisma.phoneVerification.count({
      where: {
        phone: normalizedPhone,
        createdAt: {
          gte: countFromDate,
        },
      },
    });

    if (recentVerifications >= 10) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_LIMIT_EXCEEDED);
    }

    // 2. 인증번호 생성 - 6자리 인증번호
    const verificationCode = PhoneUtil.generateVerificationCode();
    const expiresAt = PhoneUtil.getExpirationTime(5); // 5분 후 만료

    // 3. 트랜잭션으로 인증 정보 저장 - PhoneVerification 테이블
    await this.prisma.$transaction(async (tx) => {
      await tx.phoneVerification.create({
        data: {
          phone: normalizedPhone,
          verificationCode,
          expiresAt,
        },
      });
    });

    // 4. SMS 발송 - ERD 요구사항: 신뢰할 수 있는 인증 서비스 연동
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
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_FAILED);
    }

    // 2. 인증 상태 확인 - is_verified 플래그 확인
    if (phoneVerification.isVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_ALREADY_VERIFIED);
    }

    // 3. 만료 시간 확인 - 5분 후 자동 만료
    if (phoneVerification.expiresAt < new Date()) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_EXPIRED);
    }

    // 4. 인증 성공 처리 - 트랜잭션으로 안전하게 처리
    await this.prisma.$transaction(async (tx) => {
      // 현재 인증을 완료 상태로 업데이트
      await tx.phoneVerification.update({
        where: { id: phoneVerification.id },
        data: {
          isVerified: true, // is_verified 플래그로 본인인증 상태 관리
        },
      });

      // 해당 휴대폰의 모든 미완료 인증 기록 삭제 (24시간 카운트 초기화)
      await tx.phoneVerification.deleteMany({
        where: {
          phone: normalizedPhone,
          isVerified: false,
          id: {
            not: phoneVerification.id, // 현재 인증된 기록은 제외
          },
        },
      });
    });
  }
}
