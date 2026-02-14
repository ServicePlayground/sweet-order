import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from "class-validator";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as UPLOAD_SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";

/**
 * 스토어 수정 요청 DTO
 */
export class UpdateStoreRequestDto {
  @ApiPropertyOptional({
    description: "스토어 로고 이미지 URL",
    example: UPLOAD_SWAGGER_EXAMPLES.FILE_URL,
    required: false,
  })
  @IsOptional()
  @IsString()
  logoImageUrl?: string;

  @ApiProperty({
    description: "스토어 이름",
    example: SWAGGER_EXAMPLES.NAME,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "스토어 소개",
    example: SWAGGER_EXAMPLES.DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // 주소/위치 정보 (필수)
  @ApiProperty({
    description: "지번 주소 (예: 서울특별시 강남구 역삼동 456-789)",
    example: SWAGGER_EXAMPLES.ADDRESS,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: "도로명 주소 (예: 서울특별시 강남구 테헤란로 123)",
    example: SWAGGER_EXAMPLES.ROAD_ADDRESS,
  })
  @IsString()
  @IsNotEmpty()
  roadAddress: string;

  @ApiProperty({
    description: "우편번호",
    example: SWAGGER_EXAMPLES.ZONECODE,
  })
  @IsString()
  @IsNotEmpty()
  zonecode: string;

  @ApiProperty({
    description: "위도 (카카오지도 마커 표시 및 거리 계산용)",
    example: SWAGGER_EXAMPLES.LATITUDE,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: "경도 (카카오지도 마커 표시 및 거리 계산용)",
    example: SWAGGER_EXAMPLES.LONGITUDE,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsNotEmpty()
  longitude: number;
}

/**
 * 스토어 수정 응답 DTO
 */
export class UpdateStoreResponseDto {
  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;
}
