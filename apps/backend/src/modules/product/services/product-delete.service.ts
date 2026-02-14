import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { ProductOwnershipUtil } from "@apps/backend/modules/product/utils/product-ownership.util";

@Injectable()
export class ProductDeleteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 상품 삭제 (판매자용)
   */
  async deleteProduct(id: string, user: JwtVerifiedPayload) {
    // 상품 소유권 확인
    await ProductOwnershipUtil.verifyProductOwnership(this.prisma, id, user.sub, { userId: true });

    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
