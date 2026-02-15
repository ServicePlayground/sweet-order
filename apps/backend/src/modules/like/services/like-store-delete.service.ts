import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 스토어 좋아요 삭제 서비스
 * 스토어 좋아요 삭제 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeStoreDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 스토어 좋아요 삭제 (사용자용)
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   */
  async removeStoreLikeForUser(userId: string, storeId: string) {
    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    try {
      // 좋아요 삭제 및 스토어의 likeCount 감소 - 트랜잭션으로 일관성 보장
      await this.prisma.$transaction(
        async (tx) => {
          // 좋아요 삭제
          await tx.storeLike.delete({
            where: {
              userId_storeId: {
                userId,
                storeId,
              },
            },
          });

          // 스토어의 likeCount 감소 (원자적 연산, 음수 방지를 위해 조건부 업데이트)
          await tx.store.updateMany({
            where: {
              id: storeId,
              likeCount: { gt: 0 },
            },
            data: {
              likeCount: {
                decrement: 1,
              },
            },
          });
        },
        {
          maxWait: 5000, // 최대 대기 시간 (5초)
          timeout: 10000, // 타임아웃 (10초)
        },
      );
    } catch (error: any) {
      if (error?.code === "P2025") {
        throw new NotFoundException(LIKE_ERROR_MESSAGES.STORE_LIKE_NOT_FOUND);
      }
      throw error;
    }
  }
}
