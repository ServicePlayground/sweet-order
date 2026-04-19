import { Consumer } from "@apps/backend/infra/database/prisma/generated/client";
import { ConsumerInfo } from "@apps/backend/modules/auth/types/auth.types";

export class ConsumerMapperUtil {
  static mapConsumerToInfo(user: Consumer, lastLoginAt?: Date): ConsumerInfo {
    return {
      id: user.id,
      phone: user.phone,
      name: user.name ?? "",
      nickname: user.nickname ?? "",
      profileImageUrl: user.profileImageUrl ?? "",
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      googleId: user.googleId ?? "",
      googleEmail: user.googleEmail ?? "",
      createdAt: user.createdAt,
      lastLoginAt: lastLoginAt ?? user.lastLoginAt ?? new Date(),
    };
  }
}
