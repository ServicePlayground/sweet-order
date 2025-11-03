import { ApiProperty } from "@nestjs/swagger";

/**
 * 파일 업로드 응답 DTO
 */
export class UploadFileResponseDto {
  @ApiProperty({
    description: "업로드 완료 후 파일에 접근할 수 있는 URL (이미지 표시용)",
    example: "https://s3.ap-northeast-1.amazonaws.com/sweetorder-uploads-staging-apne1/uploads/profile.png",
  })
  fileUrl: string;
}

