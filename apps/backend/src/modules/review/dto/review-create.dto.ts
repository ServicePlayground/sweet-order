import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ArrayMaxSize,
} from "class-validator";

/**
 * 마이페이지 — 픽업 완료 주문 기준 후기 작성 요청 DTO
 */
export class CreateMyReviewRequestDto {
  @ApiProperty({
    description: "후기를 작성할 주문 ID (본인의 픽업 완료 주문)",
    example: "QXZw02vBqVXNQ29c4w9n9ZdG",
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: "별점 (0.0 ~ 5.0)",
    example: 5,
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: "후기 내용",
    example: "정말 맛있었어요! 다음에도 주문할게요.",
    maxLength: 2000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({
    description: "후기 이미지 URL 목록 (선택)",
    type: [String],
    example: ["https://example.com/review-image1.jpg"],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  imageUrls?: string[];
}
