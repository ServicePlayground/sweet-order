import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { StringToNumber } from "@apps/backend/common/decorators/transform.decorator";

/**
 * 피드 생성 요청 DTO
 */
export class CreateFeedRequestDto {
  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  @IsNotEmpty()
  @IsString()
  storeId: string;

  @ApiProperty({
    description: "피드 제목",
    example: "신제품 출시 안내",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "피드 내용 (HTML 에디터 형식)",
    example: "<p>새로운 케이크가 출시되었습니다!</p>",
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

/**
 * 피드 수정 요청 DTO
 */
export class UpdateFeedRequestDto {
  @ApiProperty({
    description: "피드 제목",
    example: "신제품 출시 안내",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "피드 내용 (HTML 에디터 형식)",
    example: "<p>새로운 케이크가 출시되었습니다!</p>",
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

/**
 * 피드 목록 조회 요청 DTO (무한 스크롤)
 */
export class GetFeedsRequestDto {
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
    example: 20,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;
}
