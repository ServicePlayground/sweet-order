import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { UpdateProductRequestDto } from "@apps/backend/modules/product/dto/product-request.dto";
import {
  EnableStatus,
  ProductType,
  PRODUCT_ERROR_MESSAGES,
} from "@apps/backend/modules/product/constants/product.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

@Injectable()
export class ProductUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 케이크 옵션용 랜덤 ID 생성
   * - 생성 시 한 번만 부여되고 이후에는 변경되지 않도록 사용
   */
  private generateOptionId(prefix: "size" | "flavor"): string {
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${random}`;
  }

  /**
   * 케이크 옵션에 ID 부여 (기존 ID 유지, 새 옵션에는 새 ID 생성)
   */
  private processCakeOptionsWithIds(
    existingOptions: any[],
    newOptions: Array<{ id?: string }>,
    prefix: "size" | "flavor",
  ): Array<{ id: string }> {
    const existingOptionsById = new Map<string, any>();

    for (const option of existingOptions) {
      if (option && typeof option === "object" && "id" in option && typeof option.id === "string") {
        existingOptionsById.set(option.id, option);
      }
    }

    return newOptions.map((option) => {
      const existing =
        option.id && existingOptionsById.has(option.id)
          ? existingOptionsById.get(option.id)
          : undefined;

      const id = existing?.id ?? option.id ?? this.generateOptionId(prefix);

      return {
        ...existing,
        ...option,
        id,
      };
    });
  }

  /**
   * 상품 수정 (판매자용)
   */
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductRequestDto,
    user: JwtVerifiedPayload,
  ) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        store: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!product || !product.store) {
      throw new NotFoundException(PRODUCT_ERROR_MESSAGES.NOT_FOUND);
    }

    if (product.store.userId !== user.sub) {
      throw new UnauthorizedException(PRODUCT_ERROR_MESSAGES.FORBIDDEN);
    }

    const updateData: Prisma.ProductUpdateInput = {};

    if (updateProductDto.name !== undefined) {
      updateData.name = updateProductDto.name;
    }
    if (updateProductDto.images !== undefined) {
      updateData.images = updateProductDto.images;
    }
    if (updateProductDto.salePrice !== undefined) {
      updateData.salePrice = updateProductDto.salePrice;
    }
    if (updateProductDto.salesStatus !== undefined) {
      updateData.salesStatus = updateProductDto.salesStatus;
    }
    if (updateProductDto.visibilityStatus !== undefined) {
      updateData.visibilityStatus = updateProductDto.visibilityStatus;
    }
    if (updateProductDto.cakeSizeOptions !== undefined) {
      const existingSizeOptions: any[] = (product.cakeSizeOptions as any[]) ?? [];
      const nextSizeOptions = this.processCakeOptionsWithIds(
        existingSizeOptions,
        updateProductDto.cakeSizeOptions ?? [],
        "size",
      );

      updateData.cakeSizeOptions = nextSizeOptions as unknown as Prisma.InputJsonValue;
    }

    if (updateProductDto.cakeFlavorOptions !== undefined) {
      const existingFlavorOptions: any[] = (product.cakeFlavorOptions as any[]) ?? [];
      const nextFlavorOptions = this.processCakeOptionsWithIds(
        existingFlavorOptions,
        updateProductDto.cakeFlavorOptions ?? [],
        "flavor",
      );

      updateData.cakeFlavorOptions = nextFlavorOptions as unknown as Prisma.InputJsonValue;
    }
    if (updateProductDto.letteringVisible !== undefined) {
      updateData.letteringVisible = updateProductDto.letteringVisible;
    }
    if (updateProductDto.letteringRequired !== undefined) {
      updateData.letteringRequired = updateProductDto.letteringRequired;
    }
    if (updateProductDto.letteringMaxLength !== undefined) {
      updateData.letteringMaxLength = updateProductDto.letteringMaxLength;
    }
    if (updateProductDto.imageUploadEnabled !== undefined) {
      updateData.imageUploadEnabled = updateProductDto.imageUploadEnabled;
      updateData.productType =
        updateProductDto.imageUploadEnabled === EnableStatus.ENABLE
          ? ProductType.CUSTOM_CAKE
          : ProductType.BASIC_CAKE;
    }
    if (updateProductDto.detailDescription !== undefined) {
      updateData.detailDescription = updateProductDto.detailDescription;
    }
    if (updateProductDto.productCategoryTypes !== undefined) {
      updateData.productCategoryTypes = updateProductDto.productCategoryTypes;
    }
    if (updateProductDto.searchTags !== undefined) {
      updateData.searchTags = updateProductDto.searchTags;
    }
    if (updateProductDto.productNoticeFoodType !== undefined) {
      updateData.productNoticeFoodType = updateProductDto.productNoticeFoodType;
    }
    if (updateProductDto.productNoticeProducer !== undefined) {
      updateData.productNoticeProducer = updateProductDto.productNoticeProducer;
    }
    if (updateProductDto.productNoticeOrigin !== undefined) {
      updateData.productNoticeOrigin = updateProductDto.productNoticeOrigin;
    }
    if (updateProductDto.productNoticeAddress !== undefined) {
      updateData.productNoticeAddress = updateProductDto.productNoticeAddress;
    }
    if (updateProductDto.productNoticeManufactureDate !== undefined) {
      updateData.productNoticeManufactureDate = updateProductDto.productNoticeManufactureDate;
    }
    if (updateProductDto.productNoticeExpirationDate !== undefined) {
      updateData.productNoticeExpirationDate = updateProductDto.productNoticeExpirationDate;
    }
    if (updateProductDto.productNoticePackageCapacity !== undefined) {
      updateData.productNoticePackageCapacity = updateProductDto.productNoticePackageCapacity;
    }
    if (updateProductDto.productNoticePackageQuantity !== undefined) {
      updateData.productNoticePackageQuantity = updateProductDto.productNoticePackageQuantity;
    }
    if (updateProductDto.productNoticeIngredients !== undefined) {
      updateData.productNoticeIngredients = updateProductDto.productNoticeIngredients;
    }
    if (updateProductDto.productNoticeCalories !== undefined) {
      updateData.productNoticeCalories = updateProductDto.productNoticeCalories;
    }
    if (updateProductDto.productNoticeSafetyNotice !== undefined) {
      updateData.productNoticeSafetyNotice = updateProductDto.productNoticeSafetyNotice;
    }
    if (updateProductDto.productNoticeGmoNotice !== undefined) {
      updateData.productNoticeGmoNotice = updateProductDto.productNoticeGmoNotice;
    }
    if (updateProductDto.productNoticeImportNotice !== undefined) {
      updateData.productNoticeImportNotice = updateProductDto.productNoticeImportNotice;
    }
    if (updateProductDto.productNoticeCustomerService !== undefined) {
      updateData.productNoticeCustomerService = updateProductDto.productNoticeCustomerService;
    }

    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: updateData,
    });

    return {
      id: updatedProduct.id,
    };
  }
}
