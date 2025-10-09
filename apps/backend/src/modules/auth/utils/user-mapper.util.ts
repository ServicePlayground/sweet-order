import { User } from "@apps/backend/infra/database/prisma/generated/client";
import { UserInfo } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 사용자 매핑 유틸리티
 * Prisma User 엔티티를 UserInfo 인터페이스로 변환하는 공통 로직을 제공합니다.
 */
export class UserMapperUtil {
  /**
   * Prisma User 엔티티를 UserInfo 인터페이스로 변환
   * @param user - Prisma User 엔티티
   * @param lastLoginAt - 마지막 로그인 시간 (선택적, 기본값은 user.lastLoginAt)
   * @returns UserInfo 객체
   */
  static mapToUserInfo(user: User, lastLoginAt?: Date): UserInfo {
    return {
      id: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name ?? "",
      nickname: user.nickname ?? "",
      email: user.email ?? "",
      profileImageUrl: user.profileImageUrl ?? "",
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      userId: user.userId ?? "",
      googleId: user.googleId ?? "",
      googleEmail: user.googleEmail ?? "",
      createdAt: user.createdAt,
      lastLoginAt: lastLoginAt ?? user.lastLoginAt ?? new Date(),
    };
  }
}
