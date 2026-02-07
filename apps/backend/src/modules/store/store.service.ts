import { Injectable } from "@nestjs/common";
import { StoreCreationService } from "@apps/backend/modules/store/services/store-creation.service";
import { StoreListService } from "@apps/backend/modules/store/services/store-list.service";
import { StoreLikeService } from "@apps/backend/modules/store/services/store-like.service";
import { StoreReviewService } from "@apps/backend/modules/store/services/store-review.service";
import { StoreUpdateService } from "@apps/backend/modules/store/services/store-update.service";
import {
  CreateStoreRequestDto,
  UpdateStoreRequestDto,
} from "@apps/backend/modules/store/dto/store.request.dto";
import { GetStoreReviewsRequestDto } from "@apps/backend/modules/store/dto/store-review-request.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 스토어 서비스
 *
 * 스토어 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * StoreCreationService, StoreListService를 조합하여 사용합니다.
 */
@Injectable()
export class StoreService {
  constructor(
    private readonly storeCreationService: StoreCreationService,
    private readonly storeListService: StoreListService,
    private readonly storeLikeService: StoreLikeService,
    private readonly storeReviewService: StoreReviewService,
    private readonly storeUpdateService: StoreUpdateService,
  ) {}

  /**
   * 스토어 생성 (3단계)
   * 1단계, 2단계 API를 다시 호출하여 검증하고 스토어를 생성합니다.
   */
  async createStore(userId: string, createStoreDto: CreateStoreRequestDto) {
    return await this.storeCreationService.createStore(userId, createStoreDto);
  }

  /**
   * 스토어 상세 조회
   * @param storeId 스토어 ID
   * @returns 스토어 상세 정보
   */
  async getStoreById(storeId: string) {
    return await this.storeListService.getStoreById(storeId);
  }

  /**
   * 스토어 좋아요 추가
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   */
  async addStoreLike(userId: string, storeId: string) {
    return this.storeLikeService.addStoreLike(userId, storeId);
  }

  /**
   * 스토어 좋아요 삭제
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   */
  async removeStoreLike(userId: string, storeId: string) {
    return this.storeLikeService.removeStoreLike(userId, storeId);
  }

  /**
   * 스토어 좋아요 여부 확인
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   * @returns 좋아요 여부
   */
  async isStoreLiked(userId: string, storeId: string): Promise<boolean> {
    return this.storeLikeService.isLiked(userId, storeId);
  }

  /**
   * 스토어 후기 목록 조회
   * 해당 스토어의 모든 상품에 대한 후기를 합쳐서 보여줍니다.
   * @param storeId 스토어 ID
   * @param query 조회 쿼리
   * @returns 후기 목록
   */
  async getStoreReviews(storeId: string, query: GetStoreReviewsRequestDto) {
    return this.storeReviewService.getStoreReviews(storeId, query);
  }

  /**
   * 스토어 후기 단일 조회
   * 해당 스토어의 상품 중 하나에 대한 후기를 조회합니다.
   * @param storeId 스토어 ID
   * @param reviewId 후기 ID
   * @returns 후기 상세 정보
   */
  async getStoreReview(storeId: string, reviewId: string) {
    return this.storeReviewService.getStoreReview(storeId, reviewId);
  }

  /**
   * 사용자의 스토어 목록 조회 (판매자용)
   * @param userId 사용자 ID
   * @returns 스토어 목록
   */
  async getStoresByUserId(userId: string) {
    return await this.storeListService.getStoresByUserId(userId);
  }

  /**
   * 스토어 상세 조회 (판매자용)
   * @param storeId 스토어 ID
   * @param user 인증된 사용자 정보
   * @returns 스토어 상세 정보
   */
  async getStoreByIdForSeller(storeId: string, user: JwtVerifiedPayload) {
    return await this.storeListService.getStoreByIdForSeller(storeId, user);
  }

  /**
   * 스토어 수정 (판매자용)
   * @param storeId 스토어 ID
   * @param updateStoreDto 수정할 스토어 정보
   * @param user 인증된 사용자 정보
   * @returns 수정된 스토어 ID
   */
  async updateStore(
    storeId: string,
    updateStoreDto: UpdateStoreRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return await this.storeUpdateService.updateStore(storeId, updateStoreDto, user);
  }
}
