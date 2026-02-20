import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum } from "class-validator";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { ProductResponseDto } from "@apps/backend/modules/product/dto/product-detail.dto";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-detail.dto";
import { LikeType } from "@apps/backend/modules/like/constants/like.constants";

/**
 * 내가 좋아요한 목록 조회 요청 DTO (페이지네이션)
 */
export class GetMyLikesRequestDto extends PaginationRequestDto {
  @ApiProperty({
    description: "좋아요 타입 (상품/스토어)",
    enum: LikeType,
    example: LikeType.PRODUCT,
  })
  @IsNotEmpty()
  @IsEnum(LikeType)
  type: LikeType;
}

/**
 * 내가 좋아요한 상품 목록 응답 DTO
 */
export class MyProductLikeListResponseDto {
  @ApiProperty({
    description: "상품 목록",
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}

/**
 * 내가 좋아요한 스토어 목록 응답 DTO
 */
export class MyStoreLikeListResponseDto {
  @ApiProperty({
    description: "스토어 목록",
    type: [StoreResponseDto],
  })
  data: StoreResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
