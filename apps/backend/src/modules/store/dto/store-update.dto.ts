import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import {
  IsValidStoreName,
  IsValidStoreDescription,
  IsValidLogoImageUrl,
  IsValidBankAccountNumber,
  IsValidAccountHolderName,
} from "@apps/backend/modules/store/decorators/validators.decorator";
import {
  SWAGGER_EXAMPLES,
  StoreBankName,
} from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as UPLOAD_SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";
import { StoreAddressDto } from "@apps/backend/modules/store/dto/store-common.dto";

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
