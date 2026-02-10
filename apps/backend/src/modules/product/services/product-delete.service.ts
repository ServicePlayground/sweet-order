import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PRODUCT_ERROR_MESSAGES } from "@apps/backend/modules/product/constants/product.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

@Injectable()
export class ProductDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProduct(id: string, user: JwtVerifiedPayload) {
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

    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
