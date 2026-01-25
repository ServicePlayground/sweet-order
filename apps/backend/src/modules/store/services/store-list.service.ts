import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { StoreMapperUtil } from "@apps/backend/modules/store/utils/store-mapper.util";

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
      stores: await Promise.all(
        stores.map((store) => StoreMapperUtil.mapToStoreResponse(store, this.prisma)),
      ),
    };
  }

  /**
   * 스토어 상세 조회
   * @param storeId 스토어 ID
   * @returns 스토어 상세 정보
   */
  async getStoreById(storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    return StoreMapperUtil.mapToStoreResponse(store, this.prisma);
  }
}
