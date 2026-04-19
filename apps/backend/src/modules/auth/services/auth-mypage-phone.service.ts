import {
  Injectable,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PhoneUtil } from "@apps/backend/modules/auth/utils/phone.util";
import { ChangePhoneRequestDto } from "@apps/backend/modules/auth/dto/mypage-profile.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { AuthPhoneService } from "@apps/backend/modules/auth/services/auth-phone.service";
import {
  AUTH_ERROR_MESSAGES,
  AUDIENCE,
  PhoneVerificationPurpose,
  type AudienceConst,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 마이페이지 — 휴대폰 번호 변경 (구매자·판매자)
 */
@Injectable()
export class AuthMypagePhoneService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authPhoneService: AuthPhoneService,
  ) {}

  async changePhone(
    changePhoneDto: ChangePhoneRequestDto,
    user: JwtVerifiedPayload,
    audience: typeof AUDIENCE.CONSUMER | typeof AUDIENCE.SELLER,
  ): Promise<void> {
    if (user.aud !== audience) {
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.AUDIENCE_NOT_AUTHORIZED);
    }

    const { newPhone } = changePhoneDto;
    const normalizedNewPhone = PhoneUtil.normalizePhone(newPhone);
    const aud = audience as AudienceConst;

    if (audience === AUDIENCE.CONSUMER) {
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

      const isPhoneVerified = await this.authPhoneService.checkPhoneVerificationStatus(
        normalizedNewPhone,
        aud,
        PhoneVerificationPurpose.PHONE_CHANGE,
      );
      if (!isPhoneVerified) {
        throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
      }

      await this.prisma.consumer.update({
        where: { id: currentUser.id },
        data: { phone: normalizedNewPhone },
      });
      return;
    }

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

    const isPhoneVerified = await this.authPhoneService.checkPhoneVerificationStatus(
      normalizedNewPhone,
      aud,
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
