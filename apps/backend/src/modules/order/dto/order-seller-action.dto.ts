import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, MaxLength, ValidateIf } from "class-validator";
import {
  OrderStatus,
  SWAGGER_EXAMPLES,
} from "@apps/backend/modules/order/constants/order.constants";

/**
 * 판매자 주문 상태 변경 요청 DTO
 * (`order-user-action.dto.ts`의 사용자 액션과 대응)
 */
export class UpdateOrderStatusRequestDto {
  @ApiProperty({
    description:
      "변경할 주문 상태. 입금대기(예약신청에서만)·예약확정(입금대기·입금완료)·픽업완료·취소완료·취소환불대기·취소환불완료·노쇼 등 전환 규칙은 API 설명 및 `isSellerTransitionAllowed`를 따릅니다.",
    enum: OrderStatus,
    example: OrderStatus.PAYMENT_PENDING,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @ApiPropertyOptional({
    description:
      "취소완료(CANCEL_COMPLETED)로 변경할 때 필수. 판매자 예약 취소 사유(예약신청·입금대기에서만 해당 전환 가능).",
    maxLength: 2000,
  })
  @ValidateIf((o: UpdateOrderStatusRequestDto) => o.orderStatus === OrderStatus.CANCEL_COMPLETED)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  sellerCancelReason?: string;

  @ApiPropertyOptional({
    description: "노쇼(NO_SHOW)로 변경할 때 필수. 픽업대기에서만 해당 전환 가능.",
    maxLength: 2000,
  })
  @ValidateIf((o: UpdateOrderStatusRequestDto) => o.orderStatus === OrderStatus.NO_SHOW)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  sellerNoShowReason?: string;

  @ApiPropertyOptional({
    description:
      "취소환불대기(CANCEL_REFUND_PENDING)로 변경할 때 필수. 판매자가 직접 전환할 때의 사유(사용자 취소·환불 요청 사유 `refundRequestReason`과 별도).",
    maxLength: 2000,
  })
  @ValidateIf(
    (o: UpdateOrderStatusRequestDto) => o.orderStatus === OrderStatus.CANCEL_REFUND_PENDING,
  )
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  sellerCancelRefundPendingReason?: string;
}

/**
 * 주문 상태 관련 PATCH 공통 응답 (`{ id }`).
 * 사용자 주문 액션(입금완료·취소 등)과 판매자 상태 변경 모두에서 사용합니다.
 */
export class UpdateOrderStatusResponseDto {
  @ApiProperty({
    description: "주문 ID",
    example: SWAGGER_EXAMPLES.ORDER_DATA.id,
  })
  id: string;
}
