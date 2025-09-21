import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse as NestSwaggerApiResponse } from "@nestjs/swagger";
import { AuthService } from "@web-user/backend/modules/auth/auth.service";
import {
  RegisterRequestDto,
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
  CheckUserIdRequestDto,
  CheckPhoneRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import { RegisterDataResponseDto } from "@web-user/backend/modules/auth/dto/auth-data-response.dto";
import { HTTP_STATUS_MESSAGES } from "@web-user/backend/common/constants/app.constants";
import { ApiResponseDto } from "@web-user/backend/common/dto/response.dto";
import { JwtAuthGuard } from "@web-user/backend/common/guards/jwt-auth.guard";
import { Public } from "@web-user/backend/common/decorators/public.decorator";
import {
  ErrorMessageResponse,
  AvailabilityResponse,
} from "@web-user/backend/common/types/auth.types";

/**
 * 인증 컨트롤러
 * 사용자 인증 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags("인증")
@Controller("auth")
@UseGuards(JwtAuthGuard) // 기본적으로 모든 엔드포인트에 JWT 인증 가드 적용 // @Public() 데코레이터가 있는 엔드포인트는 인증을 건너뜀
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 일반 회원가입 API
   * 새로운 사용자를 등록하고 JWT 토큰을 발급합니다.
   */
  @Post("register")
  @Public() // 인증을 건너뛰는 엔드포인트 (회원가입은 인증이 필요 없음)
  @HttpCode(HttpStatus.CREATED) // HTTP 201 상태 코드 반환
  @ApiOperation({ summary: "일반 회원가입" })
  @NestSwaggerApiResponse({
    status: 201,
    description: HTTP_STATUS_MESSAGES[201],
    type: ApiResponseDto<RegisterDataResponseDto>,
  })
  @NestSwaggerApiResponse({
    status: 400,
    description: HTTP_STATUS_MESSAGES[400],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 401,
    description: HTTP_STATUS_MESSAGES[401],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 404,
    description: HTTP_STATUS_MESSAGES[404],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 409,
    description: HTTP_STATUS_MESSAGES[409],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 500,
    description: HTTP_STATUS_MESSAGES[500],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  // @Body() 데코레이터가 JSON(HTTP 요청의 본문(body)에서 데이터)을 객체로 변환
  async register(@Body() registerDto: RegisterRequestDto): Promise<RegisterDataResponseDto> {
    // AuthService의 register 메서드를 호출하여 회원가입 처리
    // Success Response Interceptor가 자동으로 ApiResponseDto로 래핑
    return this.authService.register(registerDto);
  }

  /**
   * 휴대폰 인증번호 발송 API
   * 사용자의 휴대폰 번호로 인증번호를 발송합니다.
   */
  @Post("send-verification-code")
  @Public() // 인증을 건너뛰는 엔드포인트 (휴대폰 인증번호 발송은 인증이 필요 없음)
  @HttpCode(HttpStatus.OK) // HTTP 200 상태 코드 반환
  @ApiOperation({ summary: "휴대폰 인증번호 발송" })
  @NestSwaggerApiResponse({
    status: 200,
    description: HTTP_STATUS_MESSAGES[200],
    type: ApiResponseDto,
  })
  @NestSwaggerApiResponse({
    status: 400,
    description: HTTP_STATUS_MESSAGES[400],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 500,
    description: HTTP_STATUS_MESSAGES[500],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  async sendVerificationCode(
    @Body() sendCodeDto: SendVerificationCodeRequestDto,
  ): Promise<ErrorMessageResponse> {
    await this.authService.sendVerificationCode(sendCodeDto);
    // Success Response Interceptor가 자동으로 ApiResponseDto로 래핑
    return { message: "인증번호가 발송되었습니다." };
  }

  /**
   * 휴대폰 인증번호 확인 API
   * 사용자가 입력한 인증번호가 올바른지 확인합니다.
   */
  @Post("verify-phone-code")
  @Public() // 인증을 건너뛰는 엔드포인트 (휴대폰 인증번호 확인은 인증이 필요 없음)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "휴대폰 인증번호 확인" })
  @NestSwaggerApiResponse({
    status: 200,
    description: HTTP_STATUS_MESSAGES[200],
    type: ApiResponseDto,
  })
  @NestSwaggerApiResponse({
    status: 400,
    description: HTTP_STATUS_MESSAGES[400],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 500,
    description: HTTP_STATUS_MESSAGES[500],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  async verifyPhoneCode(
    @Body() verifyCodeDto: VerifyPhoneCodeRequestDto,
  ): Promise<ErrorMessageResponse> {
    await this.authService.verifyPhoneCode(verifyCodeDto);
    // Success Response Interceptor가 자동으로 ApiResponseDto로 래핑
    return { message: "인증번호가 확인되었습니다." };
  }

  /**
   * 사용자 ID 중복 확인 API
   * 회원가입 시 사용할 사용자 ID가 이미 존재하는지 확인합니다.
   */
  @Get("check-user-id")
  @Public()
  @ApiOperation({ summary: "사용자 ID 중복 확인" })
  @NestSwaggerApiResponse({
    status: 200,
    description: HTTP_STATUS_MESSAGES[200],
    type: ApiResponseDto,
  })
  @NestSwaggerApiResponse({
    status: 400,
    description: HTTP_STATUS_MESSAGES[400],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 500,
    description: HTTP_STATUS_MESSAGES[500],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  async checkUserIdAvailability(
    @Query() checkUserIdDto: CheckUserIdRequestDto, // 쿼리 파라미터에서 사용자 ID 추출
  ): Promise<AvailabilityResponse> {
    // Success Response Interceptor가 자동으로 ApiResponseDto로 래핑
    return this.authService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 휴대폰 번호 중복 확인 API
   * 회원가입 시 사용할 휴대폰 번호가 이미 등록되어 있는지 확인합니다.
   */
  @Get("check-phone")
  @Public() // 인증을 건너뛰는 엔드포인트 (휴대폰 번호 중복 확인은 인증이 필요 없음)
  @ApiOperation({ summary: "휴대폰 번호 중복 확인" })
  @NestSwaggerApiResponse({
    status: 200,
    description: HTTP_STATUS_MESSAGES[200],
    type: ApiResponseDto,
  })
  @NestSwaggerApiResponse({
    status: 400,
    description: HTTP_STATUS_MESSAGES[400],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  @NestSwaggerApiResponse({
    status: 500,
    description: HTTP_STATUS_MESSAGES[500],
    type: ApiResponseDto<ErrorMessageResponse>,
  })
  async checkPhoneAvailability(
    @Query() checkPhoneDto: CheckPhoneRequestDto, // 쿼리 파라미터에서 휴대폰 번호 추출
  ): Promise<AvailabilityResponse> {
    // Success Response Interceptor가 자동으로 ApiResponseDto로 래핑
    return this.authService.checkPhoneAvailability(checkPhoneDto);
  }
}
