import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";

/**
 * 스토어 좋아요 생성 서비스
 * 스토어 좋아요 추가 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeStoreCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 스토어 좋아요 추가
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   */
  async addStoreLike(userId: string, storeId: string) {
    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    // 이미 좋아요한 스토어인지 확인
    const existingLike = await this.prisma.storeLike.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException(LIKE_ERROR_MESSAGES.STORE_LIKE_ALREADY_EXISTS);
    }

    // 좋아요 추가 및 스토어의 likeCount 증가 - 트랜잭션으로 일관성 보장
    await this.prisma.$transaction(async (tx) => {
      // 좋아요 추가
      await tx.storeLike.create({
        data: {
          userId,
          storeId,
        },
      });

      // 스토어의 likeCount 증가
      await tx.store.update({
        where: { id: storeId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
    });
  }
}
