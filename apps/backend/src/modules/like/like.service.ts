import { Injectable } from "@nestjs/common";
import { LikeDataService } from "@apps/backend/modules/like/services/like.service";

/**
 * 좋아요 서비스
 *
 * 모든 좋아요 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * LikeDataService를 조합하여 사용합니다.
 */
@Injectable()
export class LikeService {
  constructor(private readonly likeDataService: LikeDataService) {}

  /**
   * 상품 좋아요 추가
   */
  async addProductLike(userId: string, productId: string) {
    return this.likeDataService.addProductLike(userId, productId);
  }

  /**
   * 상품 좋아요 삭제
   */
  async removeProductLike(userId: string, productId: string) {
    return this.likeDataService.removeProductLike(userId, productId);
  }

  /**
   * 상품 좋아요 여부 확인
   */
  async isProductLiked(userId: string, productId: string): Promise<boolean> {
    return this.likeDataService.isProductLiked(userId, productId);
  }

  /**
   * 스토어 좋아요 추가
   */
  async addStoreLike(userId: string, storeId: string) {
    return this.likeDataService.addStoreLike(userId, storeId);
  }

  /**
   * 스토어 좋아요 삭제
   */
  async removeStoreLike(userId: string, storeId: string) {
    return this.likeDataService.removeStoreLike(userId, storeId);
  }

  /**
   * 스토어 좋아요 여부 확인
   */
  async isStoreLiked(userId: string, storeId: string): Promise<boolean> {
    return this.likeDataService.isStoreLiked(userId, storeId);
  }
}
