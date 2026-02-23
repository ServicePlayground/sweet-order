import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  STORE_ERROR_MESSAGES,
  StoreSortBy,
} from "@apps/backend/modules/store/constants/store.constants";
import { StoreMapperUtil } from "@apps/backend/modules/store/utils/store-mapper.util";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-detail.dto";
import {
  GetStoresRequestDto,
  GetSellerStoresRequestDto,
} from "@apps/backend/modules/store/dto/store-list.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { LikeStoreDetailService } from "@apps/backend/modules/like/services/like-store-detail.service";
import { StoreOwnershipUtil } from "@apps/backend/modules/store/utils/store-ownership.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 스토어 목록 조회 서비스
 * 스토어 목록/상세 조회 관련 로직을 담당합니다.
 */
@Injectable()
export class StoreListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly likeStoreDetailService: LikeStoreDetailService,
  ) {}

  /**
   * 스토어 목록 조회 (사용자용)
   * 검색(스토어명), 정렬, 페이지네이션을 지원합니다. 로그인 시 각 스토어의 좋아요 여부(isLiked)를 반환합니다.
   */
  async getStoresForUser(query: GetStoresRequestDto, user?: JwtVerifiedPayload) {
    const { search, page, limit, sortBy } = query;
    const where = this.buildStoreWhereForUser(search);
    const orderBy = this.buildStoreOrderBy(sortBy ?? StoreSortBy.LATEST);

    const totalItems = await this.prisma.store.count({ where });
    const skip = (page - 1) * limit;

    const stores = await this.prisma.store.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const storeResponses = (await StoreMapperUtil.mapToStoreResponse(
      stores,
      this.prisma,
    )) as StoreResponseDto[];

    if (user?.sub) {
      const likedStoreIds = await this.getLikedStoreIds(
        user.sub,
        stores.map((s) => s.id),
      );
      for (const res of storeResponses) {
        res.isLiked = likedStoreIds.has(res.id);
      }
    }

    const meta = calculatePaginationMeta(page, limit, totalItems);
    return { data: storeResponses, meta };
  }

  /**
   * 스토어 상세 조회 (사용자용)
   * 로그인한 경우 해당 스토어의 좋아요 여부(isLiked)를 반환합니다.
   */
  async getStoreByIdForUser(storeId: string, user?: JwtVerifiedPayload) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      LoggerUtil.log(`스토어 상세 조회 실패: 스토어 없음 - storeId: ${storeId}`);
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 좋아요 여부 확인 (로그인한 사용자의 경우)
    let isLiked: boolean | null = null;
    if (user?.sub) {
      try {
        isLiked = await this.likeStoreDetailService.isStoreLiked(user.sub, storeId);
      } catch (error: unknown) {
        // 스토어 삭제 등 경합으로 좋아요 조회 시점에 대상이 사라진 경우에만 null 처리
        if (!(error instanceof NotFoundException)) {
          throw error;
        }
        isLiked = null;
      }
    }

    const storeResponse = (await StoreMapperUtil.mapToStoreResponse(
      store,
      this.prisma,
    )) as StoreResponseDto;
    storeResponse.isLiked = isLiked;

    return storeResponse;
  }

  /**
   * 내 스토어 목록 조회 (판매자용)
   * 검색(스토어명), 정렬, 페이지네이션을 지원합니다.
   */
  async getStoresByUserIdForSeller(userId: string, query: GetSellerStoresRequestDto) {
    const { search, page, limit, sortBy } = query;
    const where = this.buildStoreWhereForSeller(userId, search);
    const orderBy = this.buildStoreOrderBy(sortBy ?? StoreSortBy.LATEST);

    const totalItems = await this.prisma.store.count({ where });
    const skip = (page - 1) * limit;

    const stores = await this.prisma.store.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const storeResponses = (await StoreMapperUtil.mapToStoreResponse(
      stores,
      this.prisma,
    )) as StoreResponseDto[];

    const likedStoreIds = await this.getLikedStoreIds(
      userId,
      stores.map((s) => s.id),
    );
    for (const res of storeResponses) {
      res.isLiked = likedStoreIds.has(res.id);
    }

    const meta = calculatePaginationMeta(page, limit, totalItems);
    return { data: storeResponses, meta };
  }

  /**
   * 내 스토어 상세 조회 (판매자용)
   * 자신이 소유한 스토어만 조회 가능합니다.
   */
  async getStoreByIdForSeller(storeId: string, user: JwtVerifiedPayload) {
    await StoreOwnershipUtil.verifyStoreOwnership(this.prisma, storeId, user.sub);

    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      LoggerUtil.log(`스토어 상세 조회 실패: 스토어 없음 - storeId: ${storeId}`);
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    let isLiked: boolean | null = null;
    try {
      isLiked = await this.likeStoreDetailService.isStoreLiked(user.sub, storeId);
    } catch (error: unknown) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
      isLiked = null;
    }

    const storeResponse = (await StoreMapperUtil.mapToStoreResponse(
      store,
      this.prisma,
    )) as StoreResponseDto;
    storeResponse.isLiked = isLiked;

    return storeResponse;
  }

  private buildStoreWhereForUser(search?: string): Prisma.StoreWhereInput {
    if (!search?.trim()) return {};
    const keyword = search.trim();
    return { name: { contains: keyword, mode: "insensitive" } };
  }

  private buildStoreWhereForSeller(userId: string, search?: string): Prisma.StoreWhereInput {
    const where: Prisma.StoreWhereInput = { userId };
    if (search?.trim()) {
      const keyword = search.trim();
      where.name = { contains: keyword, mode: "insensitive" };
    }
    return where;
  }

  private buildStoreOrderBy(
    sortBy: StoreSortBy,
  ): Prisma.StoreOrderByWithRelationInput | Prisma.StoreOrderByWithRelationInput[] {
    switch (sortBy) {
      case StoreSortBy.POPULAR:
        return { likeCount: "desc" };
      case StoreSortBy.LATEST:
      default:
        return { createdAt: "desc" };
    }
  }

  /**
   * 여러 스토어에 대한 좋아요 여부를 한 번에 조회 (N+1 방지)
   */
  private async getLikedStoreIds(userId: string, storeIds: string[]): Promise<Set<string>> {
    if (storeIds.length === 0) return new Set<string>();
    const likes = await this.prisma.storeLike.findMany({
      where: { userId, storeId: { in: storeIds } },
      select: { storeId: true },
    });
    return new Set(likes.map((l) => l.storeId));
  }
}
