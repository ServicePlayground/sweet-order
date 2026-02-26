import { Injectable } from "@nestjs/common";
import { LikeProductCreateService } from "@apps/backend/modules/like/services/like-product-create.service";
import { LikeProductDeleteService } from "@apps/backend/modules/like/services/like-product-delete.service";
import { LikeProductDetailService } from "@apps/backend/modules/like/services/like-product-detail.service";
import { LikeStoreCreateService } from "@apps/backend/modules/like/services/like-store-create.service";
import { LikeStoreDeleteService } from "@apps/backend/modules/like/services/like-store-delete.service";
import { LikeStoreDetailService } from "@apps/backend/modules/like/services/like-store-detail.service";
import { LikeUserListService } from "@apps/backend/modules/like/services/like-user-list.service";
import {
  GetStoresRequestDto,
  StoreListResponseDto,
} from "@apps/backend/modules/store/dto/store-list.dto";
import {
  GetProductsRequestDto,
  ProductListResponseDto,
} from "@apps/backend/modules/product/dto/product-list.dto";

/**
 * 좋아요 서비스
 *
 * 모든 좋아요 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * CRUD 서비스들을 조합하여 사용합니다.
 */
@Injectable()
export class LikeService {
  constructor(
    private readonly likeProductCreateService: LikeProductCreateService,
    private readonly likeProductDeleteService: LikeProductDeleteService,
    private readonly likeProductDetailService: LikeProductDetailService,
    private readonly likeStoreCreateService: LikeStoreCreateService,
    private readonly likeStoreDeleteService: LikeStoreDeleteService,
    private readonly likeStoreDetailService: LikeStoreDetailService,
    private readonly likeUserListService: LikeUserListService,
  ) {}

  /**
   * 상품 좋아요 추가 (사용자용)
   */
  async addProductLikeForUser(userId: string, productId: string) {
    return this.likeProductCreateService.addProductLikeForUser(userId, productId);
  }

  /**
   * 상품 좋아요 삭제 (사용자용)
   */
  async removeProductLikeForUser(userId: string, productId: string) {
    return this.likeProductDeleteService.removeProductLikeForUser(userId, productId);
  }

  /**
   * 스토어 좋아요 추가 (사용자용)
   */
  async addStoreLikeForUser(userId: string, storeId: string) {
    return this.likeStoreCreateService.addStoreLikeForUser(userId, storeId);
  }

  /**
   * 스토어 좋아요 삭제 (사용자용)
   */
  async removeStoreLikeForUser(userId: string, storeId: string) {
    return this.likeStoreDeleteService.removeStoreLikeForUser(userId, storeId);
  }

  /**
   * 내가 좋아요한 스토어 목록 조회 (사용자용)
   */
  async getMyStoreLikesForUser(
    userId: string,
    query: GetStoresRequestDto,
  ): Promise<StoreListResponseDto> {
    return this.likeUserListService.getMyStoreLikesForUser(userId, query);
  }

  /**
   * 내가 좋아요한 상품 목록 조회 (사용자용)
   */
  async getMyProductLikesForUser(
    userId: string,
    query: GetProductsRequestDto,
  ): Promise<ProductListResponseDto> {
    return this.likeUserListService.getMyProductLikesForUser(userId, query);
  }
}
