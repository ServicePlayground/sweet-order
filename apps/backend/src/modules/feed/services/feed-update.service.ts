import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { UpdateFeedRequestDto } from "@apps/backend/modules/feed/dto/feed-update.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FeedOwnershipUtil } from "@apps/backend/modules/feed/utils/feed-ownership.util";

@Injectable()
export class FeedUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 수정 (판매자용)
   */
  async updateFeed(feedId: string, updateFeedDto: UpdateFeedRequestDto, user: JwtVerifiedPayload) {
    // 피드 소유권 확인
    await FeedOwnershipUtil.verifyFeedOwnership(this.prisma, feedId, user.sub, { userId: true });

    const updatedFeed = await this.prisma.storeFeed.update({
      where: {
        id: feedId,
      },
      data: {
        title: updateFeedDto.title,
        content: updateFeedDto.content,
      },
    });

    return {
      id: updatedFeed.id,
    };
  }
}
