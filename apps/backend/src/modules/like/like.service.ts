import { Injectable } from "@nestjs/common";
import { LikeProductCreateService } from "@apps/backend/modules/like/services/like-product-create.service";
import { LikeProductDeleteService } from "@apps/backend/modules/like/services/like-product-delete.service";
import { LikeProductDetailService } from "@apps/backend/modules/like/services/like-product-detail.service";
import { LikeStoreCreateService } from "@apps/backend/modules/like/services/like-store-create.service";
import { LikeStoreDeleteService } from "@apps/backend/modules/like/services/like-store-delete.service";
import { LikeStoreDetailService } from "@apps/backend/modules/like/services/like-store-detail.service";

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
  ) {}

  /**
   * 상품 좋아요 추가
   */
  async addProductLike(userId: string, productId: string) {
    return this.likeProductCreateService.addProductLike(userId, productId);
  }

  /**
   * 상품 좋아요 삭제
   */
  async removeProductLike(userId: string, productId: string) {
    return this.likeProductDeleteService.removeProductLike(userId, productId);
  }

  /**
   * 스토어 좋아요 추가
   */
  async addStoreLike(userId: string, storeId: string) {
    return this.likeStoreCreateService.addStoreLike(userId, storeId);
  }

  /**
   * 스토어 좋아요 삭제
   */
  async removeStoreLike(userId: string, storeId: string) {
    return this.likeStoreDeleteService.removeStoreLike(userId, storeId);
  }
}
