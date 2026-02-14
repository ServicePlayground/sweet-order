import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { OrderSortBy, OrderType } from "@apps/backend/modules/order/constants/order.constants";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";

/**
 * 사용자용 주문 목록 조회 요청 DTO (페이지네이션)
 */
export class GetUserOrdersRequestDto extends PaginationRequestDto {
  @ApiProperty({
    description: "정렬",
    enum: OrderSortBy,
    example: OrderSortBy.LATEST,
  })
  @IsNotEmpty()
  @IsEnum(OrderSortBy)
  sortBy: OrderSortBy;

  @ApiPropertyOptional({
    description: "주문 타입 (픽업 예정/지난 예약)",
    enum: OrderType,
    example: OrderType.UPCOMING,
  })
  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;
}

/**
 * 사용자용 주문 목록 응답 DTO
 */
export class UserOrderListResponseDto {
  @ApiProperty({
    description: "주문 목록",
    type: [OrderResponseDto],
  })
  data: OrderResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
