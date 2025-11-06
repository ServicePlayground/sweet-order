import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsNotEmpty,
} from "class-validator";
import {
  StringToArray,
  StringToNumber,
  OptionalStringToNumber,
} from "@apps/backend/common/decorators/transform.decorator";
import {
  DeliveryMethod,
  SortBy,
  SizeRange,
} from "@apps/backend/modules/product/constants/product.constants";

/**
 * 상품 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetProductsRequestDto {
  @ApiProperty({
    description: "(무한 스크롤 필수) 페이지 번호 (1부터 시작)",
    example: 1,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: "(무한 스크롤 필수) 조회할 항목 수",
    example: 30,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

  @ApiProperty({
    description: "정렬",
    enum: SortBy,
    example: SortBy.POPULAR,
  })
  @IsNotEmpty()
  @IsEnum(SortBy)
  sortBy: SortBy;

  @ApiPropertyOptional({
    description: "(전체 검색일 경우 생략) 검색 키워드",
    example: "크리스마스 케이크",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "(필터) 인원 수 - (중복가능)쉼표로 구분하여 전달",
    enum: SizeRange,
    type: "string",
    example: `${SizeRange.ONE_TO_TWO},${SizeRange.TWO_TO_THREE}`,
  })
  @StringToArray()
  @IsOptional()
  @IsArray()
  @IsEnum(SizeRange, { each: true })
  sizeRange?: SizeRange[];

  @ApiPropertyOptional({
    description: "(필터) 수령 방식 - (중복가능)쉼표로 구분하여 전달",
    enum: DeliveryMethod,
    type: "string",
    example: `${DeliveryMethod.PICKUP},${DeliveryMethod.DELIVERY}`,
  })
  @StringToArray()
  @IsOptional()
  @IsArray()
  @IsEnum(DeliveryMethod, { each: true })
  deliveryMethod?: DeliveryMethod[];

  @ApiPropertyOptional({ description: "(필터) 최소 가격", example: 10000 })
  @OptionalStringToNumber()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: "(필터) 최대 가격", example: 100000 })
  @OptionalStringToNumber()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
