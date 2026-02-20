import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@apps/backend/modules/business/dto/business-request.dto";
import {
  IsValidStoreName,
  IsValidStoreDescription,
  IsValidLogoImageUrl,
} from "@apps/backend/modules/store/decorators/validators.decorator";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
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
