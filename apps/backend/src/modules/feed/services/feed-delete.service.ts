import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";

@Injectable()
export class FeedDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 삭제 (판매자용)
   */
  async deleteFeed(feedId: string, user: JwtVerifiedPayload) {
    const feed = await this.prisma.storeFeed.findFirst({
      where: {
        id: feedId,
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!feed || !feed.store) {
      throw new NotFoundException(FEED_ERROR_MESSAGES.FEED_NOT_FOUND);
    }

    if (feed.store.userId !== user.sub) {
      throw new UnauthorizedException(FEED_ERROR_MESSAGES.FEED_FORBIDDEN);
    }

    await this.prisma.storeFeed.delete({
      where: {
        id: feedId,
      },
    });
  }
}
