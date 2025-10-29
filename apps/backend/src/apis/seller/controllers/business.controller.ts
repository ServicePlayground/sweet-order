import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { BusinessService } from "@apps/backend/modules/business/business.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { BusinessValidationRequestDto } from "@apps/backend/modules/business/dto/business-request.dto";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { BUSINESS_SUCCESS_MESSAGES, NTS_API_ERROR_MESSAGES, SWAGGER_RESPONSE_EXAMPLES } from "@apps/backend/modules/business/constants/business.contants";


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
    summary: "(로그인 필요) 사업자등록번호 진위확인",
    description: "국세청 API를 통해 사업자등록번호, 대표자명, 개업일자의 진위를 확인합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.BUSINESS_VALIDATION_RESPONSE)
  @SwaggerResponse(400, createMessageObject(NTS_API_ERROR_MESSAGES.BUSINESS_STATUS_INACTIVE))
  @SwaggerResponse(400, createMessageObject(NTS_API_ERROR_MESSAGES.HTTP_ERROR))
  @SwaggerResponse(400, createMessageObject(NTS_API_ERROR_MESSAGES.INTERNAL_ERROR))
  @SwaggerResponse(400, createMessageObject(NTS_API_ERROR_MESSAGES.TOO_LARGE_REQUEST))
  @SwaggerResponse(400, createMessageObject(NTS_API_ERROR_MESSAGES.REQUEST_DATA_MALFORMED))
  @SwaggerResponse(400, createMessageObject(NTS_API_ERROR_MESSAGES.BAD_JSON_REQUEST))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  async verifyBusinessRegistration(
    @Body() validationDto: BusinessValidationRequestDto,
  ){
    return await this.businessService.verifyBusinessRegistration(validationDto);
  }
}
