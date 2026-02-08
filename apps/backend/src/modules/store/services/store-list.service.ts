import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { StoreMapperUtil } from "@apps/backend/modules/store/utils/store-mapper.util";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-response.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { GetStoresRequestDto } from "@apps/backend/modules/store/dto/store.request.dto";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";

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

    return (await StoreMapperUtil.mapToStoreResponse(store, this.prisma)) as StoreResponseDto;
  }

  /**
   * 사용자의 스토어 목록 조회 (판매자용)
   * @param userId 사용자 ID
   * @param query 페이지네이션 쿼리 파라미터
   * @returns 스토어 목록
   */
  async getStoresByUserId(userId: string, query: GetStoresRequestDto) {
    const { page, limit } = query;

    // 전체 개수 조회
    const totalItems = await this.prisma.store.count({
      where: { userId },
    });

    // 페이지네이션 계산
    const skip = (page - 1) * limit;

    const stores = await this.prisma.store.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // 페이지네이션 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: (await StoreMapperUtil.mapToStoreResponse(stores, this.prisma)) as StoreResponseDto[],
      meta,
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

    return (await StoreMapperUtil.mapToStoreResponse(fullStore, this.prisma)) as StoreResponseDto;
  }
}
