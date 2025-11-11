import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  AddCartItemRequestDto,
  UpdateCartItemRequestDto,
  OrderFormData,
} from "@apps/backend/modules/cart/dto/cart-request.dto";
import { CART_ERROR_MESSAGES } from "@apps/backend/modules/cart/constants/cart.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * OrderFormSchema 타입 정의 (Product의 orderFormSchema와 일치)
 */
interface OrderFormField {
  id: string;
  type: "selectbox" | "textbox";
  label: string;
  required: boolean;
  placeholder?: string;
  allowMultiple?: boolean;
  options?: Array<{ value: string; label: string; price?: number }>;
}

interface OrderFormSchema {
  fields: OrderFormField[];
}

/**
 * 장바구니 서비스
 * 장바구니 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * orderFormData 검증
   * @param orderFormSchema 상품의 주문 폼 스키마
   * @param orderFormData 사용자가 입력한 주문 폼 데이터
   * @throws BadRequestException 검증 실패 시
   */
  private validateOrderFormData(
    orderFormSchema: OrderFormSchema | null | undefined,
    orderFormData: OrderFormData | null | undefined,
  ): void {
    // orderFormSchema가 없으면 orderFormData도 없어야 함
    if (!orderFormSchema || !orderFormSchema.fields || orderFormSchema.fields.length === 0) {
      if (orderFormData && Object.keys(orderFormData).length > 0) {
        throw new BadRequestException(CART_ERROR_MESSAGES.ORDER_FORM_DATA_INVALID);
      }
      return;
    }

    // orderFormSchema가 있으면 orderFormData가 필요함
    if (!orderFormData || typeof orderFormData !== "object") {
      throw new BadRequestException(CART_ERROR_MESSAGES.ORDER_FORM_DATA_REQUIRED);
    }

    const schemaFields = orderFormSchema.fields;
    const dataKeys = Object.keys(orderFormData);

    // 1. 필수 필드 검증
    for (const field of schemaFields) {
      if (field.required) {
        if (!(field.id in orderFormData)) {
          throw new BadRequestException(
            `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
          );
        }

        const value = orderFormData[field.id];

        // 필수 필드가 비어있으면 안됨
        if (field.type === "textbox") {
          if (typeof value !== "string" || value.trim() === "") {
            throw new BadRequestException(
              `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
            );
          }
        } else if (field.type === "selectbox") {
          if (field.allowMultiple) {
            if (!Array.isArray(value) || value.length === 0) {
              throw new BadRequestException(
                `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
              );
            }
          } else {
            if (typeof value !== "string" || value === "") {
              throw new BadRequestException(
                `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_REQUIRED}: ${field.label}(${field.id})`,
              );
            }
          }
        }
      }
    }

    // 2. 모든 데이터 키가 스키마에 정의된 필드인지 확인
    for (const key of dataKeys) {
      const field = schemaFields.find((f) => f.id === key);
      if (!field) {
        throw new BadRequestException(
          `${CART_ERROR_MESSAGES.ORDER_FORM_DATA_INVALID}: 알 수 없는 필드 '${key}'`,
        );
      }

      const value = orderFormData[key];

      // 3. 타입 검증
      if (field.type === "textbox") {
        if (typeof value !== "string") {
          throw new BadRequestException(
            `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})는 문자열이어야 합니다.`,
          );
        }
      } else if (field.type === "selectbox") {
        if (field.allowMultiple) {
          if (!Array.isArray(value)) {
            throw new BadRequestException(
              `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})는 배열이어야 합니다.`,
            );
          }
        } else {
          if (typeof value !== "string") {
            throw new BadRequestException(
              `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})는 문자열이어야 합니다.`,
            );
          }
        }

        // 4. selectbox 옵션 값 검증
        if (field.options && field.options.length > 0) {
          const validValues = field.options.map((opt) => opt.value);
          if (field.allowMultiple && Array.isArray(value)) {
            for (const v of value) {
              if (!validValues.includes(v)) {
                throw new BadRequestException(
                  `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})의 값 '${v}'가 유효하지 않습니다.`,
                );
              }
            }
          } else if (!field.allowMultiple && typeof value === "string") {
            if (!validValues.includes(value)) {
              throw new BadRequestException(
                `${CART_ERROR_MESSAGES.ORDER_FORM_FIELD_INVALID}: ${field.label}(${field.id})의 값 '${value}'가 유효하지 않습니다.`,
              );
            }
          }
        }
      }
    }
  }

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
      include: {
        product: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                logoImageUrl: true,
              },
            },
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

      // 상품이 비활성화되었거나 품절된 경우
      if (item.product.status === "INACTIVE" || item.product.status === "OUT_OF_STOCK") {
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
          this.validateOrderFormData(orderFormSchema, orderFormData);
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
   * @returns 생성된 장바구니 항목
   */
  async addCartItem(userId: string, addCartItemDto: AddCartItemRequestDto) {
    const { productId, quantity, orderFormData } = addCartItemDto;

    // 상품 존재 여부 및 재고 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(CART_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK);
    }

    // orderFormData 검증
    const orderFormSchema = product.orderFormSchema as OrderFormSchema | null | undefined;
    this.validateOrderFormData(orderFormSchema, orderFormData as OrderFormData | null | undefined);

    // 기존 장바구니 항목 확인 (같은 상품, 같은 주문 폼 데이터)
    // Prisma에서 JSON 필드를 정확히 비교하기 어려우므로, 모든 항목을 가져와서 JavaScript에서 비교
    const existingCartItems = await this.prisma.cart.findMany({
      where: {
        userId,
        productId,
      },
    });

    // orderFormData를 JSON 문자열로 변환하여 비교
    const orderFormDataString = orderFormData ? JSON.stringify(orderFormData) : null;
    const existingCartItem = existingCartItems.find((item) => {
      const itemOrderFormDataString = item.orderFormData
        ? JSON.stringify(item.orderFormData)
        : null;
      return itemOrderFormDataString === orderFormDataString;
    });

    if (existingCartItem) {
      // 기존 항목이 있으면 수량 업데이트
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK);
      }

      return await this.prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: {
            include: {
              store: {
                select: {
                  id: true,
                  name: true,
                  logoImageUrl: true,
                },
              },
            },
          },
        },
      });
    }

    // 새 장바구니 항목 생성
    return await this.prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
        ...(orderFormData && { orderFormData: orderFormData as Prisma.InputJsonValue }),
      },
      include: {
        product: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                logoImageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * 장바구니 항목 수정
   * @param userId 사용자 ID
   * @param cartItemId 장바구니 항목 ID
   * @param updateCartItemDto 장바구니 수정 요청 DTO
   * @returns 수정된 장바구니 항목
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
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(CART_ERROR_MESSAGES.NOT_FOUND);
    }

    // 재고 확인
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException(CART_ERROR_MESSAGES.INSUFFICIENT_STOCK);
    }

    // orderFormData 검증
    const orderFormSchema = cartItem.product.orderFormSchema as OrderFormSchema | null | undefined;
    this.validateOrderFormData(orderFormSchema, orderFormData as OrderFormData | null | undefined);

    // 장바구니 항목 업데이트
    return await this.prisma.cart.update({
      where: { id: cartItemId },
      data: {
        quantity,
        ...(orderFormData !== undefined && { orderFormData: orderFormData as Prisma.InputJsonValue }),
      },
      include: {
        product: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                logoImageUrl: true,
              },
            },
          },
        },
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

