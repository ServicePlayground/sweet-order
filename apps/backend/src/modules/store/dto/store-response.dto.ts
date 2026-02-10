import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as BUSINESS_SWAGGER_EXAMPLES } from "@apps/backend/modules/business/constants/business.contants";
import { SWAGGER_EXAMPLES as USER_SWAGGER_EXAMPLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { SWAGGER_EXAMPLES as UPLOAD_SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";

/**
 * 스토어 응답 DTO
 */
export class StoreResponseDto {
  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;

  @ApiProperty({
    description: "사용자 ID",
    example: USER_SWAGGER_EXAMPLES.USER_DATA.id,
  })
  userId: string;

  @ApiPropertyOptional({
    description: "스토어 로고 이미지 URL",
    example: UPLOAD_SWAGGER_EXAMPLES.FILE_URL,
  })
  logoImageUrl?: string | null;

  @ApiProperty({
    description: "스토어 이름",
    example: SWAGGER_EXAMPLES.NAME,
  })
  name: string;

  @ApiPropertyOptional({
    description: "스토어 소개",
    example: SWAGGER_EXAMPLES.DESCRIPTION,
  })
  description?: string | null;

  @ApiProperty({
    description: "사업자등록번호",
    example: BUSINESS_SWAGGER_EXAMPLES.B_NO,
  })
  businessNo: string;

  @ApiProperty({
    description: "대표자명",
    example: BUSINESS_SWAGGER_EXAMPLES.P_NM,
  })
  representativeName: string;

  @ApiProperty({
    description: "개업일자",
    example: BUSINESS_SWAGGER_EXAMPLES.START_DT,
  })
  openingDate: string;

  @ApiProperty({
    description: "사업자명",
    example: BUSINESS_SWAGGER_EXAMPLES.B_NM,
  })
  businessName: string;

  @ApiProperty({
    description: "업종",
    example: BUSINESS_SWAGGER_EXAMPLES.B_SECTOR,
  })
  businessSector: string;

  @ApiProperty({
    description: "업태",
    example: BUSINESS_SWAGGER_EXAMPLES.B_TYPE,
  })
  businessType: string;

  @ApiProperty({
    description: "통신판매사업자 인허가관리번호",
    example: BUSINESS_SWAGGER_EXAMPLES.PRMMI_MNNO,
  })
  permissionManagementNumber: string;

  @ApiProperty({
    description: "지번 주소",
    example: SWAGGER_EXAMPLES.ADDRESS,
  })
  address: string;

  @ApiProperty({
    description: "도로명 주소",
    example: SWAGGER_EXAMPLES.ROAD_ADDRESS,
  })
  roadAddress: string;

  @ApiProperty({
    description: "우편번호",
    example: SWAGGER_EXAMPLES.ZONECODE,
  })
  zonecode: string;

  @ApiProperty({
    description: "위도",
    example: SWAGGER_EXAMPLES.LATITUDE,
  })
  latitude: number;

  @ApiProperty({
    description: "경도",
    example: SWAGGER_EXAMPLES.LONGITUDE,
  })
  longitude: number;

  @ApiProperty({
    description: "좋아요 수",
    example: 25,
  })
  likeCount: number;

  @ApiPropertyOptional({
    description: "좋아요 여부 (로그인한 사용자의 경우에만 제공)",
    example: true,
  })
  isLiked?: boolean | null;

  @ApiProperty({
    description: "평균 별점 (해당 스토어의 모든 상품 후기들의 평균 별점)",
    example: 4.5,
  })
  averageRating: number;

  @ApiProperty({
    description: "전체 후기 개수 (해당 스토어의 모든 상품 후기 개수)",
    example: 42,
  })
  totalReviewCount: number;

  @ApiProperty({
    description: "생성일시",
    example: SWAGGER_EXAMPLES.CREATED_AT,
  })
  createdAt: Date;

  @ApiProperty({
    description: "수정일시",
    example: SWAGGER_EXAMPLES.CREATED_AT,
  })
  updatedAt: Date;
}

/**
 * 스토어 목록 조회 응답 DTO
 */
export class StoreListResponseDto {
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
