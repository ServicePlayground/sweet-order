import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MinLength, MaxLength } from "class-validator";

export class WithdrawAccountRequestDto {
  @ApiProperty({
    description: "회원 탈퇴 사유",
    example: "서비스를 더 이상 사용하지 않게 되어 탈퇴합니다.",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  reason: string;
}
