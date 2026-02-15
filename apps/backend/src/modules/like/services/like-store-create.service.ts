import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { LIKE_ERROR_MESSAGES } from "@apps/backend/modules/like/constants/like.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 스토어 좋아요 생성 서비스
 * 스토어 좋아요 추가 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeStoreCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 스토어 좋아요 추가 (사용자용)
   * @param userId 사용자 ID
   * @param storeId 스토어 ID
   */
  async addStoreLikeForUser(userId: string, storeId: string) {
    // 스토어 존재 여부 확인
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      LoggerUtil.log(
        `스토어 좋아요 추가 실패: 스토어를 찾을 수 없음 - userId: ${userId}, storeId: ${storeId}`,
      );
      throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    try {
      // 좋아요 추가 및 스토어의 likeCount 증가 - 트랜잭션으로 일관성 보장
      await this.prisma.$transaction(
        async (tx) => {
          // 좋아요 추가 (중복 생성은 DB unique 제약으로 방지)
          await tx.storeLike.create({
            data: {
              userId,
              storeId,
            },
          });

          // 스토어의 likeCount 증가 (원자적 연산)
          await tx.store.update({
            where: { id: storeId },
            data: {
              likeCount: {
                increment: 1,
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
      if (error?.code === "P2002") {
        LoggerUtil.log(
          `스토어 좋아요 추가 실패: 이미 좋아요 존재 - userId: ${userId}, storeId: ${storeId}`,
        );
        throw new ConflictException(LIKE_ERROR_MESSAGES.STORE_LIKE_ALREADY_EXISTS);
      }
      if (error?.code === "P2025") {
        LoggerUtil.log(
          `스토어 좋아요 추가 실패: 스토어를 찾을 수 없음 (트랜잭션 중) - userId: ${userId}, storeId: ${storeId}`,
        );
        throw new NotFoundException(STORE_ERROR_MESSAGES.NOT_FOUND);
      }
      LoggerUtil.log(
        `스토어 좋아요 추가 실패: 트랜잭션 에러 - userId: ${userId}, storeId: ${storeId}, error: ${error?.message || String(error)}`,
      );
      throw error;
    }
  }
}
