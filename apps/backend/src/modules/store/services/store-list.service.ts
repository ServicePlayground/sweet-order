import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";

/**
 * 스토어 목록 조회 서비스
 *
 * 스토어 목록 조회 관련 로직을 담당하는 서비스입니다.
 */
@Injectable()
export class StoreListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자의 스토어 목록 조회
   * @param userId 사용자 ID
   * @returns 스토어 목록
   */
  async getStoresByUserId(userId: string) {
    const stores = await this.prisma.store.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      stores: stores.map((store) => ({
        id: store.id,
        logoImageUrl: store.logoImageUrl,
        name: store.name,
        description: store.description,
        businessNo: store.businessNo,
        businessName: store.businessName,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      })),
    };
  }
}

