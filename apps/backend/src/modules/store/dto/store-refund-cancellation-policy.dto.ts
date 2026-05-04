import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

/** 환불·취소 규칙 한 줄 (픽업 N일 전, N=0이면 당일) */
export class RefundRuleItemDto {
  @ApiProperty({
    description: "픽업 N일 전 (0=픽업 당일, 1=픽업 전날 …, 최대 999)",
    example: SWAGGER_EXAMPLES.REFUND_CANCELLATION_POLICY.rules[0].daysBeforePickup,
  })
  @IsInt()
  @Min(0)
  @Max(999)
  daysBeforePickup!: number;

  @ApiProperty({
    description: "해당 시점의 환불·취소 조건",
    example: SWAGGER_EXAMPLES.REFUND_CANCELLATION_POLICY.rules[0].refundDescription,
  })
  @IsString()
  @Length(1, 500)
  refundDescription!: string;
}

/**
 * 스토어 환불·취소 규정 (JSON 컬럼과 동일).
 * `rules`: 위에서부터 순서대로 안내·적용에 쓰일 단계들.
 */
export class RefundCancellationPolicyDto {
  @ApiProperty({
    type: [RefundRuleItemDto],
    description: "규칙 배열 (최소 1개, 최대 30개). 예: 7일 전 50%, 3일 전 30%",
    minItems: 1,
    maxItems: 30,
    example: SWAGGER_EXAMPLES.REFUND_CANCELLATION_POLICY.rules,
  })
  @IsArray()
  @ArrayMinSize(1, { message: "환불·취소 규칙을 최소 1개 이상 입력해야 합니다." })
  @ArrayMaxSize(30, { message: "환불·취소 규칙은 최대 30개까지 입력할 수 있습니다." })
  @ValidateNested({ each: true })
  @Type(() => RefundRuleItemDto)
  rules!: RefundRuleItemDto[];
}
