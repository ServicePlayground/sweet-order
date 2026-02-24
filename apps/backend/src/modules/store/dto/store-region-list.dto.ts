import { ApiProperty } from "@nestjs/swagger";

export class StoreRegionDepth1Dto {
  @ApiProperty({
    description: "1depth 지역 라벨 (시/도)",
    example: "인천",
  })
  label: string;

  @ApiProperty({
    description: "주소 매칭용 검색 키워드 목록",
    example: ["인천"],
    isArray: true,
    type: String,
  })
  searchKeywords: string[];

  @ApiProperty({
    description: "해당 1depth(시/도)에 속한 전체 스토어 수",
    example: 10,
  })
  storeCount: number;
}

export class StoreRegionDepth2Dto {
  @ApiProperty({
    description: "2depth 지역 라벨 (구/군 등)",
    example: "강화·옹진",
  })
  label: string;

  @ApiProperty({
    description: "주소 매칭용 검색 키워드 목록",
    example: ["강화군", "옹진군"],
    isArray: true,
    type: String,
  })
  searchKeywords: string[];

  @ApiProperty({
    description: "해당 지역에 위치한 스토어 수",
    example: 10,
  })
  storeCount: number;
}

export class StoreRegionDepthGroupDto {
  @ApiProperty({
    description: "1depth 지역 정보",
    type: StoreRegionDepth1Dto,
  })
  depth1: StoreRegionDepth1Dto;

  @ApiProperty({
    description: "2depth 지역 목록",
    type: [StoreRegionDepth2Dto],
  })
  depth2: StoreRegionDepth2Dto[];
}

export class StoreRegionDepthsResponseDto {
  @ApiProperty({
    description: "시/도 및 구/군 지역 목록",
    type: [StoreRegionDepthGroupDto],
  })
  regions: StoreRegionDepthGroupDto[];
}
