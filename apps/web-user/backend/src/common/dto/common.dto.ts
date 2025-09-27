import { ApiProperty } from "@nestjs/swagger";

/**
 * 사용 가능 여부 응답 DTO
 * 중복 확인 등의 API에서 사용 가능 여부를 반환할 때 사용
 */
export class AvailabilityResponseDto {
  @ApiProperty({
    description: "사용 가능 여부",
    example: true,
  })
  available: boolean;
}
