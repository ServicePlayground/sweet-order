import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  GetProductsRequestDto,
  CreateProductRequestDto,
} from "@apps/backend/modules/product/dto/product-request.dto";
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
  async getProducts(query: GetProductsRequestDto) {
    const { search, page, limit, sortBy, minPrice, maxPrice, storeId } = query;

    // 필터 조건 구성
    const where: Prisma.ProductWhereInput & { AND?: Prisma.ProductWhereInput[] } = {
      // status: ProductStatus.ACTIVE, // 판매중인 상품만 조회 // 프론트엔드에서 처리
    };

    // 검색어 조건 (상품명에서만 검색)
    const searchConditions: Prisma.ProductWhereInput[] = [];
    if (search) {
      searchConditions.push(
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } }, // 상품명에서 검색 (대소문자 구분 없음)
      );
    }

    // 가격 필터 처리
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.salePrice = {};
      if (minPrice !== undefined) where.salePrice.gte = minPrice;
      if (maxPrice !== undefined) where.salePrice.lte = maxPrice;
    }

    // 스토어 ID 필터 처리
    if (storeId) {
      where.storeId = storeId;
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
    });

    // 무한스크롤 메타 정보 계산
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // 응답 데이터 변환
    const data = products;

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
  async getProductDetail(id: string) {
    // 상품 상세 정보 조회
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        // status: ProductStatus.ACTIVE, // 판매중인 상품만 조회 // 프론트엔드에서 처리
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    return product;
  }

  /**
   * 상품 등록 (판매자용)
   */
  async createProduct(createProductDto: CreateProductRequestDto, user: JwtVerifiedPayload) {
    // 스토어 존재 여부 및 소유권 확인
    const store = await this.prisma.store.findFirst({
      where: {
        id: createProductDto.storeId,
      },
    });

    // 스토어가 존재하지 않으면 404 에러
    if (!store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    // 권한 확인: 스토어 소유자인지 확인
    if (store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.STORE_NOT_OWNED);
    }

    // productNumber 생성 및 상품 생성 - 트랜잭션으로 동시성 문제 방지
    // 날짜-순번 형식 (예: 20240101-001)
    return await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD

      // 같은 날 등록된 상품 수 조회 (트랜잭션 내에서 조회하여 동시성 보장)
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const todayProductCount = await tx.product.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 순번 생성 (001, 002, ...)
      const sequence = String(todayProductCount + 1).padStart(3, "0");
      const productNumber = `${dateStr}-${sequence}`;

      // 상품 데이터 준비
      const productData: Prisma.ProductCreateInput = {
        store: {
          connect: {
            id: createProductDto.storeId,
          },
        },
        name: createProductDto.name,
        images: createProductDto.images || [],
        salePrice: createProductDto.salePrice,
        salesStatus: createProductDto.salesStatus,
        visibilityStatus: createProductDto.visibilityStatus,
        // 케이크 옵션을 각각 JSON 배열로 저장
        cakeSizeOptions: createProductDto.cakeSizeOptions
          ? (createProductDto.cakeSizeOptions as unknown as Prisma.InputJsonValue)
          : [],
        cakeFlavorOptions: createProductDto.cakeFlavorOptions
          ? (createProductDto.cakeFlavorOptions as unknown as Prisma.InputJsonValue)
          : [],
        letteringRequired: createProductDto.letteringRequired,
        letteringMaxLength: createProductDto.letteringMaxLength,
        imageUploadEnabled: createProductDto.imageUploadEnabled,
        detailDescription: createProductDto.detailDescription,
        productNumber,
        productNoticeFoodType: createProductDto.productNoticeFoodType,
        productNoticeProducer: createProductDto.productNoticeProducer,
        productNoticeOrigin: createProductDto.productNoticeOrigin,
        productNoticeAddress: createProductDto.productNoticeAddress,
        productNoticeManufactureDate: createProductDto.productNoticeManufactureDate,
        productNoticeExpirationDate: createProductDto.productNoticeExpirationDate,
        productNoticePackageCapacity: createProductDto.productNoticePackageCapacity,
        productNoticePackageQuantity: createProductDto.productNoticePackageQuantity,
        productNoticeIngredients: createProductDto.productNoticeIngredients,
        productNoticeCalories: createProductDto.productNoticeCalories,
        productNoticeSafetyNotice: createProductDto.productNoticeSafetyNotice,
        productNoticeGmoNotice: createProductDto.productNoticeGmoNotice,
        productNoticeImportNotice: createProductDto.productNoticeImportNotice,
        productNoticeCustomerService: createProductDto.productNoticeCustomerService,
      };

      // 상품 생성
      const product = await tx.product.create({
        data: productData,
      });

      return {
        id: product.id,
      };
    });
  }

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProduct(id: string, user: JwtVerifiedPayload) {
    // 상품 존재 여부 및 소유권 확인 (Store 정보 포함)
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        store: true, // Store 정보를 포함하여 sellerId 확인
      },
    });

    // 상품이 존재하지 않으면 404 에러
    if (!product || !product.store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    // 권한 확인: 상품의 Store 소유자인지 확인
    if (product.store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    // 상품 삭제
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
