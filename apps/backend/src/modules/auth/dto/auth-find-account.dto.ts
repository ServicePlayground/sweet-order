import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsValidKoreanPhone } from "@apps/backend/common/decorators/validators.decorator";
import {
  SWAGGER_EXAMPLES,
  SWAGGER_DESCRIPTIONS,
} from "@apps/backend/modules/auth/constants/auth.constants";

/**
 * 계정 찾기 — 휴대폰 인증(FIND_ACCOUNT 목적) 완료 후 요청
 */
export class FindAccountRequestDto {
  @ApiProperty({
    description: SWAGGER_DESCRIPTIONS.PHONE,
    example: SWAGGER_EXAMPLES.CONSUMER_DATA.phone,
  })
  @IsString()
  @IsValidKoreanPhone()
  phone: string;
}
