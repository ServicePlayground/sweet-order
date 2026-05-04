import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import {
  IsValidStoreName,
  IsValidStoreDescription,
  IsValidLogoImageUrl,
  IsValidBankAccountNumber,
  IsValidAccountHolderName,
  IsValidStorePhoneNumber,
} from "@apps/backend/modules/store/decorators/validators.decorator";
import {
  SWAGGER_EXAMPLES,
  StoreBankName,
} from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as UPLOAD_SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";
import { StoreAddressDto } from "@apps/backend/modules/store/dto/store-common.dto";
import { RefundCancellationPolicyDto } from "@apps/backend/modules/store/dto/store-refund-cancellation-policy.dto";

/**
 * 스토어 수정 요청 DTO
 */
export class UpdateStoreRequestDto extends StoreAddressDto {
  @ApiPropertyOptional({
    description: "스토어 로고 이미지 URL",
    example: UPLOAD_SWAGGER_EXAMPLES.FILE_URL,
    required: false,
  })
  @IsValidLogoImageUrl()
  logoImageUrl?: string;

  @ApiProperty({
    description: "스토어 이름",
    example: SWAGGER_EXAMPLES.NAME,
  })
  @IsValidStoreName()
  name: string;

  @ApiProperty({
    description: "스토어 소개",
    example: SWAGGER_EXAMPLES.DESCRIPTION,
    required: false,
  })
  @IsValidStoreDescription()
  description?: string;

  @ApiProperty({
    description: "스토어 연락처 (전화/휴대폰)",
    example: SWAGGER_EXAMPLES.PHONE_NUMBER,
  })
  @IsValidStorePhoneNumber()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: "카카오채널 ID",
    example: SWAGGER_EXAMPLES.KAKAO_CHANNEL_ID,
  })
  @IsOptional()
  @IsString()
  kakaoChannelId?: string;

  @ApiPropertyOptional({
    description: "인스타그램 ID",
    example: SWAGGER_EXAMPLES.INSTAGRAM_ID,
  })
  @IsOptional()
  @IsString()
  instagramId?: string;

  @ApiProperty({
    description: "정산 계좌번호 (숫자, 하이픈, 공백)",
    example: SWAGGER_EXAMPLES.BANK_ACCOUNT_NUMBER,
  })
  @IsValidBankAccountNumber()
  bankAccountNumber: string;

  @ApiProperty({
    description: "정산 계좌 은행 코드",
    enum: StoreBankName,
    example: SWAGGER_EXAMPLES.BANK_NAME,
  })
  @IsEnum(StoreBankName)
  bankName: StoreBankName;

  @ApiProperty({
    description: "예금주명",
    example: SWAGGER_EXAMPLES.ACCOUNT_HOLDER_NAME,
  })
  @IsValidAccountHolderName()
  accountHolderName: string;

  @ApiProperty({
    description:
      "환불·취소 규정(필수). `rules` 배열(최소 1개): 각 항목에 픽업 N일 전(0=당일) + 조건.",
    type: RefundCancellationPolicyDto,
    example: SWAGGER_EXAMPLES.REFUND_CANCELLATION_POLICY,
  })
  @ValidateNested()
  @Type(() => RefundCancellationPolicyDto)
  refundCancellationPolicy: RefundCancellationPolicyDto;

  // 주소/위치는 StoreAddressDto 상속
}

/**
 * 스토어 수정 응답 DTO
 */
export class UpdateStoreResponseDto {
  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;
}
