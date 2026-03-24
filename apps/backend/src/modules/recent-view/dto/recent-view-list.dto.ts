import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";

/**
 * 최근 본 상품 목록 조회 요청 DTO
 * 최근 본 목록은 viewedAt 기준 최신순으로 고정 정렬됩니다.
 */
export class GetRecentViewedProductsRequestDto extends PaginationRequestDto {}
