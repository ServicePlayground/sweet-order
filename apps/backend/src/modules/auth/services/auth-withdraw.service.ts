import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  AUTH_ERROR_MESSAGES,
  AudienceConst,
  AUDIENCE,
} from "@apps/backend/modules/auth/constants/auth.constants";

@Injectable()
export class AuthWithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  async withdraw(audience: AudienceConst, accountId: string, reason: string): Promise<void> {
    const withdrawAt = new Date();

    if (audience === AUDIENCE.CONSUMER) {
      const row = await this.prisma.consumer.findUnique({
        where: { id: accountId },
        select: { id: true },
      });
      if (!row) {
        throw new NotFoundException(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
      }

      await this.prisma.consumer.update({
        where: { id: accountId },
        data: {
          isActive: false,
          withdrawReason: reason,
          withdrawnAt: withdrawAt,
        },
      });
      return;
    }

    const row = await this.prisma.seller.findUnique({
      where: { id: accountId },
      select: { id: true },
    });
    if (!row) {
      throw new NotFoundException(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await this.prisma.seller.update({
      where: { id: accountId },
      data: {
        isActive: false,
        withdrawReason: reason,
        withdrawnAt: withdrawAt,
      },
    });
  }
}
