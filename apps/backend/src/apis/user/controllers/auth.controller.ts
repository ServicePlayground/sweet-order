import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Request,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "@apps/backend/modules/auth/auth.service";
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
} from "@apps/backend/modules/auth/dto/auth-request.dto";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
  SWAGGER_EXAMPLES,
  SWAGGER_RESPONSE_EXAMPLES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";

/**
 * 인증 컨트롤러
 * 사용자 인증 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags("[사용자, 판매자, 관리자] 서브 도메인 쿠키 기반 통합 인증")
@Controller(`${USER_ROLES.USER}/auth`)
@Auth({ isPublic: true }) // 인증을 건너뛰는 엔드포인트 // 기본적으로 모든 엔드포인트에 통합 인증 가드 적용
export class UserAuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 일반 - 회원가입 API
   * 새로운 사용자를 등록하고 JWT 토큰을 발급합니다.
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED) // HTTP 201 상태 코드 반환
  @ApiOperation({
    summary: "일반 - 회원가입",
    description:
      "새로운 사용자를 등록합니다. 서브도메인 통합 로그인을 위해 쿠키에 토큰을 설정하고, 응답에서는 사용자 정보만 반환합니다. 휴대폰 인증이 완료된 상태여야 하며, 사용자 ID는 중복될 수 없으며, 휴대폰번호가 일반 계정에서 사용중이면 에러가 발생하고, 구글 계정에서만 사용중이면 기존 계정을 업데이트하고 바로 로그인 처리됩니다.",
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
  // { passthrough: true }: 쿠키 설정과 NestJS의 자동 응답 래핑을 유지하기 위해 사용
  async register(
    @Body() registerDto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(registerDto, res);
  }

  /**
   * 일반 - ID 중복 확인 API
   * 회원가입 시 사용할 사용자 ID가 이미 존재하는지 확인합니다.
   */
  @Get("check-user-id")
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
    return await this.authService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 일반 - 로그인 API
   * 아이디와 비밀번호로 로그인합니다.
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "일반 - 로그인",
    description:
      "아이디와 비밀번호로 로그인합니다. 서브도메인 통합 로그인을 위해 쿠키에 토큰을 설정하고, 응답에서는 사용자 정보만 반환합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PASSWORD_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async login(@Body() loginDto: LoginRequestDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(loginDto, res);
  }

  /**
   * 일반 - 비밀번호 변경 API
   * 아이디와 휴대폰 인증을 통해 비밀번호를 변경합니다.
   */
  @Post("change-password")
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
    return await this.authService.findAccount(findAccountDto);
  }

  /**
   * 구글 로그인 API
   * 프론트엔드에서 받은 Authorization Code로 구글 로그인을 처리합니다.
   */
  @Post("google/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "구글 로그인",
    description:
      "프론트엔드에서 받은 Authorization Code로 구글 로그인을 처리합니다. 서브도메인 통합 로그인을 위해 쿠키에 토큰을 설정하고, 응답에서는 사용자 정보만 반환합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(400, {
    message: AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED,
    googleId: SWAGGER_EXAMPLES.USER_DATA.googleId,
    googleEmail: SWAGGER_EXAMPLES.USER_DATA.googleEmail,
  })
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.GOOGLE_OAUTH_TOKEN_EXCHANGE_FAILED))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async googleAuth(
    @Body() authDto: GoogleLoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.googleLoginWithCode(authDto, res);
  }

  /**
   * 구글 로그인 회원가입 API
   * 휴대폰 인증 완료 후 구글 로그인 회원가입을 처리합니다.
   */
  @Post("google/register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "구글 로그인 회원가입",
    description:
      "새로운 구글 사용자를 등록합니다. 서브도메인 통합 로그인을 위해 쿠키에 토큰을 설정하고, 응답에서는 사용자 정보만 반환합니다. 휴대폰 인증이 완료된 상태여야 합니다. 구글 ID는 중복될 수 없으며, 휴대폰번호가 구글 계정에서 사용중이면 에러가 발생하고, 일반 계정에서만 사용중이면 기존 계정을 업데이트하고 바로 로그인 처리됩니다.",
  })
  @SwaggerResponse(201, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.GOOGLE_REGISTER_FAILED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_MULTIPLE_ACCOUNTS))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_GOOGLE_ACCOUNT_EXISTS))
  @SwaggerResponse(409, createMessageObject(AUTH_ERROR_MESSAGES.GOOGLE_ID_ALREADY_EXISTS))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async googleRegisterWithPhone(
    @Body() registerDto: GoogleRegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.googleRegisterWithPhone(registerDto, res);
  }

  /**
   * 휴대폰 인증번호 발송 API
   * 사용자의 휴대폰 번호로 인증번호를 발송합니다.
   */
  @Post("send-verification-code")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 1분당 10회로 제한 (전역에서는 1분당 100회로 제한 설정되어 있음)
  @ApiOperation({
    summary: "휴대폰 인증번호 발송",
    description: "사용자의 휴대폰 번호로 인증번호를 발송합니다. 1분당 10회로 제한됩니다.",
  })
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_VERIFICATION_SENT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_CODE_GENERATION_FAILED))
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
  @Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 휴대폰 번호 변경",
    description:
      "인증된 사용자의 휴대폰 번호를 새로운 번호로 변경합니다. 새 휴대폰 번호는 미리 인증이 완료되어야 합니다.",
  })
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.PHONE_CHANGED))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_INVALID_FORMAT))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.USER_NOT_FOUND))
  @SwaggerResponse(400, createMessageObject(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(
    401,
    createMessageObject(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_MISSING_REQUIRED_INFO),
  )
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED))
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) Access Token 갱신",
    description:
      "쿠키의 Refresh Token을 사용하여 새로운 Access Token을 생성하고 쿠키에 설정합니다. 응답에서는 성공 메시지만 반환합니다.",
  })
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.ACCESS_TOKEN_REFRESHED))
  @SwaggerResponse(403, createMessageObject(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED))
  @SwaggerResponse(403, createMessageObject(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_INVALID))
  @SwaggerResponse(403, createMessageObject(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_MISSING))
  @SwaggerResponse(403, createMessageObject(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_WRONG_TYPE))
  @SwaggerResponse(
    403,
    createMessageObject(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_MISSING_REQUIRED_INFO),
  )
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async refreshToken(@Res({ passthrough: true }) res: Response) {
    await this.authService.refreshToken(res);
    return createMessageObject(AUTH_SUCCESS_MESSAGES.ACCESS_TOKEN_REFRESHED);
  }

  /**
   * 현재 로그인한 사용자 정보를 조회하는 API
   */
  @Get("me")
  @Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 사용자 정보 조회",
    description:
      "쿠키의 Access Token을 사용하여 현재 로그인한 사용자의 정보를 조회합니다. 프론트엔드 새로고침 시 사용자 정보 복원에 사용됩니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.USER_DATA_RESPONSE)
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.UNAUTHORIZED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING))
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE))
  @SwaggerResponse(
    401,
    createMessageObject(AUTH_ERROR_MESSAGES.REFRESH_TOKEN_MISSING_REQUIRED_INFO),
  )
  @SwaggerResponse(401, createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async getCurrentUser(@Request() req: { user: JwtVerifiedPayload }) {
    return await this.authService.getCurrentUser(req.user);
  }

  /**
   * 로그아웃 API
   * 쿠키 기반 인증에서는 서버에서 쿠키를 삭제해야 로그아웃이 완료됩니다.
   * 프론트엔드에서는 HttpOnly 옵션으로 쿠키를 삭제할 수 없기 때문에 서버에서 쿠키를 삭제해야 합니다.
   * 인증이 필요하지 않습니다. 쿠키에 토큰이 있든 없든 상관없이 쿠키를 제거하는 것이 목적입니다.
   */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "로그아웃",
    description: "쿠키의 Access Token과 Refresh Token을 삭제하여 로그아웃을 처리합니다. 인증이 필요하지 않습니다.",
  })
  @SwaggerResponse(200, createMessageObject(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS))
  @SwaggerResponse(429, createMessageObject(AUTH_ERROR_MESSAGES.THROTTLE_LIMIT_EXCEEDED))
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
    return createMessageObject(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  }
}
