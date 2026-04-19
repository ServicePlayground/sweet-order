import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  REVIEW_ERROR_MESSAGES,
  REVIEW_SUCCESS_MESSAGES,
} from "@apps/backend/modules/review/constants/review.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 후기 삭제 서비스
 * 본인이 작성한 후기 삭제 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ReviewDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 내 후기 삭제 (사용자용)
   * 본인이 작성한 후기만 삭제할 수 있습니다.
   * @param userId 사용자 ID
   * @param reviewId 후기 ID
   */
  async deleteMyReviewForUser(userId: string, reviewId: string) {
    const review = await this.prisma.productReview.findUnique({
      where: { id: reviewId },
      select: { id: true, consumerId: true, deletedAt: true },
    });

    if (!review || review.deletedAt != null) {
      LoggerUtil.log(
        `후기 삭제 실패: 후기를 찾을 수 없음 - userId: ${userId}, reviewId: ${reviewId}`,
      );
      throw new NotFoundException(REVIEW_ERROR_MESSAGES.REVIEW_NOT_FOUND);
    }

    if (review.consumerId !== userId) {
      LoggerUtil.log(`후기 삭제 실패: 본인 후기가 아님 - userId: ${userId}, reviewId: ${reviewId}`);
      throw new ForbiddenException(REVIEW_ERROR_MESSAGES.REVIEW_FORBIDDEN);
    }

    await this.prisma.productReview.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });

    return { message: REVIEW_SUCCESS_MESSAGES.REVIEW_DELETED };
  }
}
