import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  GetMyLikesRequestDto,
  MyProductLikeListResponseDto,
  MyStoreLikeListResponseDto,
} from "@apps/backend/modules/like/dto/like-user-list.dto";
import { LikeType } from "@apps/backend/modules/like/constants/like.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { calculatePaginationMeta } from "@apps/backend/common/utils/pagination.util";
import { ProductMapperUtil } from "@apps/backend/modules/product/utils/product-mapper.util";
import { StoreMapperUtil } from "@apps/backend/modules/store/utils/store-mapper.util";
import { ProductResponseDto } from "@apps/backend/modules/product/dto/product-detail.dto";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-detail.dto";

/**
 * 내가 좋아요한 목록 조회 서비스
 * 사용자가 좋아요한 상품 및 스토어 목록 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LikeUserListService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 내가 좋아요한 상품 목록 조회 (사용자용)
   */
  async getMyProductLikesForUser(
    userId: string,
    query: GetMyLikesRequestDto,
  ): Promise<MyProductLikeListResponseDto> {
    const { page, limit } = query;

    const where: Prisma.ProductLikeWhereInput = {
      userId,
    };

    const totalItems = await this.prisma.productLike.count({ where });

    const skip = (page - 1) * limit;

    const productLikes = await this.prisma.productLike.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        product: {
          include: {
            store: {
              select: {
                name: true,
                logoImageUrl: true,
                address: true,
                roadAddress: true,
                zonecode: true,
                latitude: true,
                longitude: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    const data: ProductResponseDto[] = productLikes.map((productLike) => {
      return ProductMapperUtil.mapToProductResponse(productLike.product, true);
    });

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 내가 좋아요한 스토어 목록 조회 (사용자용)
   */
  async getMyStoreLikesForUser(
    userId: string,
    query: GetMyLikesRequestDto,
  ): Promise<MyStoreLikeListResponseDto> {
    const { page, limit } = query;

    const where: Prisma.StoreLikeWhereInput = {
      userId,
    };

    const totalItems = await this.prisma.storeLike.count({ where });

    const skip = (page - 1) * limit;

    const storeLikes = await this.prisma.storeLike.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        store: true,
      },
    });

    const stores = storeLikes.map((storeLike) => storeLike.store);
    const data = (await StoreMapperUtil.mapToStoreResponse(
      stores,
      this.prisma,
    )) as StoreResponseDto[];

    const meta = calculatePaginationMeta(page, limit, totalItems);

    return { data, meta };
  }

  /**
   * 내가 좋아요한 목록 조회 (사용자용)
   * 타입에 따라 상품 또는 스토어 목록을 반환합니다.
   */
  async getMyLikesForUser(
    userId: string,
    query: GetMyLikesRequestDto,
  ): Promise<MyProductLikeListResponseDto | MyStoreLikeListResponseDto> {
    if (query.type === LikeType.PRODUCT) {
      return this.getMyProductLikesForUser(userId, query);
    } else if (query.type === LikeType.STORE) {
      return this.getMyStoreLikesForUser(userId, query);
    } else {
      // 타입이 명시되지 않은 경우 기본값으로 상품 목록 반환
      // (DTO 검증에서 이미 enum 검증이 이루어지므로 이 경우는 발생하지 않음)
      return this.getMyProductLikesForUser(userId, query);
    }
  }
}
