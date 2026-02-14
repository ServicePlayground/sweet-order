import { ApiProperty } from "@nestjs/swagger";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";

/**
 * 파일 업로드 응답 DTO
 */
export class UploadFileResponseDto {
  @ApiProperty({
    description: "업로드된 파일의 URL",
    example: SWAGGER_EXAMPLES.FILE_URL,
  })
  fileUrl: string;
}
