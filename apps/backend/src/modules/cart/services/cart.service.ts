import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  AddCartItemRequestDto,
  UpdateCartItemRequestDto,
} from "@apps/backend/modules/cart/dto/cart-request.dto";
import { CART_ERROR_MESSAGES } from "@apps/backend/modules/cart/constants/cart.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderFormSchema, OrderFormData } from "@apps/backend/modules/product/type/product.type";
import { validateOrderFormData } from "@apps/backend/modules/cart/utils/order-form-validator.util";

/**
 * 장바구니 서비스
 * 장바구니 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}


  /**
   * 장바구니 목록 조회
   * @param userId 사용자 ID
   * @returns 장바구니 항목 목록 (유효하지 않은 항목은 자동으로 제거됨)
   */
  async getCartItems(userId: string) {
    const cartItems = await this.prisma.cart.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        quantity: true,
        orderFormData: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            storeId: true,
            name: true,
            description: true,
            originalPrice: true,
            salePrice: true,
            stock: true,
            notice: true,
            caution: true,
            basicIncluded: true,
            location: true,
            images: true,
            status: true,
            orderFormSchema: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 유효하지 않은 장바구니 항목 필터링 및 제거
    const validCartItems = [];
    const invalidCartItemIds = [];

    for (const item of cartItems) {
      // 상품이 존재하지 않거나 삭제된 경우 (Cascade로 자동 삭제되지만, 혹시 모를 경우 대비)
      if (!item.product) {
        invalidCartItemIds.push(item.id);
        continue;
      }

      // 상품 상태 확인 (ACTIVE 상태만 허용)
      if (item.product.status !== "ACTIVE") {
        invalidCartItemIds.push(item.id);
        continue;
      }

      // 재고가 부족한 경우
      if (item.product.stock < item.quantity) {
        invalidCartItemIds.push(item.id);
        continue;
      }

      // orderFormSchema가 변경되어 orderFormData가 유효하지 않은 경우
      if (item.product.orderFormSchema && item.orderFormData) {
        try {
          const orderFormSchema = item.product.orderFormSchema as unknown as OrderFormSchema | null | undefined;
          const orderFormData = item.orderFormData as unknown as OrderFormData | null | undefined;
          validateOrderFormData(orderFormSchema, orderFormData);
        } catch (error) {
          // 검증 실패 시 해당 항목 제거
          invalidCartItemIds.push(item.id);
          continue;
        }
      }

      validCartItems.push(item);
    }

    // 유효하지 않은 항목 삭제
    if (invalidCartItemIds.length > 0) {
      await this.prisma.cart.deleteMany({
        where: {
          id: { in: invalidCartItemIds },
        },
      });
    }

    return {
      data: validCartItems,
    };
  }

  /**
   * 장바구니에 상품 추가
   * @param userId 사용자 ID
   * @param addCartItemDto 장바구니 추가 요청 DTO
   */
  async addCartItem(userId: string, addCartItemDto: AddCartItemRequestDto) {
    const { productId, quantity, orderFormData } = addCartItemDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        orderFormSchema: true,
        stock: true,
        status: true,
      },
    });

    // 상품 존재 여부 확인
    if (!product) {
      throw new NotFoundException(CART_ERROR_MESSAGES.PRODUCT_DELETED);
    }
  
    // 상품 상태 확인 (ACTIVE 상태만 허용)
    if (product.status !== "ACTIVE") {
      if (product.status === "INACTIVE") {
        throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_INACTIVE);
      } else if (product.status === "OUT_OF_STOCK") {
        throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK);
      } else {
        throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
      }
    }

    // 재고 확인
    if (product.stock < quantity) {
      throw new BadRequestException(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK);
    }

    // orderFormData 검증
    const orderFormSchema = product.orderFormSchema as OrderFormSchema | null | undefined;
    validateOrderFormData(orderFormSchema, orderFormData as OrderFormData | null | undefined);

    // 새 장바구니 항목 생성
    await this.prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
        ...(orderFormData && { orderFormData: orderFormData as Prisma.InputJsonValue }),
      },
    });
  }

  /**
   * 장바구니 항목 수정
   * @param userId 사용자 ID
   * @param cartItemId 장바구니 항목 ID
   * @param updateCartItemDto 장바구니 수정 요청 DTO
   */
  async updateCartItem(
    userId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemRequestDto,
  ) {
    const { quantity, orderFormData } = updateCartItemDto;

    // 장바구니 항목 확인
    const cartItem = await this.prisma.cart.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            stock: true,
            orderFormSchema: true,
            status: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException(CART_ERROR_MESSAGES.NOT_FOUND);
    }

    // 상품 존재 여부 확인
    if (!cartItem.product) {
      throw new NotFoundException(CART_ERROR_MESSAGES.PRODUCT_DELETED);
    }

    // 상품 상태 확인 (ACTIVE 상태만 허용)
    if (cartItem.product.status !== "ACTIVE") {
      if (cartItem.product.status === "INACTIVE") {
        throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_INACTIVE);
      } else if (cartItem.product.status === "OUT_OF_STOCK") {
        throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK);
      } else {
        throw new BadRequestException(CART_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
      }
    }

    // 재고 확인
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK);
    }

    // orderFormData 검증
    const orderFormSchema = cartItem.product.orderFormSchema as OrderFormSchema | null | undefined;
    validateOrderFormData(orderFormSchema, orderFormData as OrderFormData | null | undefined);

    // 장바구니 항목 업데이트
    await this.prisma.cart.update({
      where: { id: cartItemId },
      data: {
        quantity,
        ...(orderFormData !== undefined && { orderFormData: orderFormData as Prisma.InputJsonValue }),
      },
    });
  }

  /**
   * 장바구니 항목 삭제
   * @param userId 사용자 ID
   * @param cartItemId 장바구니 항목 ID
   */
  async removeCartItem(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cart.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(CART_ERROR_MESSAGES.NOT_FOUND);
    }

    await this.prisma.cart.delete({
      where: { id: cartItemId },
    });
  }

  /**
   * 장바구니 전체 삭제
   * @param userId 사용자 ID
   */
  async clearCart(userId: string) {
    await this.prisma.cart.deleteMany({
      where: { userId },
    });
  }
}

