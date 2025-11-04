import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@apps/backend/modules/business/dto/business-request.dto";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/store/constants/store.constants";
import { SWAGGER_EXAMPLES as UPLOAD_SWAGGER_EXAMPLES } from "@apps/backend/modules/upload/constants/upload.constants";

/**
 * 스토어 생성 요청 DTO (3단계)
 * 1단계, 2단계의 요청 파라미터와 스토어 정보를 포함합니다.
 */
export class CreateStoreRequestDto {
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
  @IsString()
  @IsOptional()
  logoImageUrl?: string;

  @ApiProperty({
    description: "스토어 이름",
    example: SWAGGER_EXAMPLES.NAME,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "스토어 소개",
    example: SWAGGER_EXAMPLES.DESCRIPTION,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
