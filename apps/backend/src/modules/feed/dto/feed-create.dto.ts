import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/feed/constants/feed.constants";

/**
 * 피드 생성 요청 DTO
 */
export class CreateFeedRequestDto {
  @ApiProperty({
    description: "스토어 ID",
    example: STORE_SWAGGER_EXAMPLES.ID,
  })
  @IsNotEmpty()
  @IsString()
  storeId: string;

  @ApiProperty({
    description: "피드 제목",
    example: SWAGGER_EXAMPLES.TITLE,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "피드 내용 (HTML 에디터 형식)",
    example: SWAGGER_EXAMPLES.CONTENT,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

/**
 * 피드 생성 응답 DTO
 */
export class CreateFeedResponseDto {
  @ApiProperty({
    description: "피드 ID",
    example: STORE_SWAGGER_EXAMPLES.ID,
  })
  id: string;
}
