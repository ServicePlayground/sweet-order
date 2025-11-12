import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  AddCartItemRequestDto,
  UpdateCartItemRequestDto,
} from "@apps/backend/modules/cart/dto/cart-request.dto";
import { CART_ERROR_MESSAGES } from "@apps/backend/modules/cart/constants/cart.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";
import { OrderFormSchema, OrderFormData } from "@apps/backend/modules/product/type/product.type";
import {
  validateProductForCart,
  validateOrderFormData,
  validateDeliveryMethod,
} from "@apps/backend/modules/product/utils/product-validator.util";

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
        deliveryMethod: true,
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
            deliveryMethod: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 유효하지 않은 장바구니 항목 필터링 및 제거
    const validCartItems = [];
    const invalidCartItemIds: string[] = [];

    for (const item of cartItems) {
      // 상품 존재 여부, 상태, 재고 확인 (ACTIVE 상태만 허용, 재고 부족 시 자동 제거)
      try {
        validateProductForCart(item.product, item.quantity);
      } catch (error) {
        invalidCartItemIds.push(item.id);
        continue;
      }

      // orderFormData 검증 (orderFormSchema가 없어도 검증 필요)
      // orderFormSchema가 없는데 orderFormData가 있으면 유효하지 않음
      try {
        const orderFormSchema = item.product.orderFormSchema as unknown as
          | OrderFormSchema
          | null
          | undefined;
        const orderFormData = item.orderFormData as unknown as OrderFormData | null | undefined;
        validateOrderFormData(orderFormSchema, orderFormData);
      } catch (error) {
        // 검증 실패 시 해당 항목 제거
        invalidCartItemIds.push(item.id);
        continue;
      }

      // deliveryMethod 검증
      try {
        const productDeliveryMethods = (item.product.deliveryMethod as string[]) || null;
        const cartDeliveryMethod = (item.deliveryMethod as string) || null;
        validateDeliveryMethod(productDeliveryMethods, cartDeliveryMethod);
      } catch (error) {
        // 검증 실패 시 해당 항목 제거
        invalidCartItemIds.push(item.id);
        continue;
      }

      validCartItems.push(item);
    }

    // 유효하지 않은 항목 삭제 - 트랜잭션으로 일관성 보장
    if (invalidCartItemIds.length > 0) {
      await this.prisma.$transaction(async (tx) => {
        await tx.cart.deleteMany({
          where: {
            id: { in: invalidCartItemIds },
          },
        });
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
    const { productId, quantity, orderFormData, deliveryMethod } = addCartItemDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        orderFormSchema: true,
        stock: true,
        status: true,
        deliveryMethod: true,
      },
    });

    // 상품 검증 (존재 여부, 상태, 재고)
    validateProductForCart(product, quantity);

    // orderFormData 검증 (validateProductForCart에서 product가 null이면 예외를 던지므로 여기서는 null이 아님)
    const orderFormSchema = product!.orderFormSchema as OrderFormSchema | null | undefined;
    validateOrderFormData(orderFormSchema, orderFormData as OrderFormData | null | undefined);

    // deliveryMethod 검증
    const productDeliveryMethods = (product!.deliveryMethod as string[]) || null;
    validateDeliveryMethod(productDeliveryMethods, deliveryMethod as string);

    // 새 장바구니 항목 생성
    await this.prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
        deliveryMethod,
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
    const { quantity } = updateCartItemDto;

    // 장바구니 항목 확인
    const cartItem = await this.prisma.cart.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
      select: {
        id: true,
        quantity: true,
        orderFormData: true,
        deliveryMethod: true,
        product: {
          select: {
            id: true,
            stock: true,
            status: true,
            orderFormSchema: true,
            deliveryMethod: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException(CART_ERROR_MESSAGES.NOT_FOUND);
    }

    // 상품 검증 (존재 여부, 상태, 재고)
    validateProductForCart(cartItem.product, quantity);

    // orderFormData 검증
    const orderFormSchema = cartItem.product.orderFormSchema as OrderFormSchema | null | undefined;
    const orderFormData = cartItem.orderFormData as OrderFormData | null | undefined;
    validateOrderFormData(orderFormSchema, orderFormData);

    // deliveryMethod 검증
    const productDeliveryMethods = (cartItem.product.deliveryMethod as string[]) || null;
    const cartDeliveryMethod = (cartItem.deliveryMethod as string) || null;
    validateDeliveryMethod(productDeliveryMethods, cartDeliveryMethod);

    // 장바구니 항목 업데이트 (수량만 수정)
    await this.prisma.cart.update({
      where: { id: cartItemId },
      data: {
        quantity,
      },
    });
  }

  /**
   * 장바구니 항목 삭제
   * @param userId 사용자 ID
   * @param cartItemId 장바구니 항목 ID
   */
  async removeCartItem(userId: string, cartItemId: string) {
    // userId와 cartItemId를 함께 체크하여 삭제 (보안 및 효율성)
    const deleteResult = await this.prisma.cart.deleteMany({
      where: {
        id: cartItemId,
        userId,
      },
    });

    // 삭제된 항목이 없으면 에러 발생
    if (deleteResult.count === 0) {
      throw new NotFoundException(CART_ERROR_MESSAGES.NOT_FOUND);
    }
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
