import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CreateFeedRequestDto } from "@apps/backend/modules/feed/dto/feed-create.dto";

@Injectable()
export class FeedCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 피드 생성 (판매자용)
   */
  async createFeed(userId: string, createFeedDto: CreateFeedRequestDto) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: createFeedDto.storeId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!store) {
      throw new NotFoundException("스토어를 찾을 수 없습니다.");
    }

    if (store.userId !== userId) {
      throw new UnauthorizedException("스토어를 수정할 권한이 없습니다.");
    }

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
