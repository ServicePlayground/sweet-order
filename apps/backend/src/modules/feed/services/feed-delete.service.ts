import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FeedOwnershipUtil } from "@apps/backend/modules/feed/utils/feed-ownership.util";

@Injectable()
export class FeedDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 삭제 (판매자용)
   */
  async deleteFeed(feedId: string, user: JwtVerifiedPayload) {
    // 피드 소유권 확인
    await FeedOwnershipUtil.verifyFeedOwnership(this.prisma, feedId, user.sub, { userId: true });

    await this.prisma.storeFeed.delete({
      where: {
        id: feedId,
      },
    });
  }
}
