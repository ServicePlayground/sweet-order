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
import {
  RegisterRequestDto,
  CheckUserIdRequestDto,
  LoginRequestDto,
  FindUserIdRequestDto,
  ChangePasswordRequestDto,
  ChangePhoneRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import {
  UserDataResponseDto,
  FindUserIdDataResponseDto,
} from "@web-user/backend/modules/auth/dto/auth-data-response.dto";
import { UserInfo, CreateUser } from "@web-user/backend/common/types/auth.types";
import { AvailabilityResponseDto } from "@web-user/backend/common/dto/common.dto";

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
  async register(registerDto: RegisterRequestDto): Promise<UserDataResponseDto> {
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
      throw new BadRequestException("휴대폰 인증이 필요합니다."); // 400
    }

    // 4. 비밀번호 해싱
    const passwordHash = await PasswordUtil.hashPassword(password);

    // 5. 사용자 생성
    const user = await this.createUser({
      userId,
      passwordHash,
      phone: normalizedPhone,
    });

    // 6. JWT 토큰 생성
    const tokenPair = await this.jwtUtil.generateTokenPair({
      sub: user.id,
      userId: user.userId ?? "",
      phone: user.phone,
    });

    // 7. 응답 data 반환 (Response Interceptor 래핑하여 자동으로 success, message, timestamp, statusCode를 추가)
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user,
    };
  }

  /**
   * 일반 회원가입 - 사용자 생성
   */
  async createUser(createUserDto: CreateUser): Promise<UserInfo> {
    const { userId, passwordHash, phone } = createUserDto;

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        userId,
        passwordHash,
        phone,
        isPhoneVerified: true,
        lastLoginAt: new Date(),
      },
    });

    return {
      id: user.id,
      phone: user.phone,
      name: user.name ?? "",
      nickname: user.nickname ?? "",
      email: user.email ?? "",
      profileImageUrl: user.profileImageUrl ?? "",
      isPhoneVerified: user.isPhoneVerified,
      isActive: user.isActive,
      userId: user.userId ?? "",
      googleId: user.googleId ?? "",
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt ?? new Date(),
    };
  }

  /**
   * 일반 회원가입 - 사용자 ID 중복 확인
   *
   * @param checkUserIdDto 사용자 ID 확인 요청
   * @returns 사용 가능 여부
   */
  async checkUserIdAvailability(
    checkUserIdDto: CheckUserIdRequestDto,
  ): Promise<AvailabilityResponseDto> {
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
        throw new ConflictException("이미 사용 중인 아이디입니다."); // GlobalExceptionFilter에서 처리
      }
      if (existingUser.phone === normalizedPhone) {
        // 휴대폰 번호가 중복되는 경우, 기존 계정의 타입을 확인하여 적절한 메시지 제공
        if (existingUser.userId && existingUser.googleId) {
          // 일반 로그인과 구글 로그인 모두 가능한 계정
          throw new ConflictException(
            "해당 휴대폰 번호로 일반 로그인과 구글 로그인 계정이 모두 존재합니다.",
          );
        } else if (existingUser.userId) {
          // 일반 로그인 계정만 존재
          throw new ConflictException("해당 휴대폰 번호로 일반 로그인 계정이 존재합니다.");
        } else if (existingUser.googleId) {
          // 구글 로그인 계정만 존재
          throw new ConflictException("해당 휴대폰 번호로 구글 로그인 계정이 존재합니다.");
        } else {
          // 기본 메시지
          throw new ConflictException("이미 사용 중인 휴대폰 번호입니다.");
        }
      }
    }
  }

  /**
   * 일반 회원가입 - 일반 로그인
   */
  async login(loginDto: LoginRequestDto): Promise<UserDataResponseDto> {
    const { userId, password } = loginDto;

    // 1. 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다."); // 401
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await PasswordUtil.verifyPassword(password, user.passwordHash || "");
    if (!isPasswordValid) {
      throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    // 3. 휴대폰 인증 상태 확인
    if (!(user as any).isPhoneVerified) {
      throw new UnauthorizedException("휴대폰 인증이 필요합니다.");
    }

    // 4. JWT 토큰 생성
    const tokenPair = await this.jwtUtil.generateTokenPair({
      sub: user.id,
      userId: user.userId ?? "",
      phone: user.phone,
    });

    // 5. 마지막 로그인 시간 업데이트
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name ?? "",
        nickname: user.nickname ?? "",
        email: user.email ?? "",
        profileImageUrl: user.profileImageUrl ?? "",
        isPhoneVerified: user.isPhoneVerified,
        isActive: user.isActive,
        userId: user.userId ?? "",
        googleId: user.googleId ?? "",
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt ?? new Date(),
      },
    };
  }

  /**
   * 일반 회원가입 - 사용자 ID 찾기
   */
  async findUserId(findUserIdDto: FindUserIdRequestDto): Promise<FindUserIdDataResponseDto> {
    const { phone } = findUserIdDto;
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
      throw new BadRequestException("휴대폰 인증이 필요합니다.");
    }

    // 2. 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user || !user.userId) {
      throw new BadRequestException("해당 휴대폰 번호로 등록된 계정이 없습니다.");
    }

    return {
      userId: user.userId,
    };
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
      throw new BadRequestException("해당 아이디로 등록된 계정이 없습니다.");
    }

    // 2. 휴대폰 번호 일치 확인
    if (user.phone !== normalizedPhone) {
      throw new BadRequestException("아이디와 휴대폰 번호가 일치하지 않습니다.");
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
      throw new BadRequestException("휴대폰 인증이 필요합니다.");
    }

    // 4. 새 비밀번호 해시화 및 업데이트
    const hashedPassword = await PasswordUtil.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { userId },
      data: { passwordHash: hashedPassword },
    });
  }

  /**
   * 휴대폰 번호 변경
   */
  async changePhone(changePhoneDto: ChangePhoneRequestDto): Promise<void> {
    const { oldPhone, newPhone } = changePhoneDto;
    const normalizedOldPhone = PhoneUtil.normalizePhone(oldPhone);
    const normalizedNewPhone = PhoneUtil.normalizePhone(newPhone);

    // 1. 기존 휴대폰 번호로 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { phone: normalizedOldPhone },
    });

    if (!user) {
      throw new BadRequestException("기존 휴대폰 번호로 등록된 사용자를 찾을 수 없습니다.");
    }

    // 2. 새 휴대폰 번호 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: normalizedNewPhone },
    });

    if (existingUser) {
      throw new ConflictException("이미 사용 중인 휴대폰 번호입니다.");
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
      throw new BadRequestException("새 휴대폰 번호 인증이 필요합니다.");
    }

    // 4. 휴대폰 번호 변경
    await this.prisma.user.update({
      where: { id: user.id },
      data: { phone: normalizedNewPhone },
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
