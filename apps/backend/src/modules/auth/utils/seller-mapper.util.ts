import { Seller } from "@apps/backend/infra/database/prisma/generated/client";
import { SellerInfo } from "@apps/backend/modules/auth/types/auth.types";

export class SellerMapperUtil {
  static mapToSellerInfo(seller: Seller, lastLoginAt?: Date): SellerInfo {
    return {
      id: seller.id,
      phone: seller.phone,
      name: seller.name ?? "",
      nickname: seller.nickname ?? "",
      profileImageUrl: seller.profileImageUrl ?? "",
      isPhoneVerified: seller.isPhoneVerified,
      isActive: seller.isActive,
      googleId: seller.googleId ?? "",
      googleEmail: seller.googleEmail ?? "",
      sellerVerificationStatus: seller.sellerVerificationStatus,
      createdAt: seller.createdAt,
      lastLoginAt: lastLoginAt ?? seller.lastLoginAt ?? new Date(),
    };
  }
}
