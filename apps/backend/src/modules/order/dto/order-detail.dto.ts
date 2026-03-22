import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { OrderStatus } from "@apps/backend/modules/order/constants/order.constants";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/order/constants/order.constants";
import { PickupAddressDto } from "@apps/backend/modules/product/dto/product-common.dto";
import { StoreBankName } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 주문 항목 응답 DTO
 */
export class OrderItemResponseDto {
  @ApiProperty({
    description: "주문 항목 ID",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.id,
  })
  id: string;

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
    description: "상품명",
    example: SWAGGER_EXAMPLES.ORDER_DATA.productName,
  })
  productName: string;

  @ApiProperty({
    description: "상품 이미지 URL 목록",
    example: SWAGGER_EXAMPLES.ORDER_DATA.productImages,
    type: [String],
  })
  productImages: string[];

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

  @ApiProperty({
    description: "픽업 날짜 및 시간",
    example: SWAGGER_EXAMPLES.ORDER_DATA.pickupDate,
  })
  pickupDate: Date;

  // 픽업장소 정보는 PickupAddressDto 상속

  @ApiProperty({
    description: "주문 상태",
    enum: OrderStatus,
    example: SWAGGER_EXAMPLES.ORDER_DATA.orderStatus,
  })
  orderStatus: OrderStatus;

  @ApiPropertyOptional({
    description:
      "입금 전 사용자 취소 시 입력한 사유. 자동 만료 취소·판매자 취소 등에서는 null일 수 있음",
    example: "일정 변경",
    nullable: true,
  })
  userCancelReason: string | null;

  @ApiPropertyOptional({
    description: "판매자가 입금대기에서 예약 취소(취소완료) 시 입력한 사유. 해당 없으면 null",
    example: "재고 부족",
    nullable: true,
  })
  sellerCancelReason: string | null;

  @ApiPropertyOptional({
    description: "판매자가 픽업대기에서 노쇼 처리 시 입력한 사유. 해당 없으면 null",
    example: "픽업 시간 경과 후 연락 불가",
    nullable: true,
  })
  sellerNoShowReason: string | null;

  @ApiPropertyOptional({
    description:
      "입금 이후 사용자가 취소·환불 요청 API로 전환할 때 입력한 사유. 판매자가 직접 취소환불대기로 바꾼 경우는 `sellerCancelRefundPendingReason`을 봅니다.",
    example: "일정 변경",
    nullable: true,
  })
  refundRequestReason: string | null;

  @ApiPropertyOptional({
    description:
      "판매자가 취소환불대기로 전환할 때 입력한 사유. 사용자 취소·환불 요청 사유(`refundRequestReason`)와 별도 필드입니다.",
    example: "고객 요청에 따른 환불 진행",
    nullable: true,
  })
  sellerCancelRefundPendingReason: string | null;

  @ApiPropertyOptional({
    description: "환불받을 은행 (취소·환불 요청 시). 해당 없으면 null",
    enum: StoreBankName,
    nullable: true,
  })
  refundBankName: StoreBankName | null;

  @ApiPropertyOptional({
    description: "환불 계좌번호. 해당 없으면 null",
    nullable: true,
  })
  refundBankAccountNumber: string | null;

  @ApiPropertyOptional({
    description: "환불 예금주명. 해당 없으면 null",
    nullable: true,
  })
  refundAccountHolderName: string | null;

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
