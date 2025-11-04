import { Store } from "@apps/backend/infra/database/prisma/generated/client";
import { StoreInfo } from "@apps/backend/modules/store/types/store.types";

/**
 * 스토어 매핑 유틸리티
 * Prisma Store 엔티티를 응답 DTO로 변환하는 공통 로직을 제공합니다.
 */
export class StoreMapperUtil {
  /**
   * Prisma Store 엔티티를 StoreInfo 인터페이스로 변환
   * @param store - Prisma Store 엔티티
   * @returns StoreInfo 객체
   */
  static mapToStoreResponse(store: Store): StoreInfo {
    return {
      id: store.id,
      userId: store.userId,
      logoImageUrl: store.logoImageUrl ?? undefined,
      name: store.name,
      description: store.description ?? undefined,
      businessNo: store.businessNo,
      representativeName: store.representativeName,
      openingDate: store.openingDate,
      businessName: store.businessName,
      businessSector: store.businessSector,
      businessType: store.businessType,
      permissionManagementNumber: store.permissionManagementNumber,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    };
  }
}
