import { ApiProperty } from "@nestjs/swagger";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as UPLOAD_SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";

/**
 * 피드 응답 DTO
 */
export class FeedResponseDto {
  @ApiProperty({
    description: "피드 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;

  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  storeId: string;

  @ApiProperty({
    description: "피드 제목",
    example: "신제품 출시 안내",
  })
  title: string;

  @ApiProperty({
    description: "피드 내용 (HTML 에디터 형식)",
    example: "<p>새로운 케이크가 출시되었습니다!</p>",
  })
  content: string;

  @ApiProperty({
    description: "스토어 로고 이미지 URL",
    example: UPLOAD_SWAGGER_EXAMPLES.FILE_URL,
  })
  storeLogoImageUrl: string | null;

  @ApiProperty({
    description: "작성 날짜",
    example: SWAGGER_EXAMPLES.CREATED_AT,
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정 날짜",
    example: SWAGGER_EXAMPLES.CREATED_AT,
  })
  updatedAt: Date;
}

/**
 * 피드 목록 조회 응답 DTO
 */
export class FeedListResponseDto {
  @ApiProperty({
    description: "피드 목록",
    type: [FeedResponseDto],
  })
  data: FeedResponseDto[];

  @ApiProperty({
    description: "페이지네이션 메타 정보",
    type: PaginationMetaResponseDto,
  })
  meta: PaginationMetaResponseDto;
}
