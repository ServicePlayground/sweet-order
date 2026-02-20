import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from "class-validator";
import { SWAGGER_EXAMPLES as STORE_SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";

/**
 * 픽업장소 정보 DTO
 */
export class PickupAddressDto {
  @ApiProperty({
    description: "픽업장소 - 지번 주소 (예: 서울특별시 강남구 역삼동 456-789)",
    example: STORE_SWAGGER_EXAMPLES.ADDRESS,
  })
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @ApiProperty({
    description: "픽업장소 - 도로명 주소 (예: 서울특별시 강남구 테헤란로 123)",
    example: STORE_SWAGGER_EXAMPLES.ROAD_ADDRESS,
  })
  @IsString()
  @IsNotEmpty()
  pickupRoadAddress: string;

  @ApiPropertyOptional({
    description: "픽업장소 - 상세주소 (예: 101호, 지하 1층)",
    example: STORE_SWAGGER_EXAMPLES.DETAIL_ADDRESS,
  })
  @IsOptional()
  // @IsValidDetailAddress()
  pickupDetailAddress?: string;

  @ApiProperty({
    description: "픽업장소 - 우편번호",
    example: STORE_SWAGGER_EXAMPLES.ZONECODE,
  })
  @IsString()
  @IsNotEmpty()
  pickupZonecode: string;

  @ApiProperty({
    description: "픽업장소 - 위도 (카카오지도 마커 표시 및 거리 계산용)",
    example: STORE_SWAGGER_EXAMPLES.LATITUDE,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsNotEmpty()
  pickupLatitude: number;

  @ApiProperty({
    description: "픽업장소 - 경도 (카카오지도 마커 표시 및 거리 계산용)",
    example: STORE_SWAGGER_EXAMPLES.LONGITUDE,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsNotEmpty()
  pickupLongitude: number;
}
