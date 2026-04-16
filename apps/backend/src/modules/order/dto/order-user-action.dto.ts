import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { StoreBankName } from "@apps/backend/modules/store/constants/store.constants";
import {
  IsValidAccountHolderName,
  IsValidBankAccountNumber,
} from "@apps/backend/modules/store/decorators/validators.decorator";

/**
 * 입금 전 예약 취소 요청 (사용자)
 */
export class CancelOrderBeforePaymentRequestDto {
  @ApiProperty({
    description: "취소 사유",
    example: "일정이 변경되어 취소합니다.",
    maxLength: 2000,
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reason: string;
}

/**
 * 입금완료 요청 (사용자)
 */
export class MarkPaymentCompleteRequestDto {
  @ApiProperty({
    description: "입금자명 (예금주명 형식과 동일 검증)",
    example: "홍길동",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsValidAccountHolderName()
  depositorName: string;
}

/**
 * 입금 완료 이후 취소·환불 요청 (사용자) — 사유 + 환불 계좌 (스토어 정산 계좌와 동일 검증)
 */
export class RequestCancelRefundRequestDto {
  @ApiProperty({
    description: "취소·환불 사유",
    example: "일정 변경으로 취소합니다.",
    maxLength: 2000,
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reason: string;

  @ApiProperty({
    description: "환불받을 은행 (정산 계좌 은행 코드와 동일)",
    enum: StoreBankName,
    example: StoreBankName.KB_KOOKMIN,
  })
  @IsEnum(StoreBankName)
  bankName: StoreBankName;

  @ApiProperty({
    description: "환불 계좌번호 (숫자·하이픈·공백, 4~30자)",
    example: "110-302-1234567",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsValidBankAccountNumber()
  bankAccountNumber: string;

  @ApiProperty({
    description: "예금주명 (한글·영문·숫자·공백, 2~30자)",
    example: "홍길동",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsValidAccountHolderName()
  accountHolderName: string;
}
