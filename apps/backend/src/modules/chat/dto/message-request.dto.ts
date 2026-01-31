import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

/**
 * 메시지 전송 요청 DTO
 */
export class SendMessageRequestDto {
  @ApiProperty({
    description: "메시지 내용",
    example: "안녕하세요, 케이크 주문하고 싶어요.",
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: "메시지 내용이 비어있습니다." })
  @MaxLength(1000, { message: "메시지는 1000자를 초과할 수 없습니다." })
  text: string;
}
