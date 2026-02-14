import { Order, OrderItem } from "@apps/backend/infra/database/prisma/generated/client";
import {
  OrderItemResponseDto,
  OrderResponseDto,
} from "@apps/backend/modules/order/dto/order-detail.dto";
import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";

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
      storeId: order.storeId,
      orderNumber: order.orderNumber,
      totalQuantity: order.totalQuantity,
      totalPrice: order.totalPrice,
      // 픽업 정보 (선택사항)
      pickupAddress: order.pickupAddress ?? undefined,
      pickupRoadAddress: order.pickupRoadAddress ?? undefined,
      pickupZonecode: order.pickupZonecode ?? undefined,
      pickupLatitude: order.pickupLatitude ?? undefined,
      pickupLongitude: order.pickupLongitude ?? undefined,
      orderStatus: order.orderStatus as OrderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => this.mapToOrderItemResponse(item)),
    } satisfies OrderResponseDto;
  }
}
