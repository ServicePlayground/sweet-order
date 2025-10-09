import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { GetProductsRequestDto } from "@apps/backend/modules/product/dto/product-request.dto";
import {
  SortBy,
  PRODUCT_ERROR_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * 상품 서비스
 * 사용자용 상품 조회, 검색, 필터링 등의 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 목록 조회 (필터링, 정렬, 무한스크롤 지원)
   */
  async getProducts(query: GetProductsRequestDto, user?: JwtVerifiedPayload) {
    const {
      search,
      page,
      limit,
      sortBy,
      targetAudience,
      sizeRange,
      deliveryMethod,
      deliveryDays,
      minPrice,
      maxPrice,
    } = query;

    // 필터 조건 구성
    const where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] } = {
      // status: ProductStatus.ACTIVE, // 판매중인 상품만 조회 // 프론트엔드에서 처리
    };

    // 검색어 조건 (별도 처리)
    // 검색어가 있으면 상품명, 해시태그에서 검색
    // 검색어가 없으면 전체 조회 (다른 필터 조건만 적용)
    const searchConditions: Prisma.ProductWhereInput[] = [];
    if (search) {
      searchConditions.push(
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } }, // 상품명에서 검색 (대소문자 구분 없음)
        { hashtags: { has: search } }, // 해시태그 배열에서 검색
      );
    }

    // 대상 기준 필터 처리
    if (targetAudience && targetAudience.length > 0) {
      where.targetAudience = { hasSome: targetAudience }; // targetAudience 배열의 값들 중 하나라도 포함된 상품들을 검색
    }

    // 인원수 필터 처리
    if (sizeRange && sizeRange.length > 0) {
      where.sizeRange = { hasSome: sizeRange }; // sizeRange 배열의 값들 중 하나라도 포함된 상품들을 검색
    }

    // 수령 방식 필터 처리
    if (deliveryMethod && deliveryMethod.length > 0) {
      where.deliveryMethod = { hasSome: deliveryMethod }; // deliveryMethod 배열의 값들 중 하나라도 포함된 상품들을 검색
    }

    // 수령 일수 필터 처리
    // deliveryDays 배열의 값들 중 하나라도 포함된 상품들을 검색
    if (deliveryDays && deliveryDays.length > 0) {
      where.deliveryDays = { hasSome: deliveryDays }; // SAME_DAY, ONE_TO_TWO 등 중 선택된 것들
    }

    // 가격 필터 처리
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.salePrice = {};
      if (minPrice !== undefined) where.salePrice.gte = minPrice;
      if (maxPrice !== undefined) where.salePrice.lte = maxPrice;
    }

    // 검색어 조건을 최종 where에 추가
    if (searchConditions.length > 0) {
      // 검색어 조건을 OR로 묶어서 AND 조건에 추가
      where.AND = where.AND || [];
      where.AND.push({ OR: searchConditions });
    }

    // 정렬 조건 구성
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sortBy) {
      case SortBy.LATEST:
        orderBy = [{ createdAt: "desc" }];
        break;
      case SortBy.PRICE_ASC:
        orderBy = [{ salePrice: "asc" }, { createdAt: "desc" }];
        break;
      case SortBy.PRICE_DESC:
        orderBy = [{ salePrice: "desc" }, { createdAt: "desc" }];
        break;
      case SortBy.POPULAR: // 좋아요 수 내림차순
      default:
        orderBy = [{ likeCount: "desc" }, { createdAt: "desc" }];
        break;
    }

    // 전체 개수 조회
    const totalItems = await this.prisma.product.count({ where });

    // 무한스크롤 계산
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    // 상품 목록 조회
    const products = await this.prisma.product.findMany({
      where, // 필터 조건 (검색어, 카테고리, 가격대 등)
      orderBy, // 정렬 조건 (최신순, 가격순, 인기순 등)
      skip, // 무한스크롤을 위한 건너뛸 항목 수
      take: limit, // 가져올 항목 수 (페이지당 상품 개수)
      include: {
        // 사용자별 좋아요 여부 확인
        // - 로그인한 사용자: 해당 사용자가 좋아요한 상품만 가져옴
        // - 비로그인 사용자: 좋아요 정보를 가져오지 않음
        likes: user ? { where: { userId: user.sub } } : undefined,
      },
    });

    // 무한스크롤 메타 정보 계산
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // 응답 데이터 변환
    const data = products.map((product) => {
      const { likes, ...productData } = product;
      return {
        ...productData,
        isLiked: user ? likes && likes.length > 0 : false,
      };
    });

    // 무한스크롤 메타 정보
    const meta = {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
      hasNext,
      hasPrev,
    };

    return { data, meta };
  }

  /**
   * 상품 상세 조회
   */
  async getProductDetail(id: string, user?: JwtVerifiedPayload) {
    // 상품 상세 정보 조회 (이미지, 좋아요 정보 포함)
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        // status: ProductStatus.ACTIVE, // 판매중인 상품만 조회 // 프론트엔드에서 처리
      },
      include: {
        // 사용자별 좋아요 여부 확인
        likes: user ? { where: { userId: user.sub } } : undefined,
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 응답 데이터 변환
    const { likes, ...productData } = product;
    return {
      ...productData,
      isLiked: user ? likes && likes.length > 0 : false,
    };
  }

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProduct(id: string, user: JwtVerifiedPayload) {
    // 상품 존재 여부 및 소유권 확인
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 상품 소유자인지 확인
    if (product.sellerId !== user.sub) {
      throw new ForbiddenException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    // 상품 삭제
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
