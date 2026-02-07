import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { StoreMapperUtil } from "@apps/backend/modules/store/utils/store-mapper.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 스토어 목록 조회 서비스
 *
 * 스토어 목록 조회 관련 로직을 담당하는 서비스입니다.
 */
@Injectable()
export class StoreListService {
  constructor(private readonly prisma: PrismaService) {}

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

  /**
   * 사용자의 스토어 목록 조회 (판매자용)
   * @param userId 사용자 ID
   * @returns 스토어 목록
   */
  async getStoresByUserId(userId: string) {
    const stores = await this.prisma.store.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      stores: await StoreMapperUtil.mapToStoreResponseBatch(stores, this.prisma),
    };
  }

  /**
   * 스토어 상세 조회 (판매자용)
   * 자신이 소유한 스토어만 조회 가능합니다.
   * @param storeId 스토어 ID
   * @param user 인증된 사용자 정보
   * @returns 스토어 상세 정보
   */
  async getStoreByIdForSeller(storeId: string, user: JwtVerifiedPayload) {
    const store = await this.prisma.store.findFirst({
      where: { id: storeId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (store.userId !== user.sub) {
      throw new UnauthorizedException(STORE_ERROR_MESSAGES.FORBIDDEN);
    }

    // 전체 스토어 정보 조회
    const fullStore = await this.prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!fullStore) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    return StoreMapperUtil.mapToStoreResponse(fullStore, this.prisma);
  }
}
