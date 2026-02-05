import { Controller, Post, Get, Body, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { CreateStoreRequestDto } from "@apps/backend/modules/store/dto/store.request.dto";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import {
  NTS_API_ERROR_MESSAGES,
  KFTC_API_ERROR_MESSAGES,
} from "@apps/backend/modules/business/constants/business.contants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  STORE_ERROR_MESSAGES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@apps/backend/modules/store/constants/store.constants";
import { StoreListResponseDto } from "@apps/backend/modules/store/dto/store-response.dto";

/**
 * 스토어 관련 컨트롤러
 */
@ApiTags("스토어")
@ApiExtraModels(StoreListResponseDto)
@Controller(`${USER_ROLES.SELLER}/store`)
@Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] }) // USER, SELLER, ADMIN 모두 접근 가능
export class SellerStoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 스토어 생성 API (3단계)
   * 1단계, 2단계의 요청 파라미터를 재검증하고 스토어를 생성합니다.
   */
  @Post("/create")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 생성 (3단계)",
    description:
      "1단계(사업자등록번호 진위확인)와 2단계(통신판매사업자 등록상세 조회)의 요청 파라미터를 재검증하고 스토어를 생성합니다. \n1단계 사업자등록번호는 2단계 사업자등록번호와 같아야 합니다. \n같은 사업자등록번호와 인허가관리번호(통신판매사업자 신고번호) 조합으로 이미 스토어가 존재하면 오류가 발생합니다.",
  })
  @SwaggerResponse(201, { dataExample: SWAGGER_RESPONSE_EXAMPLES.STORE_CREATED_RESPONSE })
  // 사업자등록번호 진위확인 API 오류 응답
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
  // 통신판매사업자 등록상세 조회 API 오류 응답
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
  // 스토어 생성 오류 응답
  @SwaggerResponse(400, {
    dataExample: createMessageObject(STORE_ERROR_MESSAGES.BUSINESS_REGISTRATION_NUMBER_MISMATCH),
  })
  @SwaggerResponse(400, {
    dataExample: createMessageObject(
      STORE_ERROR_MESSAGES.STORE_ALREADY_EXISTS_WITH_SAME_BUSINESS_INFO,
    ),
  })
  // 인증 오류 응답
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
  async createStore(
    @Request() req: { user: JwtVerifiedPayload },
    @Body() createStoreDto: CreateStoreRequestDto,
  ) {
    return await this.storeService.createStore(req.user.sub, createStoreDto);
  }

  /**
   * 내 스토어 목록 조회 API
   * 현재 로그인한 사용자가 등록한 모든 스토어 목록을 조회합니다.
   */
  @Get("/list")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 내 스토어 목록 조회",
    description: "현재 로그인한 사용자가 등록한 모든 스토어 목록을 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: StoreListResponseDto })
  // 인증 오류 응답
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
  async getMyStores(@Request() req: { user: JwtVerifiedPayload }) {
    return await this.storeService.getStoresByUserId(req.user.sub);
  }
}
