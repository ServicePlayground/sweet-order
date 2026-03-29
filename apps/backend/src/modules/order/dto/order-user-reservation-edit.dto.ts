import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "@apps/backend/modules/order/dto/order-create.dto";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/order/constants/order.constants";

/**
 * 예약신청 단계 — 픽업 일시 변경 요청
 */
export class UpdateReservationPickupDateRequestDto {
  @ApiProperty({
    description: "변경할 픽업 날짜 및 시간 (ISO 8601)",
    example: "2024-01-15T14:00:00.000Z",
  })
  @IsNotEmpty()
  @IsDateString()
  pickupDate: string;
}

/**
 * 예약신청 단계 — 주문 항목(옵션 조합·수량 등) 전체 교체 요청
 */
export class UpdateReservationOrderItemsRequestDto {
  @ApiProperty({
    description: "주문 항목 목록 (생성 API와 동일 스키마, 기존 항목은 삭제 후 재생성)",
    type: [CreateOrderItemDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: "총 수량 (항목 quantity 합과 일치해야 함)",
    example: SWAGGER_EXAMPLES.ORDER_DATA.totalQuantity,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalQuantity: number;

  @ApiProperty({
    description: "총 금액 (서버 계산 금액과 일치해야 함)",
    example: SWAGGER_EXAMPLES.ORDER_DATA.totalPrice,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalPrice: number;
}
