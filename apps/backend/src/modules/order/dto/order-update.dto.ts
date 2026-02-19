import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum } from "class-validator";
import {
  OrderStatus,
  SWAGGER_EXAMPLES,
} from "@apps/backend/modules/order/constants/order.constants";

/**
 * 주문 상태 변경 요청 DTO
 */
export class UpdateOrderStatusRequestDto {
  @ApiProperty({
    description: "변경할 주문 상태",
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}

/**
 * 주문 상태 변경 응답 DTO
 */
export class UpdateOrderStatusResponseDto {
  @ApiProperty({
    description: "주문 ID",
    example: SWAGGER_EXAMPLES.ORDER_DATA.id,
  })
  id: string;
}
