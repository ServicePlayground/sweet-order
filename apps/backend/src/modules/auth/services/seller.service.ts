import {
  Injectable,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PhoneUtil } from "@apps/backend/modules/auth/utils/phone.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  ChangePhoneRequestDto,
  FindAccountRequestDto,
} from "@apps/backend/modules/auth/dto/auth-request.dto";
import {
  AUTH_ERROR_MESSAGES,
  AUDIENCE,
  PhoneVerificationPurpose,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { PhoneService } from "@apps/backend/modules/auth/services/phone.service";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 판매자(Seller) 계정 — 구글 OAuth + 휴대폰 인증
 */
@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly phoneService: PhoneService,
  ) {}

  /**
   * 계정 찾기 — 휴대폰 인증(FIND_ACCOUNT) 완료 후, 해당 번호로 등록된 판매자의 구글 이메일(있을 때) 반환
   */
  async findAccount(dto: FindAccountRequestDto): Promise<{ googleEmail: string | null }> {
    const normalizedPhone = PhoneUtil.normalizePhone(dto.phone);
    const verified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedPhone,
      AUDIENCE.SELLER,
      PhoneVerificationPurpose.FIND_ACCOUNT,
    );
    if (!verified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    const row = await this.prisma.seller.findUnique({
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
    if (user.aud !== AUDIENCE.SELLER) {
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.AUDIENCE_NOT_AUTHORIZED);
    }

    const { newPhone } = changePhoneDto;
    const normalizedNewPhone = PhoneUtil.normalizePhone(newPhone);

    const current = await this.prisma.seller.findUnique({
      where: { id: user.sub },
    });

    if (!current) {
      LoggerUtil.log(`휴대폰 번호 변경 실패: seller 없음 - id: ${user.sub}`);
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    if (normalizedNewPhone === current.phone) {
      return;
    }

    const existingUser = await this.prisma.seller.findUnique({
      where: { phone: normalizedNewPhone },
    });

    if (existingUser) {
      throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS);
    }

    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedNewPhone,
      AUDIENCE.SELLER,
      PhoneVerificationPurpose.PHONE_CHANGE,
    );
    if (!isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    await this.prisma.seller.update({
      where: { id: current.id },
      data: { phone: normalizedNewPhone },
    });
  }
}
