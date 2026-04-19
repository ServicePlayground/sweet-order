import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PhoneUtil } from "@apps/backend/modules/auth/utils/phone.util";
import { ConsumerInfo, JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  ChangePhoneRequestDto,
  FindAccountRequestDto,
} from "@apps/backend/modules/auth/dto/auth-request.dto";
import {
  AUTH_ERROR_MESSAGES,
  AUDIENCE,
  PhoneVerificationPurpose,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { ConsumerMapperUtil } from "@apps/backend/modules/auth/utils/consumer-mapper.util";
import { PhoneService } from "@apps/backend/modules/auth/services/phone.service";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 구매자(Consumer) 계정 — 구글 OAuth + 휴대폰 인증
 */
@Injectable()
export class ConsumerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly phoneService: PhoneService,
  ) {}

  /**
   * 계정 찾기 — 휴대폰 인증(FIND_ACCOUNT) 완료 후, 해당 번호로 등록된 구매자의 구글 이메일(있을 때) 반환
   */
  async findAccount(dto: FindAccountRequestDto): Promise<{ googleEmail: string | null }> {
    const normalizedPhone = PhoneUtil.normalizePhone(dto.phone);
    const verified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedPhone,
      AUDIENCE.CONSUMER,
      PhoneVerificationPurpose.FIND_ACCOUNT,
    );
    if (!verified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    const row = await this.prisma.consumer.findUnique({
      where: { phone: normalizedPhone },
      select: { googleEmail: true },
    });
    if (!row) {
      throw new NotFoundException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND_BY_PHONE);
    }

    return { googleEmail: row.googleEmail ?? null };
  }

  async changePhone(
    changePhoneDto: ChangePhoneRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<void> {
    if (user.aud !== AUDIENCE.CONSUMER) {
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.AUDIENCE_NOT_AUTHORIZED);
    }

    const { newPhone } = changePhoneDto;
    const normalizedNewPhone = PhoneUtil.normalizePhone(newPhone);

    const currentUser = await this.prisma.consumer.findUnique({
      where: { id: user.sub },
    });

    if (!currentUser) {
      LoggerUtil.log(`휴대폰 번호 변경 실패: consumer 없음 - id: ${user.sub}`);
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    if (normalizedNewPhone === currentUser.phone) {
      return;
    }

    const existingUser = await this.prisma.consumer.findUnique({
      where: { phone: normalizedNewPhone },
    });

    if (existingUser) {
      throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS);
    }

    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedNewPhone,
      AUDIENCE.CONSUMER,
      PhoneVerificationPurpose.PHONE_CHANGE,
    );
    if (!isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    await this.prisma.consumer.update({
      where: { id: currentUser.id },
      data: { phone: normalizedNewPhone },
    });
  }

  /** 마이페이지 등 — 구매자 프로필 (DB 조회) */
  async getProfile(user: JwtVerifiedPayload): Promise<ConsumerInfo> {
    if (user.aud !== AUDIENCE.CONSUMER) {
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.AUDIENCE_NOT_AUTHORIZED);
    }

    const row = await this.prisma.consumer.findUnique({
      where: { id: user.sub },
    });

    if (!row) {
      LoggerUtil.log(`구매자 프로필 조회 실패: consumer 없음 - id: ${user.sub}`);
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    return ConsumerMapperUtil.mapConsumerToInfo(row);
  }
}
