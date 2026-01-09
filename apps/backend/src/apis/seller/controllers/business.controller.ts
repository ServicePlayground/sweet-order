import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BusinessService } from "@apps/backend/modules/business/business.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import {
  BusinessValidationRequestDto,
  OnlineTradingCompanyDetailRequestDto,
} from "@apps/backend/modules/business/dto/business-request.dto";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import {
  NTS_API_ERROR_MESSAGES,
  KFTC_API_ERROR_MESSAGES,
} from "@apps/backend/modules/business/constants/business.contants";

/**
 * 사업서비스 관련 컨트롤러
 */
@ApiTags("사업 서비스")
@Controller(`${USER_ROLES.SELLER}/business`)
@Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] }) // USER, SELLER, ADMIN 모두 접근 가능
export class SellerBusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**
   * 사업자등록번호 진위확인 API
   * 국세청 API를 통해 사업자등록번호, 대표자명, 개업일자의 진위를 확인합니다.
   */
  @Post("validate")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 사업자등록번호 진위확인하여 정상 영업 상태인지 확인",
    description:
      "국세청 API를 통해 사업자등록번호, 대표자명, 개업일자의 진위를 확인합니다. \n휴업 또는 폐업상태인 경우 오류가 발생합니다.",
  })
  @SwaggerResponse(200, { dataExample: { available: true } })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(NTS_API_ERROR_MESSAGES.BUSINESS_STATUS_INACTIVE),
  })
  @SwaggerResponse(400, { dataExample: createMessageObject(NTS_API_ERROR_MESSAGES.HTTP_ERROR) })
  @SwaggerResponse(400, { dataExample: createMessageObject(NTS_API_ERROR_MESSAGES.INTERNAL_ERROR) })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(NTS_API_ERROR_MESSAGES.TOO_LARGE_REQUEST),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(NTS_API_ERROR_MESSAGES.REQUEST_DATA_MALFORMED),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(NTS_API_ERROR_MESSAGES.BAD_JSON_REQUEST),
  })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  async verifyBusinessRegistration(@Body() validationDto: BusinessValidationRequestDto) {
    await this.businessService.verifyBusinessRegistration(validationDto);
    return { available: true };
  }

  /**
   * 통신판매사업자 등록상세 조회 API
   * 공정거래위원회 API를 통해 통신판매사업자 등록상세 정보를 조회합니다.
   */
  @Get("online-trading-company/detail")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 통신판매사업자 등록상세 조회하여 정상 영업 상태인지 확인",
    description:
      "공정거래위원회 API를 통해 통신판매사업자 등록상세 정보를 조회합니다. \n휴업 또는 폐업상태인 경우 오류가 발생합니다.",
  })
  @SwaggerResponse(200, { dataExample: { available: true } })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["01"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["02"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["03"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["04"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["05"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["10"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["11"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["12"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["20"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["21"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["22"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["30"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["31"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["32"]) })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES["33"]) })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES.OPERATION_STATUS_NOT_NORMAL),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(
      KFTC_API_ERROR_MESSAGES.ONLINE_TRADING_COMPANY_DETAIL_NOT_FOUND,
    ),
  })
  @SwaggerResponse(400, { dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES.HTTP_ERROR) })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(KFTC_API_ERROR_MESSAGES.INTERNAL_ERROR),
  })
  @SwaggerResponse(401, { dataExample: createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED) })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  async getOnlineTradingCompanyDetail(@Query() detailDto: OnlineTradingCompanyDetailRequestDto) {
    await this.businessService.getOnlineTradingCompanyDetail(detailDto);
    return { available: true };
  }
}
