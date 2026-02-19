import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/order/constants/order.constants";
import { PickupAddressDto } from "@apps/backend/modules/product/dto/product-common.dto";

/**
 * 주문 항목 응답 DTO
 */
export class OrderItemResponseDto {
  @ApiProperty({
    description: "주문 항목 ID",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.id,
  })
  id: string;

  @ApiProperty({
    description: "픽업 날짜 및 시간",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.pickupDate,
  })
  pickupDate: Date;

  // 사이즈 옵션 정보 (옵션이 없는 상품의 경우 null)
  @ApiPropertyOptional({
    description: "선택한 사이즈 옵션 ID (사이즈 옵션이 없는 상품의 경우 null)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeId,
  })
  sizeId?: string;

  @ApiPropertyOptional({
    description: "선택한 사이즈 표시명 (사이즈 옵션이 없는 상품의 경우 null)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeDisplayName,
  })
  sizeDisplayName?: string;

  @ApiPropertyOptional({
    description: "선택한 사이즈 길이 (cm 단위, 사이즈 옵션이 없는 상품의 경우 null)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeLengthCm,
  })
  sizeLengthCm?: number;

  @ApiPropertyOptional({
    description: "선택한 사이즈 설명",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeDescription,
  })
  sizeDescription?: string;

  @ApiPropertyOptional({
    description: "사이즈 추가 가격 (사이즈 옵션이 없으면 0 또는 null)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizePrice,
  })
  sizePrice?: number;

  // 맛 옵션 정보 (옵션이 없는 상품의 경우 null)
  @ApiPropertyOptional({
    description: "선택한 맛 옵션 ID (맛 옵션이 없는 상품의 경우 null)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.flavorId,
  })
  flavorId?: string;

  @ApiPropertyOptional({
    description: "선택한 맛 표시명 (맛 옵션이 없는 상품의 경우 null)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.flavorDisplayName,
  })
  flavorDisplayName?: string;

  @ApiPropertyOptional({
    description: "맛 추가 가격 (맛 옵션이 없으면 0 또는 null)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.flavorPrice,
  })
  flavorPrice?: number;

  @ApiPropertyOptional({
    description: "레터링 메시지",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.letteringMessage,
  })
  letteringMessage?: string;

  @ApiPropertyOptional({
    description: "요청 사항",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.requestMessage,
  })
  requestMessage?: string;

  @ApiProperty({
    description: "수량",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.quantity,
  })
  quantity: number;

  @ApiProperty({
    description: "개별 항목 가격 (기본 가격 + 사이즈 추가 가격 + 맛 추가 가격)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.itemPrice,
  })
  itemPrice: number;

  @ApiProperty({
    description: "업로드한 이미지 URL 목록",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.imageUrls,
    type: [String],
  })
  imageUrls: string[];

  @ApiProperty({
    description: "생성일시",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.createdAt,
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정일시",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.updatedAt,
  })
  updatedAt: Date;
}

/**
 * 주문 응답 DTO
 */
export class OrderResponseDto extends PickupAddressDto {
  @ApiProperty({
    description: "주문 ID",
    example: SWAGGER_EXAMPLES.ORDER_DATA.id,
  })
  id: string;

  @ApiProperty({
    description: "사용자 ID",
    example: SWAGGER_EXAMPLES.ORDER_DATA.userId,
  })
  userId: string;

  @ApiProperty({
    description: "상품 ID",
    example: SWAGGER_EXAMPLES.ORDER_DATA.productId,
  })
  productId: string;

  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.ORDER_DATA.storeId,
  })
  storeId: string;

  @ApiProperty({
    description: "스토어명",
    example: SWAGGER_EXAMPLES.ORDER_DATA.storeName,
  })
  storeName: string;

  @ApiProperty({
    description: "주문 번호",
    example: SWAGGER_EXAMPLES.ORDER_DATA.orderNumber,
  })
  orderNumber: string;

  @ApiProperty({
    description: "총 수량",
    example: SWAGGER_EXAMPLES.ORDER_DATA.totalQuantity,
  })
  totalQuantity: number;

  @ApiProperty({
    description: "총 금액",
    example: SWAGGER_EXAMPLES.ORDER_DATA.totalPrice,
  })
  totalPrice: number;

  // 픽업장소 정보는 PickupAddressDto 상속

  @ApiProperty({
    description: "주문 상태",
    enum: OrderStatus,
    example: SWAGGER_EXAMPLES.ORDER_DATA.orderStatus,
  })
  orderStatus: OrderStatus;

  @ApiProperty({
    description: "생성일시",
    example: SWAGGER_EXAMPLES.ORDER_DATA.createdAt,
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정일시",
    example: SWAGGER_EXAMPLES.ORDER_DATA.updatedAt,
  })
  updatedAt: Date;

  @ApiProperty({
    description: "주문 항목 목록",
    type: [OrderItemResponseDto],
  })
  orderItems: OrderItemResponseDto[];
}
