import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "@web-user/backend/modules/auth/auth.service";
import {
  RegisterRequestDto,
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
  CheckUserIdRequestDto,
  LoginRequestDto,
  FindAccountRequestDto,
  ChangePasswordRequestDto,
  ChangePhoneRequestDto,
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
  RefreshTokenRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import { JwtAuthGuard } from "@web-user/backend/modules/auth/guards/jwt-auth.guard";
import { Public } from "@web-user/backend/common/decorators/public.decorator";
import { SwaggerResponse } from "@web-user/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@web-user/backend/common/types/auth.types";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
  SWAGGER_EXAMPLES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@web-user/backend/modules/auth/constants/auth.constants";
import { createMessageObject } from "@web-user/backend/common/utils/message.util";

/**
 * 인증 컨트롤러
 * 사용자 인증 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags("인증")
@Controller("auth")
// 기본적으로 모든 엔드포인트에 JWT 인증 가드 적용 // @Public() 데코레이터가 있는 엔드포인트는 인증을 건너뜀
// 요청 → JwtAuthGuard → Passport → JwtStrategy → validate() → req.user
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 일반 - 회원가입 API
   * 새로운 사용자를 등록하고 JWT 토큰을 발급합니다.
   */
  @Post("register")
  @Public() // 인증을 건너뛰는 엔드포인트 (회원가입은 인증이 필요 없음)
  @HttpCode(HttpStatus.CREATED) // HTTP 201 상태 코드 반환
  @ApiOperation({
    summary: "일반 - 회원가입",
    description:
      "새로운 사용자를 등록하고 JWT 토큰을 발급합니다. 휴대폰 인증이 완료된 상태여야 합니다. 사용자 ID는 중복될 수 없으며, 휴대폰번호가 일반 계정에서 사용중이면 에러가 발생하고, 구글 계정에서만 사용중이면 기존 계정을 업데이트하고 바로 로그인 처리됩니다.",
  })
  @SwaggerResponse(201, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.USER_ID_ALREADY_EXISTS))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_MULTIPLE_ACCOUNTS))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_GENERAL_ACCOUNT_EXISTS))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED)) // 전역 Rate Limiting Guard 적용
  async register(@Body() registerDto: RegisterRequestDto) {
    // Success Response Interceptor가 자동으로 래핑
    return this.authService.register(registerDto);
  }

  /**
   * 일반 - ID 중복 확인 API
   * 회원가입 시 사용할 사용자 ID가 이미 존재하는지 확인합니다.
   */
  @Get("check-user-id")
  @Public()
  @ApiOperation({
    summary: "일반 - ID 중복 확인",
    description: "회원가입 시 사용할 사용자 ID가 이미 존재하는지 확인합니다.",
  })
  @SwaggerResponse(200, {
    available: true,
  })
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async checkUserIdAvailability(
    @Query() checkUserIdDto: CheckUserIdRequestDto, // 쿼리 파라미터에서 사용자 ID 추출
  ) {
    return this.authService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 일반 - 로그인 API
   * 아이디와 비밀번호로 로그인합니다.
   */
  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "일반 - 로그인",
    description: "아이디와 비밀번호로 로그인하고 JWT 토큰을 발급합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async login(@Body() loginDto: LoginRequestDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 일반 - 비밀번호 변경 API
   * 아이디와 휴대폰 인증을 통해 비밀번호를 변경합니다.
   */
  @Post("change-password")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "일반 - 비밀번호 변경",
    description: "아이디와 휴대폰 인증을 통해 비밀번호를 변경합니다.",
  })
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.PASSWORD_CHANGED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.ID_PHONE_MISMATCH))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async changePassword(@Body() changePasswordDto: ChangePasswordRequestDto) {
    await this.authService.changePassword(changePasswordDto);
    return createMessageObject(AUTH_SUCCESS_MESSAGES.PASSWORD_CHANGED);
  }

  /**
   * 계정 찾기 API
   * 휴대폰 인증을 통해 계정 정보를 찾습니다.
   * 일반 로그인 계정인 경우 userId를, 구글 로그인 계정인 경우 googleEmail을 반환합니다.
   * 둘 다 있는 경우 모두 반환합니다.
   */
  @Get("find-account")
  @Public()
  @ApiOperation({
    summary: "계정 찾기",
    description:
      "휴대폰 인증을 통해 계정 정보를 찾습니다. 일반 로그인 계정인 경우 userId를, 구글 로그인 계정인 경우 googleEmail을 반환합니다. 둘 다 있는 경우 모두 반환합니다.",
  })
  @SwaggerResponse(200, {
    userId: SWAGGER_EXAMPLES.USER_DATA.userId, // 일반 로그인인 경우 (선택적)
    googleEmail: SWAGGER_EXAMPLES.USER_DATA.googleEmail, // 구글 로그인인 경우 (선택적)
  })
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND_BY_PHONE))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async findAccount(@Query() findAccountDto: FindAccountRequestDto) {
    return this.authService.findAccount(findAccountDto);
  }

  /**
   * 구글 로그인 API
   * 프론트엔드에서 받은 Authorization Code로 구글 로그인을 처리합니다.
   */
  @Post("google/login")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "구글 로그인",
    description: "프론트엔드에서 받은 Authorization Code로 구글 로그인을 처리합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(400, {
    message: AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED,
    googleId: SWAGGER_EXAMPLES.USER_DATA.googleId,
    googleEmail: SWAGGER_EXAMPLES.USER_DATA.googleEmail,
  })
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.GOOGLE_OAUTH_TOKEN_EXCHANGE_FAILED))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async googleAuth(@Body() authDto: GoogleLoginRequestDto) {
    return await this.authService.googleLoginWithCode(authDto);
  }

  /**
   * 구글 로그인 회원가입 API
   * 휴대폰 인증 완료 후 구글 로그인 회원가입을 처리합니다.
   */
  @Post("google/register")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "구글 로그인 회원가입",
    description:
      "새로운 구글 사용자를 등록하고 JWT 토큰을 발급합니다. 휴대폰 인증이 완료된 상태여야 합니다. 구글 ID는 중복될 수 없으며, 휴대폰번호가 구글 계정에서 사용중이면 에러가 발생하고, 일반 계정에서만 사용중이면 기존 계정을 업데이트하고 바로 로그인 처리됩니다.",
  })
  @SwaggerResponse(201, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.GOOGLE_REGISTER_FAILED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_MULTIPLE_ACCOUNTS))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_GOOGLE_ACCOUNT_EXISTS))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.GOOGLE_ID_ALREADY_EXISTS))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async googleRegisterWithPhone(@Body() registerDto: GoogleRegisterRequestDto) {
    return await this.authService.googleRegisterWithPhone(registerDto);
  }

  /**
   * 휴대폰 인증번호 발송 API
   * 사용자의 휴대폰 번호로 인증번호를 발송합니다.
   */
  @Post("send-verification-code")
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 1분당 10회로 제한 (전역에서는 1분당 100회로 제한 설정되어 있음)
  @ApiOperation({
    summary: "휴대폰 인증번호 발송",
    description: "사용자의 휴대폰 번호로 인증번호를 발송합니다. 1분당 10회로 제한됩니다.",
  })
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_VERIFICATION_SENT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async sendVerificationCode(@Body() sendCodeDto: SendVerificationCodeRequestDto) {
    await this.authService.sendVerificationCode(sendCodeDto);
    return createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_VERIFICATION_SENT);
  }

  /**
   * 휴대폰 인증번호 확인 API
   * 사용자가 입력한 인증번호가 올바른지 확인합니다.
   */
  @Post("verify-phone-code")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "휴대폰 인증번호 확인",
    description: "사용자가 입력한 인증번호가 올바른지 확인합니다.",
  })
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_VERIFICATION_CONFIRMED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_FAILED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_EXPIRED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.VERIFICATION_CODE_INVALID_FORMAT))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async verifyPhoneCode(@Body() verifyCodeDto: VerifyPhoneCodeRequestDto) {
    await this.authService.verifyPhoneCode(verifyCodeDto);
    return createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_VERIFICATION_CONFIRMED);
  }

  /**
   * 휴대폰 번호 변경 API
   * 인증된 사용자의 휴대폰 번호를 새로운 번호로 변경합니다.
   * 새 휴대폰 번호는 미리 인증이 완료되어야 합니다.
   */
  @Post("change-phone")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "휴대폰 번호 변경 (인증 필요)",
    description:
      "인증된 사용자의 휴대폰 번호를 새로운 번호로 변경합니다. 새 휴대폰 번호는 미리 인증이 완료되어야 합니다.",
  })
  @ApiBearerAuth("JWT-auth") // 스웨거에서 인증 헤더 표시
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_CHANGED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.USER_NOT_FOUND))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async changePhone(
    @Body() changePhoneDto: ChangePhoneRequestDto,
    @Request() req: { user: JwtVerifiedPayload }, // JWT에서 저장된 사용자 정보
  ) {
    await this.authService.changePhone(changePhoneDto, req.user);
    return createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_CHANGED);
  }

  /**
   * Refresh Token을 사용하여 Access Token을 갱신하는 API
   */
  @Post("refresh")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Access Token 갱신",
    description: "Refresh Token을 사용하여 Access Token을 갱신합니다.",
  })
  @SwaggerResponse(200, {
    accessToken: SWAGGER_EXAMPLES.ACCESS_TOKEN,
  })
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async refreshToken(@Body() refreshTokenDto: RefreshTokenRequestDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * 로그아웃 API는 클라이언트에서 토큰을 삭제하여 처리합니다.
   * stateless JWT 방식으로 변경하여 JWT 토큰은 서버에 저장하지 않고 클라이언트에서만 관리
   * 따라서, 로그아웃 API는 불필요합니다.
   */
}
