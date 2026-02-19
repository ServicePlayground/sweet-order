import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min, Max } from "class-validator";
import { StringToNumber } from "@apps/backend/common/decorators/transform.decorator";

/**
 * 페이지네이션 요청 베이스 DTO
 * 목록 조회 요청 DTO에서 공통으로 사용하는 page와 limit 필드를 제공합니다.
 */
export class PaginationRequestDto {
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
