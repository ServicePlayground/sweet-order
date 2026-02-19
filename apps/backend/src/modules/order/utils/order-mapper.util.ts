import { Order, OrderItem } from "@apps/backend/infra/database/prisma/generated/client";
import {
  OrderItemResponseDto,
  OrderResponseDto,
} from "@apps/backend/modules/order/dto/order-detail.dto";
import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";
import { Prisma } from "@apps/backend/infra/database/prisma/generated/client";

/**
 * Prisma Order 엔티티 타입 (orderItems 포함)
 */
type OrderWithItems = Order & {
  orderItems: OrderItem[];
};

/**
 * 주문 매핑 유틸리티
 * Prisma Order 및 OrderItem 엔티티를 응답 DTO로 변환하는 공통 로직을 제공합니다.
 */
export class OrderMapperUtil {
  /**
   * OrderItems select 필드
   * 주문 조회 시 orderItems를 포함하기 위한 공통 include 필드
   * (productName, productImages는 Order에 denormalized 저장됨)
   */
  static readonly ORDER_ITEMS_INCLUDE = {
    orderItems: true,
  } as const satisfies Prisma.OrderInclude;
  /**
   * Prisma OrderItem 엔티티를 OrderItemResponseDto로 변환
   * @param orderItem - Prisma OrderItem 엔티티
   * @returns OrderItemResponseDto 객체
   */
  static mapToOrderItemResponse(orderItem: OrderItem): OrderItemResponseDto {
    return {
      id: orderItem.id,
      pickupDate: orderItem.pickupDate,
      // 사이즈 옵션 정보
      sizeId: orderItem.sizeId ?? undefined,
      sizeDisplayName: orderItem.sizeDisplayName ?? undefined,
      sizeLengthCm: orderItem.sizeLengthCm ?? undefined,
      sizeDescription: orderItem.sizeDescription ?? undefined,
      sizePrice: orderItem.sizePrice ?? undefined,
      // 맛 옵션 정보
      flavorId: orderItem.flavorId ?? undefined,
      flavorDisplayName: orderItem.flavorDisplayName ?? undefined,
      flavorPrice: orderItem.flavorPrice ?? undefined,
      // 기타 옵션
      letteringMessage: orderItem.letteringMessage ?? undefined,
      requestMessage: orderItem.requestMessage ?? undefined,
      quantity: orderItem.quantity,
      itemPrice: orderItem.itemPrice,
      imageUrls: orderItem.imageUrls,
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
    } satisfies OrderItemResponseDto;
  }

  /**
   * Prisma Order 엔티티를 OrderResponseDto로 변환
   * @param order - Prisma Order 엔티티 (orderItems 포함)
   * @returns OrderResponseDto 객체
   */
  static mapToOrderResponse(order: OrderWithItems): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      productId: order.productId,
      productName: order.productName ?? "",
      productImages: order.productImages ?? [],
      storeId: order.storeId,
      storeName: order.storeName ?? "",
      orderNumber: order.orderNumber,
      totalQuantity: order.totalQuantity,
      totalPrice: order.totalPrice,
      // 픽업 정보
      pickupAddress: order.pickupAddress ?? "",
      pickupRoadAddress: order.pickupRoadAddress ?? "",
      pickupDetailAddress: order.pickupDetailAddress ?? "",
      pickupZonecode: order.pickupZonecode ?? "",
      pickupLatitude: order.pickupLatitude ?? 0,
      pickupLongitude: order.pickupLongitude ?? 0,
      orderStatus: order.orderStatus as OrderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => this.mapToOrderItemResponse(item)),
    } satisfies OrderResponseDto;
  }
}
