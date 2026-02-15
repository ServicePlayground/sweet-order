import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { PasswordUtil } from "@apps/backend/modules/auth/utils/password.util";
import { PhoneUtil } from "@apps/backend/modules/auth/utils/phone.util";
import { JwtUtil } from "@apps/backend/modules/auth/utils/jwt.util";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  RegisterRequestDto,
  CheckUserIdRequestDto,
  LoginRequestDto,
  FindAccountRequestDto,
  ChangePasswordRequestDto,
  ChangePhoneRequestDto,
} from "@apps/backend/modules/auth/dto/auth-request.dto";
import {
  AUTH_ERROR_MESSAGES,
  PhoneVerificationPurpose,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { UserMapperUtil } from "@apps/backend/modules/auth/utils/user-mapper.util";
import { PhoneService } from "@apps/backend/modules/auth/services/phone.service";

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
    private readonly phoneService: PhoneService,
  ) {}

  /**
   * 일반 회원가입
   */
  async register(registerDto: RegisterRequestDto) {
    const { userId, password, phone } = registerDto;

    // 1. 사용자 ID 중복 검증 (필수)
    await this.checkUserIdDuplication(userId);

    // 2. 휴대폰 번호 정규화
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 3. 휴대폰 인증 상태 확인 (1시간 이내 인증만 유효)
    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedPhone,
      PhoneVerificationPurpose.REGISTRATION,
    );
    if (!isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED); // 400
    }

    // 4. 비밀번호 해싱
    const passwordHash = await PasswordUtil.hashPassword(password);

    // 5. 휴대폰번호 중복 확인 및 계정 타입별 처리
    const existingPhoneUser = await this.prisma.user.findFirst({
      where: { phone: normalizedPhone },
    });

    if (existingPhoneUser) {
      // 휴대폰번호가 중복되는 경우, 기존 계정의 타입을 확인
      if (existingPhoneUser.userId) {
        // 일반 계정(userId)에서 이미 사용중인 경우 -> 에러 발생
        if (existingPhoneUser.userId && existingPhoneUser.googleId) {
          // 일반 로그인과 구글 로그인 모두 가능한 계정
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_MULTIPLE_ACCOUNTS);
        } else {
          // 일반 로그인 계정만 존재
          throw new ConflictException(AUTH_ERROR_MESSAGES.PHONE_GENERAL_ACCOUNT_EXISTS);
        }
      } else if (existingPhoneUser.googleId) {
        // 구글 계정(googleId)에서만 사용중인 경우 -> 업데이트 후 로그인 처리
        return await this.prisma.$transaction(
          async (tx) => {
            const user = await tx.user.update({
              where: { id: existingPhoneUser.id },
              data: {
                userId,
                passwordHash,
                lastLoginAt: new Date(),
              },
            });

            // JWT 토큰 생성 (최소 정보만 포함: sub만)
            const tokenPair = await this.jwtUtil.generateTokenPair({
              sub: user.id,
            });

            // 응답에 토큰만 반환 (사용자 정보는 제외)
            return {
              accessToken: tokenPair.accessToken,
              refreshToken: tokenPair.refreshToken,
            };
          },
          {
            maxWait: 5000, // 최대 대기 시간 (5초)
            timeout: 10000, // 타임아웃 (10초)
          },
        );
      }
    }

    // 6. 휴대폰번호가 중복되지 않은 경우 - 새 사용자 생성
    return await this.prisma.$transaction(
      async (tx) => {
        const user = await tx.user.create({
          data: {
            userId,
            passwordHash,
            phone: normalizedPhone,
            isPhoneVerified: true,
            lastLoginAt: new Date(),
          },
        });

        // JWT 토큰 생성 (최소 정보만 포함: sub만)
        const tokenPair = await this.jwtUtil.generateTokenPair({
          sub: user.id,
        });

        // 응답에 토큰만 반환 (사용자 정보는 제외)
        return {
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
        };
      },
      {
        maxWait: 5000, // 최대 대기 시간 (5초)
        timeout: 10000, // 타임아웃 (10초)
      },
    );
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
   * 일반 회원가입 - 사용자 ID 중복 검증 (내부 메서드)
   */
  private async checkUserIdDuplication(userId: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (existingUser) {
      throw new ConflictException(AUTH_ERROR_MESSAGES.USER_ID_ALREADY_EXISTS);
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
    return await this.prisma.$transaction(
      async (tx) => {
        // JWT 토큰 생성 (최소 정보만 포함: sub만)
        const tokenPair = await this.jwtUtil.generateTokenPair({
          sub: user.id,
        });

        // 마지막 로그인 시간 업데이트
        await tx.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // 5. 응답에 토큰만 반환 (사용자 정보는 제외)
        return {
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
        };
      },
      {
        maxWait: 5000, // 최대 대기 시간 (5초)
        timeout: 10000, // 타임아웃 (10초)
      },
    );
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

    // 1. 휴대폰 인증 확인 (1시간 이내 인증만 유효)
    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedPhone,
      PhoneVerificationPurpose.ID_FIND,
    );
    if (!isPhoneVerified) {
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

    // 3. 휴대폰 인증 확인 (1시간 이내 인증만 유효)
    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedPhone,
      PhoneVerificationPurpose.PASSWORD_RECOVERY,
    );
    if (!isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    // 4. 트랜잭션으로 새 비밀번호 해시화 및 업데이트
    await this.prisma.$transaction(
      async (tx) => {
        const hashedPassword = await PasswordUtil.hashPassword(newPassword);

        await tx.user.update({
          where: { userId },
          data: { passwordHash: hashedPassword },
        });
      },
      {
        maxWait: 5000, // 최대 대기 시간 (5초)
        timeout: 10000, // 타임아웃 (10초)
      },
    );
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

    // 3. 새 휴대폰 인증 확인 (1시간 이내 인증만 유효)
    const isPhoneVerified = await this.phoneService.checkPhoneVerificationStatus(
      normalizedNewPhone,
      PhoneVerificationPurpose.PHONE_CHANGE,
    );
    if (!isPhoneVerified) {
      throw new BadRequestException(AUTH_ERROR_MESSAGES.PHONE_VERIFICATION_REQUIRED);
    }

    // 4. 트랜잭션으로 휴대폰 번호 변경
    await this.prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: { id: currentUser.id },
          data: { phone: normalizedNewPhone },
        });
      },
      {
        maxWait: 5000, // 최대 대기 시간 (5초)
        timeout: 10000, // 타임아웃 (10초)
      },
    );
  }

  /**
   * 현재 로그인한 사용자 정보 조회
   * @param user JWT에서 추출된 사용자 정보
   * @param req Express Request 객체 (토큰 추출용)
   * @returns 토큰과 사용자 정보
   */
  async getCurrentUser(user: JwtVerifiedPayload, req: ExpressRequest) {
    // 데이터베이스에서 전체 사용자 정보 조회
    const userInfo = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!userInfo) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    // Authorization 헤더에서 access token 추출
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    return {
      accessToken,
      user: UserMapperUtil.mapToUserInfo(userInfo),
    };
  }
}
