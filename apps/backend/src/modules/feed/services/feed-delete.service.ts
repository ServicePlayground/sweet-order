import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FeedOwnershipUtil } from "@apps/backend/modules/feed/utils/feed-ownership.util";

/**
 * 피드 삭제 서비스
 * 피드 삭제 관련 로직을 담당합니다.
 */
@Injectable()
export class FeedDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 삭제 (판매자용)
   */
  async deleteFeed(storeId: string, feedId: string, user: JwtVerifiedPayload) {
    // 피드 소유권 확인
    await FeedOwnershipUtil.verifyFeedOwnership(
      this.prisma,
      feedId,
      user.sub,
      { userId: true },
      storeId,
    );

    await this.prisma.storeFeed.delete({
      where: {
        id: feedId,
      },
    });
  }
}
