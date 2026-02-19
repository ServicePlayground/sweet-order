import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import {
  CreateOrderItemDto,
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from "@apps/backend/modules/order/dto/order-create.dto";
import {
  ORDER_ERROR_MESSAGES,
  OrderStatus,
} from "@apps/backend/modules/order/constants/order.constants";
import {
  EnableStatus,
  ProductType,
} from "@apps/backend/modules/product/constants/product.constants";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 주문 생성 서비스
 * 주문 생성 관련 로직을 담당합니다.
 */
@Injectable()
export class OrderCreateService {
  constructor(private readonly prisma: PrismaService) {}

  private parseSizeOptions(options: unknown): Array<{
    id: string;
    visible: EnableStatus;
    displayName: string;
    lengthCm?: number;
    description?: string;
    price: number;
  }> {
    if (!Array.isArray(options)) {
      return [];
    }

    return options
      .map((option) => {
        if (!option || typeof option !== "object") {
          return null;
        }

        const candidate = option as Record<string, unknown>;
        if (
          typeof candidate.id !== "string" ||
          typeof candidate.visible !== "string" ||
          typeof candidate.displayName !== "string" ||
          typeof candidate.price !== "number"
        ) {
          return null;
        }

        return {
          id: candidate.id,
          visible: candidate.visible as EnableStatus,
          displayName: candidate.displayName,
          lengthCm: typeof candidate.lengthCm === "number" ? candidate.lengthCm : undefined,
          description:
            typeof candidate.description === "string" ? candidate.description : undefined,
          price: candidate.price,
        };
      })
      .filter((option): option is NonNullable<typeof option> => option !== null);
  }

  private parseFlavorOptions(options: unknown): Array<{
    id: string;
    visible: EnableStatus;
    displayName: string;
    price: number;
  }> {
    if (!Array.isArray(options)) {
      return [];
    }

    return options
      .map((option) => {
        if (!option || typeof option !== "object") {
          return null;
        }

        const candidate = option as Record<string, unknown>;
        if (
          typeof candidate.id !== "string" ||
          typeof candidate.visible !== "string" ||
          typeof candidate.displayName !== "string" ||
          typeof candidate.price !== "number"
        ) {
          return null;
        }

        return {
          id: candidate.id,
          visible: candidate.visible as EnableStatus,
          displayName: candidate.displayName,
          price: candidate.price,
        };
      })
      .filter((option): option is NonNullable<typeof option> => option !== null);
  }

  private validateAndNormalizeItem(
    item: CreateOrderItemDto,
    sizeOptionMap: Map<
      string,
      {
        id: string;
        visible: EnableStatus;
        displayName: string;
        lengthCm?: number;
        description?: string;
        price: number;
      }
    >,
    flavorOptionMap: Map<
      string,
      {
        id: string;
        visible: EnableStatus;
        displayName: string;
        price: number;
      }
    >,
    baseSalePrice: number,
  ) {
    const hasSizePayload =
      item.sizeDisplayName !== undefined ||
      item.sizeLengthCm !== undefined ||
      item.sizeDescription !== undefined ||
      item.sizePrice !== undefined;
    const hasFlavorPayload = item.flavorDisplayName !== undefined || item.flavorPrice !== undefined;

    let selectedSize: {
      id: string;
      displayName: string;
      lengthCm?: number;
      description?: string;
      price: number;
    } | null = null;

    if (item.sizeId) {
      const matchedSize = sizeOptionMap.get(item.sizeId);
      if (!matchedSize || matchedSize.visible !== EnableStatus.ENABLE) {
        LoggerUtil.log(
          `주문 항목 검증 실패: 유효하지 않은 사이즈 옵션 - sizeId: ${item.sizeId}, visible: ${matchedSize?.visible}`,
        );
        throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
      }
      selectedSize = {
        id: matchedSize.id,
        displayName: matchedSize.displayName,
        lengthCm: matchedSize.lengthCm,
        description: matchedSize.description,
        price: matchedSize.price,
      };
    } else if (hasSizePayload) {
      LoggerUtil.log(
        `주문 항목 검증 실패: sizeId 없이 사이즈 정보 제공 - hasSizePayload: ${hasSizePayload}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
    }

    let selectedFlavor: { id: string; displayName: string; price: number } | null = null;
    if (item.flavorId) {
      const matchedFlavor = flavorOptionMap.get(item.flavorId);
      if (!matchedFlavor || matchedFlavor.visible !== EnableStatus.ENABLE) {
        LoggerUtil.log(
          `주문 항목 검증 실패: 유효하지 않은 맛 옵션 - flavorId: ${item.flavorId}, visible: ${matchedFlavor?.visible}`,
        );
        throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
      }
      selectedFlavor = {
        id: matchedFlavor.id,
        displayName: matchedFlavor.displayName,
        price: matchedFlavor.price,
      };
    } else if (hasFlavorPayload) {
      LoggerUtil.log(
        `주문 항목 검증 실패: flavorId 없이 맛 정보 제공 - hasFlavorPayload: ${hasFlavorPayload}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
    }

    const itemPrice = baseSalePrice + (selectedSize?.price ?? 0) + (selectedFlavor?.price ?? 0);

    return {
      pickupDate: new Date(item.pickupDate),
      sizeId: selectedSize?.id ?? null,
      sizeDisplayName: selectedSize?.displayName ?? null,
      sizeLengthCm: selectedSize?.lengthCm ?? null,
      sizeDescription: selectedSize?.description ?? null,
      sizePrice: selectedSize?.price ?? null,
      flavorId: selectedFlavor?.id ?? null,
      flavorDisplayName: selectedFlavor?.displayName ?? null,
      flavorPrice: selectedFlavor?.price ?? null,
      letteringMessage: item.letteringMessage ?? null,
      requestMessage: item.requestMessage ?? null,
      quantity: item.quantity,
      itemPrice,
      imageUrls: item.imageUrls ?? [],
    };
  }

  /**
   * 주문 생성 (사용자용)
   * @param userId - 사용자 ID
   * @param createOrderDto - 주문 생성 요청 DTO
   * @returns 생성된 주문 ID
   */
  async createOrderForUser(
    userId: string,
    createOrderDto: CreateOrderRequestDto,
  ): Promise<CreateOrderResponseDto> {
    const {
      productId,
      items,
      totalQuantity,
      totalPrice,
      storeName,
      pickupAddress,
      pickupRoadAddress,
      pickupDetailAddress = "",
      pickupZonecode,
      pickupLatitude,
      pickupLongitude,
    } = createOrderDto;

    // 상품 존재 여부 및 판매 가능 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: true,
      },
    });

    if (!product) {
      LoggerUtil.log(
        `주문 생성 실패: 상품을 찾을 수 없음 - productId: ${productId}, userId: ${userId}`,
      );
      throw new NotFoundException(ORDER_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    if (product.salesStatus !== EnableStatus.ENABLE) {
      LoggerUtil.log(
        `주문 생성 실패: 상품 판매 비활성화 - productId: ${productId}, userId: ${userId}, salesStatus: ${product.salesStatus}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.PRODUCT_INACTIVE);
    }

    if (product.visibilityStatus !== EnableStatus.ENABLE) {
      LoggerUtil.log(
        `주문 생성 실패: 상품 비공개 상태 - productId: ${productId}, userId: ${userId}, visibilityStatus: ${product.visibilityStatus}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
    }

    // 주문 항목 검증
    if (!items || items.length === 0) {
      LoggerUtil.log(`주문 생성 실패: 주문 항목 없음 - productId: ${productId}, userId: ${userId}`);
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
    }

    // 총 수량 검증
    const calculatedTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    if (calculatedTotalQuantity !== totalQuantity) {
      LoggerUtil.log(
        `주문 생성 실패: 총 수량 불일치 - productId: ${productId}, userId: ${userId}, calculated: ${calculatedTotalQuantity}, provided: ${totalQuantity}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_TOTAL_QUANTITY);
    }

    const sizeOptionMap = new Map(
      this.parseSizeOptions(product.cakeSizeOptions).map((option) => [option.id, option]),
    );
    const flavorOptionMap = new Map(
      this.parseFlavorOptions(product.cakeFlavorOptions).map((option) => [option.id, option]),
    );
    const normalizedItems = items.map((item) =>
      this.validateAndNormalizeItem(item, sizeOptionMap, flavorOptionMap, product.salePrice),
    );

    // 총 금액 검증 (서버 기준 옵션 가격으로 계산)
    const calculatedTotalPrice = normalizedItems.reduce(
      (sum, item) => sum + item.itemPrice * item.quantity,
      0,
    );

    if (calculatedTotalPrice !== totalPrice) {
      LoggerUtil.log(
        `주문 생성 실패: 총 금액 불일치 - productId: ${productId}, userId: ${userId}, calculated: ${calculatedTotalPrice}, provided: ${totalPrice}`,
      );
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_TOTAL_PRICE);
    }

    // 주문 생성 (트랜잭션)
    // 주문 번호 중복 방지를 위해 최대 10회 재시도
    const maxRetries = 10;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            // 주문 번호 생성 (예: ORD-20240101-001)
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

            const startOfDay = new Date(now);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(now);
            endOfDay.setUTCHours(23, 59, 59, 999);

            const todayOrderCount = await tx.order.count({
              where: {
                createdAt: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            });

            // 재시도 시 sequence에 retryCount를 더하여 중복 방지
            const sequence = String(todayOrderCount + 1 + retryCount).padStart(3, "0");
            const orderNumber = `ORD-${dateStr}-${sequence}`;

            // 상품 타입에 따라 주문 상태 결정
            // 일반 케이크(BASIC_CAKE): 예약확정(CONFIRMED)
            // 주문제작 케이크(CUSTOM_CAKE): 예약중(PENDING)
            const orderStatus =
              product.productType === ProductType.BASIC_CAKE
                ? OrderStatus.CONFIRMED
                : OrderStatus.PENDING;

            const order = await tx.order.create({
              data: {
                userId,
                productId,
                storeId: product.storeId,
                storeName,
                orderNumber,
                totalQuantity,
                totalPrice,
                pickupAddress,
                pickupRoadAddress,
                pickupDetailAddress,
                pickupZonecode,
                pickupLatitude,
                pickupLongitude,
                orderStatus,
                orderItems: {
                  create: normalizedItems,
                },
              },
              include: {
                orderItems: true,
              },
            });

            // 주문 ID만 반환
            return { id: order.id };
          },
          {
            maxWait: 5000, // 최대 대기 시간 (5초)
            timeout: 10000, // 타임아웃 (10초)
          },
        );
      } catch (error: any) {
        // 주문 번호 중복 에러인 경우 재시도
        if (error?.code === "P2002") {
          const rawTarget = error?.meta?.target;
          const targetText = Array.isArray(rawTarget)
            ? rawTarget.join(",")
            : String(rawTarget ?? "");
          const isOrderNumberConflict =
            targetText.includes("order_number") || targetText.includes("orderNumber");

          if (!rawTarget || isOrderNumberConflict) {
            retryCount++;
            if (retryCount >= maxRetries) {
              LoggerUtil.log(
                `주문 생성 최종 실패: 재시도 횟수 초과 - userId: ${userId}, productId: ${productId}, retryCount: ${retryCount}, maxRetries: ${maxRetries}`,
              );
              throw new BadRequestException(ORDER_ERROR_MESSAGES.ORDER_CREATE_FAILED);
            }
            LoggerUtil.log(
              `주문 생성 재시도: 주문 번호 중복 - userId: ${userId}, productId: ${productId}, retryCount: ${retryCount}/${maxRetries}`,
            );
            // 짧은 지연 후 재시도
            await new Promise((resolve) => setTimeout(resolve, 10));
            continue;
          }
        }
        // 다른 에러는 로그 남기고 throw
        LoggerUtil.log(
          `주문 생성 실패: 트랜잭션 에러 - userId: ${userId}, productId: ${productId}, error: ${error?.message || String(error)}`,
        );
        throw error;
      }
    }

    LoggerUtil.log(
      `주문 생성 최종 실패: 재시도 루프 종료 - userId: ${userId}, productId: ${productId}, maxRetries: ${maxRetries}`,
    );
    throw new BadRequestException(ORDER_ERROR_MESSAGES.ORDER_CREATE_FAILED);
  }
}
