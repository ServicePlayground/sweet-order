import { Consumer } from "@apps/backend/infra/database/prisma/generated/client";
import { ConsumerMypageProfileResponseDto } from "@apps/backend/modules/auth/dto/mypage-profile.dto";

export class ConsumerMapperUtil {
  static mapConsumerToInfo(user: Consumer, lastLoginAt?: Date): ConsumerMypageProfileResponseDto {
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
