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
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "@web-user/backend/modules/auth/auth.service";
import {
  RegisterRequestDto,
  SendVerificationCodeRequestDto,
  VerifyPhoneCodeRequestDto,
  CheckUserIdRequestDto,
  LoginRequestDto,
  FindUserIdRequestDto,
  ChangePasswordRequestDto,
  ChangePhoneRequestDto,
  GoogleLoginRequestDto,
  GoogleRegisterRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import {
  FindUserIdDataResponseDto,
  UserDataResponseDto,
} from "@web-user/backend/modules/auth/dto/auth-data-response.dto";
import { JwtAuthGuard } from "@web-user/backend/common/guards/jwt-auth.guard";
import { Public } from "@web-user/backend/common/decorators/public.decorator";
import { ApiSuccessResponse } from "@web-user/backend/common/decorators/swagger-success-response.decorator";
import { ApiErrorResponse } from "@web-user/backend/common/decorators/swagger-error-response.decorator";
import {
  AvailabilityResponseDto,
  SuccessMessageResponseDto,
} from "@web-user/backend/common/dto/common.dto";

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
   * 일반 - 회원가입 API
   * 새로운 사용자를 등록하고 JWT 토큰을 발급합니다.
   */
  @Post("register")
  @Public() // 인증을 건너뛰는 엔드포인트 (회원가입은 인증이 필요 없음)
  @HttpCode(HttpStatus.CREATED) // HTTP 201 상태 코드 반환
  @ApiOperation({ summary: "일반 - 회원가입" })
  @ApiSuccessResponse<UserDataResponseDto>(201, {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "user123",
      phone: "01012345678",
      name: "test",
      nickname: "test",
      email: "test@example.com",
      profileImageUrl: "https://test.com/test.jpg",
      isPhoneVerified: true,
      isActive: true,
      userId: "testuser",
      googleId: "",
      createdAt: new Date(),
      lastLoginAt: new Date(),
    },
  })
  @ApiErrorResponse(400, "아이디는 4-20자의 영문, 숫자, 언더스코어만 사용할 수 있습니다.")
  @ApiErrorResponse(409, "이미 사용 중인 휴대폰 번호입니다.")
  // @Body() 데코레이터가 JSON(HTTP 요청의 본문(body)에서 데이터)을 객체로 변환
  async register(@Body() registerDto: RegisterRequestDto): Promise<UserDataResponseDto> {
    // Success Response Interceptor가 자동으로 ApiResponseDto로 래핑
    return this.authService.register(registerDto);
  }

  /**
   * 일반 - ID 중복 확인 API
   * 회원가입 시 사용할 사용자 ID가 이미 존재하는지 확인합니다.
   */
  @Get("check-user-id")
  @Public()
  @ApiOperation({ summary: "일반 - ID 중복 확인" })
  @ApiSuccessResponse<AvailabilityResponseDto>(200, {
    available: true,
  })
  async checkUserIdAvailability(
    @Query() checkUserIdDto: CheckUserIdRequestDto, // 쿼리 파라미터에서 사용자 ID 추출
  ): Promise<AvailabilityResponseDto> {
    // Success Response Interceptor가 자동으로 ApiResponseDto로 래핑
    return this.authService.checkUserIdAvailability(checkUserIdDto);
  }

  /**
   * 일반 - 로그인 API
   * 아이디와 비밀번호로 로그인합니다.
   */
  @Post("login")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "일반 - 로그인" })
  @ApiSuccessResponse<UserDataResponseDto>(200, {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "user123",
      phone: "01012345678",
      name: "test",
      nickname: "test",
      email: "test@example.com",
      profileImageUrl: "https://test.com/test.jpg",
      isPhoneVerified: true,
      isActive: true,
      userId: "testuser",
      googleId: "",
      createdAt: new Date(),
      lastLoginAt: new Date(),
    },
  })
  @ApiErrorResponse(401, "아이디 또는 비밀번호가 올바르지 않습니다.")
  async login(@Body() loginDto: LoginRequestDto): Promise<UserDataResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * 일반 - ID 찾기 API
   * 휴대폰 인증을 통해 사용자 ID를 찾습니다.
   */
  @Post("find-user-id")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "일반 - ID 찾기" })
  @ApiSuccessResponse<FindUserIdDataResponseDto>(200, {
    userId: "user123",
  })
  @ApiErrorResponse(400, "해당 휴대폰 번호로 등록된 계정이 없습니다.")
  async findUserId(
    @Body() findUserIdDto: FindUserIdRequestDto,
  ): Promise<FindUserIdDataResponseDto> {
    return this.authService.findUserId(findUserIdDto);
  }

  /**
   * 일반 - 비밀번호 변경 API
   * 아이디와 휴대폰 인증을 통해 비밀번호를 변경합니다.
   */
  @Post("change-password")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "일반 - 비밀번호 변경" })
  @ApiSuccessResponse<SuccessMessageResponseDto>(200, {
    message: "비밀번호가 성공적으로 변경되었습니다.",
  })
  @ApiErrorResponse(400, "해당 아이디로 등록된 계정이 없습니다.")
  async changePassword(
    @Body() changePasswordDto: ChangePasswordRequestDto,
  ): Promise<SuccessMessageResponseDto> {
    await this.authService.changePassword(changePasswordDto);
    return { message: "비밀번호가 성공적으로 변경되었습니다." };
  }

  /**
   * 구글 로그인 API
   * 프론트엔드에서 받은 Authorization Code로 구글 로그인을 처리합니다.
   */
  @Post("google/login")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "구글 로그인" })
  @ApiSuccessResponse<UserDataResponseDto>(200, {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "user123",
      phone: "01012345678",
      name: "홍길동",
      nickname: "홍길동",
      email: "user@example.com",
      profileImageUrl: "https://lh3.googleusercontent.com/a/...",
      isPhoneVerified: true,
      isActive: true,
      userId: "testuser",
      googleId: "google123",
      createdAt: new Date(),
      lastLoginAt: new Date(),
    },
  })
  @ApiErrorResponse(400, "구글 로그인에 실패했습니다.")
  @ApiErrorResponse(409, {
    message: "휴대폰 인증이 필요합니다. 휴대폰 번호를 등록하고 인증을 완료해주세요.",
    googleId: "google123",
  })
  async googleAuth(@Body() authDto: GoogleLoginRequestDto): Promise<UserDataResponseDto> {
    return await this.authService.googleLoginWithCode(authDto);
  }

  /**
   * 구글 로그인 회원가입 API
   * 휴대폰 인증 완료 후 구글 로그인 회원가입을 처리합니다.
   */
  @Post("google/register")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "구글 로그인 회원가입" })
  @ApiSuccessResponse<UserDataResponseDto>(201, {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "user123",
      phone: "01012345678",
      name: "홍길동",
      nickname: "홍길동",
      email: "user@example.com",
      profileImageUrl: "https://lh3.googleusercontent.com/a/...",
      isPhoneVerified: true,
      isActive: true,
      userId: "testuser",
      googleId: "google123",
      createdAt: new Date(),
      lastLoginAt: new Date(),
    },
  })
  @ApiErrorResponse(400, "구글 로그인 회원가입에 실패했습니다")
  async googleRegisterWithPhone(
    @Body() registerDto: GoogleRegisterRequestDto,
  ): Promise<UserDataResponseDto> {
    return await this.authService.googleRegisterWithPhone(registerDto);
  }

  /**
   * 휴대폰 인증번호 발송 API
   * 사용자의 휴대폰 번호로 인증번호를 발송합니다.
   */
  @Post("send-verification-code")
  @Public() // 인증을 건너뛰는 엔드포인트 (휴대폰 인증번호 발송은 인증이 필요 없음)
  @HttpCode(HttpStatus.OK) // HTTP 200 상태 코드 반환
  @ApiOperation({ summary: "휴대폰 인증번호 발송" })
  @ApiSuccessResponse<SuccessMessageResponseDto>(200, {
    message: "인증번호가 발송되었습니다.",
  })
  @ApiErrorResponse(400, "24시간 내 최대 발송 횟수(10회)를 초과했습니다.")
  async sendVerificationCode(
    @Body() sendCodeDto: SendVerificationCodeRequestDto,
  ): Promise<SuccessMessageResponseDto> {
    await this.authService.sendVerificationCode(sendCodeDto);
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
  @ApiSuccessResponse<SuccessMessageResponseDto>(200, {
    message: "인증번호가 확인되었습니다.",
  })
  @ApiErrorResponse(400, "인증번호가 올바르지 않습니다.")
  async verifyPhoneCode(
    @Body() verifyCodeDto: VerifyPhoneCodeRequestDto,
  ): Promise<SuccessMessageResponseDto> {
    await this.authService.verifyPhoneCode(verifyCodeDto);
    return { message: "인증번호가 확인되었습니다." };
  }

  /**
   * 휴대폰 번호 변경 API
   * 기존 휴대폰 번호를 새로운 번호로 변경합니다.
   * 새 휴대폰 번호는 미리 인증이 완료되어야 합니다.
   */
  @Post("change-phone")
  @Public() // 추후 인증 필요할 수 있음
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "휴대폰 번호 변경" })
  @ApiSuccessResponse<SuccessMessageResponseDto>(200, {
    message: "휴대폰 번호가 변경되었습니다.",
  })
  @ApiErrorResponse(400, "기존 휴대폰 번호로 등록된 사용자를 찾을 수 없습니다.")
  @ApiErrorResponse(409, "이미 사용 중인 휴대폰 번호입니다.")
  async changePhone(
    @Body() changePhoneDto: ChangePhoneRequestDto,
  ): Promise<SuccessMessageResponseDto> {
    await this.authService.changePhone(changePhoneDto);
    return { message: "휴대폰 번호가 변경되었습니다." };
  }
}
