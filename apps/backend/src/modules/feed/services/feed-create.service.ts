import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CreateFeedRequestDto } from "@apps/backend/modules/feed/dto/feed-create.dto";
import { FeedOwnershipUtil } from "@apps/backend/modules/feed/utils/feed-ownership.util";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";

@Injectable()
export class FeedCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 생성 (판매자용)
   */
  async createFeed(userId: string, createFeedDto: CreateFeedRequestDto) {
    // 스토어 소유권 확인
    await FeedOwnershipUtil.verifyStoreOwnership(
      this.prisma,
      createFeedDto.storeId,
      userId,
      FEED_ERROR_MESSAGES.STORE_NOT_FOUND,
    );

    const feed = await this.prisma.storeFeed.create({
      data: {
        storeId: createFeedDto.storeId,
        title: createFeedDto.title,
        content: createFeedDto.content,
      },
    });

    return {
      id: feed.id,
    };
  }
}
