import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { StoreMapperUtil } from "@apps/backend/modules/store/utils/store-mapper.util";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-detail.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { LikeStoreDetailService } from "@apps/backend/modules/like/services/like-store-detail.service";
import { StoreOwnershipUtil } from "@apps/backend/modules/store/utils/store-ownership.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 스토어 목록 조회 서비스
 *
 * 스토어 목록 조회 관련 로직을 담당하는 서비스입니다.
 */
@Injectable()
export class StoreListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly likeStoreDetailService: LikeStoreDetailService,
  ) {}

  /**
   * 스토어 상세 조회 (사용자용)
   * @param storeId 스토어 ID
   * @param user 로그인한 사용자 정보 (옵셔널)
   * @returns 스토어 상세 정보
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
   * 사용자의 스토어 목록 조회 (판매자용)
   * 현재 로그인한 사용자(판매자)가 자신의 스토어 목록을 조회합니다.
   * @param userId 사용자 ID (현재 로그인한 사용자)
   * @param query 페이지네이션 쿼리 파라미터
   * @returns 스토어 목록
   */
  async getStoresByUserIdForSeller(userId: string, query: PaginationRequestDto) {
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

    // 스토어 응답 매핑
    const storeResponses = (await StoreMapperUtil.mapToStoreResponse(
      stores,
      this.prisma,
    )) as StoreResponseDto[];

    // 페이지네이션 메타 정보
    const meta = calculatePaginationMeta(page, limit, totalItems);

    return {
      data: storeResponses,
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
    // 스토어 소유권 확인
    await StoreOwnershipUtil.verifyStoreOwnership(this.prisma, storeId, user.sub);

    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      LoggerUtil.log(`스토어 상세 조회 실패: 스토어 없음 - storeId: ${storeId}`);
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 좋아요 여부 확인 (현재 로그인한 사용자(판매자)가 자신의 스토어를 좋아요 했는지 확인)
    let isLiked: boolean | null = null;
    try {
      isLiked = await this.likeStoreDetailService.isStoreLiked(user.sub, storeId);
    } catch (error: unknown) {
      // 스토어 삭제 등 경합으로 좋아요 조회 시점에 대상이 사라진 경우에만 null 처리
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
}
