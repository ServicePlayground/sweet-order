import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";

/**
 * 스토어 좋아요 삭제 서비스
 * 스토어 좋아요 삭제 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeStoreDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 스토어 좋아요 삭제
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   */
  async removeStoreLike(userId: string, storeId: string) {
    // 좋아요 존재 여부 확인
    const existingLike = await this.prisma.storeLike.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (!existingLike) {
      throw new NotFoundException(LIKE_ERROR_MESSAGES.STORE_LIKE_NOT_FOUND);
    }

    // 좋아요 삭제 및 스토어의 likeCount 감소 - 트랜잭션으로 일관성 보장
    await this.prisma.$transaction(async (tx) => {
      // 좋아요 삭제
      await tx.storeLike.delete({
        where: {
          userId_storeId: {
            userId,
            storeId,
          },
        },
      });

      // 스토어의 likeCount 감소 (0 이하로 내려가지 않도록 처리)
      await tx.store.update({
        where: { id: storeId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
    });
  }
}
