import { ApiProperty } from "@nestjs/swagger";

/**
 * 응답 DTO
 * Swagger 문서 생성을 위한 성공 응답 클래스
 */
export class ResponseDto {
  @ApiProperty({
    description: "요청 성공 여부",
    example: [true, false],
  })
  success: boolean;
}

export class HTTP200ResponseDto extends ResponseDto {
  @ApiProperty({
    description: "성공 메시지",
    example: "요청이 성공적으로 처리되었습니다.",
  })
  message: string;
}

export class HTTP400ResponseDto extends ResponseDto {
  @ApiProperty({
    description: "에러 메시지",
    example: "잘못된 요청입니다.",
  })
  message: string;
}

export class HTTP401ResponseDto extends ResponseDto {
  @ApiProperty({
    description: "에러 메시지",
    example: "권한이 없습니다.",
  })
  message: string;
}

export class HTTP404ResponseDto extends ResponseDto {
  @ApiProperty({
    description: "에러 메시지",
    example: "리소스를 찾을 수 없습니다.",
  })
  message: string;
}

export class HTTP409ResponseDto extends ResponseDto {
  @ApiProperty({
    description: "에러 메시지",
    example: "중복된 사용자입니다.",
  })
  message: string;
}

export class HTTP500ResponseDto extends ResponseDto {
  @ApiProperty({
    description: "에러 메시지",
    example: "서버 내부 오류입니다.",
  })
  message: string;
}
