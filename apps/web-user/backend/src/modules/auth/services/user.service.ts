import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@web-user/backend/database/prisma.service";
import { PasswordUtil } from "@web-user/backend/modules/auth/utils/password.util";
import { PhoneUtil } from "@web-user/backend/modules/auth/utils/phone.util";
import { JwtUtil } from "@web-user/backend/modules/auth/utils/jwt.util";
import { JwtVerifiedPayload } from "@web-user/backend/common/types/auth.types";
import {
  RegisterRequestDto,
  CheckUserIdRequestDto,
  LoginRequestDto,
  FindAccountRequestDto,
  ChangePasswordRequestDto,
  ChangePhoneRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import { AUTH_ERROR_MESSAGES } from "@web-user/backend/modules/auth/constants/auth.constants";
import { UserMapperUtil } from "@web-user/backend/modules/auth/utils/user-mapper.util";

/**
 * 사용자 관리 서비스
 *
 * 요구사항에 따른 사용자 관리 관련 비즈니스 로직을 처리합니다.
 *
 * 주요 기능:
 * - 사용자 정보 중복 확인
 * - 사용자 생성
 * - 사용자 조회
 * - 사용자 업데이트
 * - 사용자 삭제
 * - 비밀번호 변경/재설정
 */
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtUtil: JwtUtil,
  ) {}

  /**
   * 일반 회원가입
   */
  async register(registerDto: RegisterRequestDto) {
    const { userId, password, phone } = registerDto;

    // 1. 사용자 ID와 휴대폰 번호 중복 검증
    await this.checkUserDuplication({
      userId,
      phone,
    });

    // 2. 휴대폰 번호 정규화
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 3. 휴대폰 인증 상태 확인
    const isPhoneVerified = await this.checkPhoneVerificationStatus(normalizedPhone);
    if (!isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED); // 400
    }

    // 4. 비밀번호 해싱
    const passwordHash = await PasswordUtil.hashPassword(password);

    // 5. 트랜잭션으로 사용자 생성 및 JWT 토큰 생성
    return await this.prisma.$transaction(async (tx) => {
      // 사용자 생성
      const user = await tx.user.create({
        data: {
          userId,
          passwordHash,
          phone: normalizedPhone,
          isPhoneVerified: true,
          lastLoginAt: new Date(),
        },
      });

      // JWT 토큰 생성
      const tokenPair = await this.jwtUtil.generateTokenPair({
        sub: user.id,
        phone: user.phone,
        loginType: "general",
        loginId: user.userId ?? "",
      });

      // 응답 data 반환
      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        user: UserMapperUtil.mapToUserInfo(user),
      };
    });
  }

  /**
   * 일반 회원가입 - 사용자 ID 중복 확인
   *
   * @param checkUserIdDto 사용자 ID 확인 요청
   * @returns 사용 가능 여부
   */
  async checkUserIdAvailability(checkUserIdDto: CheckUserIdRequestDto) {
    const { userId } = checkUserIdDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { userId },
    });

    return { available: !existingUser };
  }

  /**
   * 일반 회원가입 - 사용자 정보 중복 검사
   */
  async checkUserDuplication({ userId, phone }: { userId: string; phone: string }): Promise<void> {
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 데이터베이스에서 사용자 ID 또는 휴대폰 번호가 일치하는 사용자 검색
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ userId }, { phone: normalizedPhone }],
      },
    });

    if (existingUser) {
      if (existingUser.userId === userId) {
        throw new ConflictException(AUTH_ERROR_MESSAGES.USER_ID_ALREADY_EXISTS); // GlobalExceptionFilter에서 처리
      }
      if (existingUser.phone === normalizedPhone) {
        // 휴대폰 번호가 중복되는 경우, 기존 계정의 타입을 확인하여 적절한 메시지 제공
        if (existingUser.userId && existingUser.googleId) {
          // 일반 로그인과 구글 로그인 모두 가능한 계정
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_MULTIPLE_ACCOUNTS);
        } else if (existingUser.userId) {
          // 일반 로그인 계정만 존재
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_GENERAL_ACCOUNT_EXISTS);
        } else if (existingUser.googleId) {
          // 구글 로그인 계정만 존재
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_GOOGLE_ACCOUNT_EXISTS);
        } else {
          // 기본 메시지
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS);
        }
      }
    }
  }

  /**
   * 일반 회원가입 - 일반 로그인
   */
  async login(loginDto: LoginRequestDto) {
    const { userId, password } = loginDto;

    // 1. 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND); // 400
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await PasswordUtil.verifyPassword(password, user.passwordHash || "");
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // 3. 휴대폰 인증 상태 확인
    if (!user.isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    // 4. 트랜잭션으로 JWT 토큰 생성 및 마지막 로그인 시간 업데이트
    return await this.prisma.$transaction(async (tx) => {
      // JWT 토큰 생성
      const tokenPair = await this.jwtUtil.generateTokenPair({
        sub: user.id,
        phone: user.phone,
        loginType: "general",
        loginId: user.userId ?? "",
      });

      // 마지막 로그인 시간 업데이트
      await tx.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      return {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        user: UserMapperUtil.mapToUserInfo(user, new Date()),
      };
    });
  }

  /**
   * 계정 찾기
   * 휴대폰 인증을 통해 계정 정보를 찾습니다.
   * 일반 로그인 계정인 경우 userId를, 구글 로그인 계정인 경우 googleEmail을 반환합니다.
   * 둘 다 있는 경우 모두 반환합니다.
   */
  async findAccount(findAccountDto: FindAccountRequestDto) {
    const { phone } = findAccountDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 1. 휴대폰 인증 확인
    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        isVerified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!phoneVerification) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    // 2. 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND_BY_PHONE);
    }

    // 3. 계정 정보 반환
    const result: { userId?: string; googleEmail?: string } = {};

    if (user.userId) {
      result.userId = user.userId;
    }

    if (user.googleEmail) {
      result.googleEmail = user.googleEmail;
    }

    // 둘 다 없는 경우 (예외 상황)
    if (!result.userId && !result.googleEmail) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND_BY_PHONE);
    }

    return result;
  }

  /**
   * 일반 회원가입 - 비밀번호 변경
   */
  async changePassword(changePasswordDto: ChangePasswordRequestDto): Promise<void> {
    const { userId, phone, newPassword } = changePasswordDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 1. 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    // 2. 휴대폰 번호 일치 확인
    if (user.phone !== normalizedPhone) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.ID_PHONE_MISMATCH);
    }

    // 3. 휴대폰 인증 확인
    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        isVerified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!phoneVerification) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    // 4. 트랜잭션으로 새 비밀번호 해시화 및 업데이트
    await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await PasswordUtil.hashPassword(newPassword);

      await tx.user.update({
        where: { userId },
        data: { passwordHash: hashedPassword },
      });
    });
  }

  /**
   * 휴대폰 번호 변경
   */
  async changePhone(
    changePhoneDto: ChangePhoneRequestDto,
    user: JwtVerifiedPayload,
  ): Promise<void> {
    const { newPhone } = changePhoneDto;
    const normalizedNewPhone = PhoneUtil.normalizePhone(newPhone);

    // 1. JWT에서 추출한 사용자 ID로 사용자 조회
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!currentUser) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // 2. 새 휴대폰 번호 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: normalizedNewPhone },
    });

    if (existingUser) {
      throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS);
    }

    // 3. 새 휴대폰 인증 확인 (인증 완료된 상태인지 확인)
    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedNewPhone,
        isVerified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!phoneVerification) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    // 4. 트랜잭션으로 휴대폰 번호 변경
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: currentUser.id },
        data: { phone: normalizedNewPhone },
      });
    });
  }

  /**
   * 휴대폰 인증 상태 확인
   */
  async checkPhoneVerificationStatus(phone: string): Promise<boolean> {
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    const phoneVerification = await this.prisma.phoneVerification.findFirst({
      where: {
        phone: normalizedPhone,
        isVerified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return !!phoneVerification;
  }
}
