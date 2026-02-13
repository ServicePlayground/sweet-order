import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { CreateOrderRequestDto } from "@apps/backend/modules/order/dto/order-request.dto";
import {
  ORDER_ERROR_MESSAGES,
  OrderStatus,
} from "@apps/backend/modules/order/constants/order.constants";
import {
  EnableStatus,
  ProductType,
} from "@apps/backend/modules/product/constants/product.constants";
import { CreateOrderResponseDto } from "@apps/backend/modules/order/dto/order-response.dto";

/**
 * 주문 생성 서비스
 * 주문 생성 관련 로직을 담당합니다.
 */
@Injectable()
export class OrderCreateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 주문 생성
   * @param userId - 사용자 ID
   * @param createOrderDto - 주문 생성 요청 DTO
   * @returns 생성된 주문 ID
   */
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderRequestDto,
  ): Promise<CreateOrderResponseDto> {
    const {
      productId,
      items,
      totalQuantity,
      totalPrice,
      pickupAddress,
      pickupRoadAddress,
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
      throw new NotFoundException(ORDER_ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    if (product.salesStatus !== EnableStatus.ENABLE) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.PRODUCT_INACTIVE);
    }

    if (product.visibilityStatus !== EnableStatus.ENABLE) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.PRODUCT_NOT_AVAILABLE);
    }

    // 주문 항목 검증
    if (!items || items.length === 0) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_ORDER_ITEMS);
    }

    // 총 수량 검증
    const calculatedTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    if (calculatedTotalQuantity !== totalQuantity) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_TOTAL_QUANTITY);
    }

    // 총 금액 검증 (기본 가격 + 사이즈 추가 가격(없으면 0) + 맛 추가 가격(없으면 0)) * 수량
    const calculatedTotalPrice = items.reduce((sum, item) => {
      const sizePrice = item.sizePrice ?? 0;
      const flavorPrice = item.flavorPrice ?? 0;
      const itemPrice = product.salePrice + sizePrice + flavorPrice;
      return sum + itemPrice * item.quantity;
    }, 0);

    if (calculatedTotalPrice !== totalPrice) {
      throw new BadRequestException(ORDER_ERROR_MESSAGES.INVALID_TOTAL_PRICE);
    }

    // 주문 생성 (트랜잭션)
    return await this.prisma.$transaction(async (tx) => {
      // 주문 번호 생성 (예: ORD-20240101-001)
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");

      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const todayOrderCount = await tx.order.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const sequence = String(todayOrderCount + 1).padStart(3, "0");
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
          orderNumber,
          totalQuantity,
          totalPrice,
          pickupAddress: pickupAddress ?? null,
          pickupRoadAddress: pickupRoadAddress ?? null,
          pickupZonecode: pickupZonecode ?? null,
          pickupLatitude: pickupLatitude ?? null,
          pickupLongitude: pickupLongitude ?? null,
          orderStatus,
          orderItems: {
            create: items.map((item) => {
              // 가격 계산: 기본 가격 + 사이즈 추가 가격(없으면 0) + 맛 추가 가격(없으면 0)
              const sizePrice = item.sizePrice ?? 0;
              const flavorPrice = item.flavorPrice ?? 0;
              const itemPrice = product.salePrice + sizePrice + flavorPrice;
              return {
                pickupDate: new Date(item.pickupDate),
                // 사이즈 옵션 정보 (옵션이 없는 상품의 경우 null)
                sizeId: item.sizeId ?? null,
                sizeDisplayName: item.sizeDisplayName ?? null,
                sizeLengthCm: item.sizeLengthCm ?? null,
                sizeDescription: item.sizeDescription ?? null,
                sizePrice: item.sizePrice ?? null,
                // 맛 옵션 정보 (옵션이 없는 상품의 경우 null)
                flavorId: item.flavorId ?? null,
                flavorDisplayName: item.flavorDisplayName ?? null,
                flavorPrice: item.flavorPrice ?? null,
                // 기타 옵션
                letteringMessage: item.letteringMessage ?? null,
                requestMessage: item.requestMessage ?? null,
                quantity: item.quantity,
                itemPrice, // 개별 항목 가격 저장
                imageUrls: item.imageUrls ?? [],
              };
            }),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // 주문 ID만 반환
      return { id: order.id };
    });
  }
}

