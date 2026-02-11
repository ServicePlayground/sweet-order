import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 스토어 좋아요 상세 서비스
 * 스토어 좋아요 여부 확인 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeStoreDetailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 스토어 좋아요 여부 확인
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   * @returns 좋아요 여부
   */
  async isStoreLiked(userId: string, storeId: string): Promise<boolean> {
    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 좋아요 여부 확인
    const like = await this.prisma.storeLike.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    return !!like;
  }
}
