import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { IsValidDetailAddress } from "@apps/backend/modules/store/decorators/validators.decorator";

export class StoreAddressDto {
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
    description: "상세주소 (예: 101호, 지하 1층)",
    example: SWAGGER_EXAMPLES.DETAIL_ADDRESS,
  })
  @IsValidDetailAddress()
  detailAddress: string;

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
