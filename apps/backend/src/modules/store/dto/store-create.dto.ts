import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested, IsEnum, IsOptional, IsString } from "class-validator";
import {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@apps/backend/modules/business/dto/business-request.dto";
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
 * 스토어 생성 요청 DTO (3단계)
 * 1단계, 2단계의 요청 파라미터와 스토어 정보를 포함합니다.
 */
export class CreateStoreRequestDto extends StoreAddressDto {
  // 1단계: 사업자등록번호 진위확인 요청
  @ApiProperty({
    description: "1단계 사업자등록번호 진위확인 요청 정보",
    type: BusinessValidationRequestDto,
  })
  @ValidateNested() // 내부 중첩된 객체 검증
  @Type(() => BusinessValidationRequestDto)
  businessValidation: BusinessValidationRequestDto;

  // 2단계: 통신판매사업자 등록상세 조회 요청
  @ApiProperty({
    description: "2단계 통신판매사업자 등록상세 조회 요청 정보",
    type: OnlineTradingCompanyDetailRequestDto,
  })
  @ValidateNested()
  @Type(() => OnlineTradingCompanyDetailRequestDto)
  onlineTradingCompanyDetail: OnlineTradingCompanyDetailRequestDto;

  // 3단계: 스토어 정보
  @ApiProperty({
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
    description: "카카오채널 ID",
    example: SWAGGER_EXAMPLES.KAKAO_CHANNEL_ID,
    required: false,
  })
  @IsOptional()
  @IsString()
  kakaoChannelId?: string;

  @ApiProperty({
    description: "인스타그램 ID",
    example: SWAGGER_EXAMPLES.INSTAGRAM_ID,
    required: false,
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

  // 주소/위치는 StoreAddressDto 상속
}

/**
 * 스토어 생성 응답 DTO
 */
export class CreateStoreResponseDto {
  @ApiProperty({
    description: "스토어 ID",
    example: SWAGGER_EXAMPLES.ID,
  })
  id: string;
}
