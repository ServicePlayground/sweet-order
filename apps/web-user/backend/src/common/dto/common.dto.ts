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

/**
 * 에러 메시지 응답 DTO
 * 에러 응답에서 사용하는 메시지 구조
 */
export class ErrorMessageResponseDto {
  @ApiProperty({
    description: "에러 메시지",
    example: "요청 처리 중 오류가 발생했습니다.",
  })
  message: string;
}

export class SuccessMessageResponseDto {
  @ApiProperty({
    description: "성공 메시지",
    example: "요청 처리 중 성공했습니다.",
  })
  message: string;
}
