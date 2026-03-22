import { ApiProperty } from "@nestjs/swagger";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";

/**
 * 작성 가능한 후기(픽업 완료·미작성·삭제로 인한 재작성 불가 아님) 대상 주문 목록 조회 요청
 */
export class GetWritableReviewOrdersRequestDto extends PaginationRequestDto {}

/**
 * 작성 가능한 후기 대상 주문 목록 응답 (주문 상세와 동일 스키마)
 */
export class WritableReviewOrdersListResponseDto {
  @ApiProperty({
    description: "후기를 작성할 수 있는 주문 목록",
    type: [OrderResponseDto],
  })
  data: OrderResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
