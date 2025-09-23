import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "@web-user/backend/database/prisma.service";
import { PasswordUtil } from "@web-user/backend/common/utils/password.util";
import { PhoneUtil } from "@web-user/backend/common/utils/phone.util";
import { JwtUtil } from "@web-user/backend/common/utils/jwt.util";
import {
  RegisterRequestDto,
  CheckUserIdRequestDto,
  CheckPhoneRequestDto,
} from "@web-user/backend/modules/auth/dto/auth-request.dto";
import { RegisterDataResponseDto } from "@web-user/backend/modules/auth/dto/auth-data-response.dto";
import { UserInfo, CreateUser } from "@web-user/backend/common/types/auth.types";
import { AvailabilityResponse } from "@web-user/backend/common/types/common.types";

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
   * 회원가입
   */
  async register(registerDto: RegisterRequestDto): Promise<RegisterDataResponseDto> {
    const { userId, password, phone } = registerDto;

    // 1. 사용자 ID와 휴대폰 번호 중복 검증
    await this.checkUserDuplication({
      userId,
      phone,
    });

    // 2. 비밀번호 해싱
    const passwordHash = await PasswordUtil.hashPassword(password);

    // 3. 휴대폰 번호 정규화
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    // 4. 사용자 생성
    const user = await this.createUser({
      userId,
      passwordHash,
      phone: normalizedPhone,
    });

    // 5. JWT 토큰 생성
    const tokenPair = await this.jwtUtil.generateTokenPair({
      sub: user.id,
      userId: user.userId,
      phone: user.phone,
    });

    // 6. 응답 data 반환 (Response Interceptor 래핑하여 자동으로 success, message, timestamp, statusCode를 추가)
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        phone: user.phone,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl,
        isVerified: user.isVerified,
      },
    };
  }

  /**
   * 사용자 ID 중복 확인
   *
   * @param checkUserIdDto 사용자 ID 확인 요청
   * @returns 사용 가능 여부
   */
  async checkUserIdAvailability(
    checkUserIdDto: CheckUserIdRequestDto,
  ): Promise<AvailabilityResponse> {
    const { userId } = checkUserIdDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { userId },
    });

    return { available: !existingUser };
  }

  /**
   * 휴대폰 번호 중복 확인
   *
   * @param checkPhoneDto 휴대폰 번호 확인 요청
   * @returns 사용 가능 여부
   */
  async checkPhoneAvailability(checkPhoneDto: CheckPhoneRequestDto): Promise<AvailabilityResponse> {
    const { phone } = checkPhoneDto;
    const normalizedPhone = PhoneUtil.normalizePhone(phone);

    const existingUser = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    return { available: !existingUser };
  }

  /**
   * 사용자 생성
   */
  async createUser(createUserDto: CreateUser): Promise<UserInfo> {
    const { userId, passwordHash, phone } = createUserDto;

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        userId,
        passwordHash,
        phone,
        isVerified: true,
      },
    });

    return {
      id: user.id,
      userId: user.userId,
      phone: user.phone,
      name: user.name || undefined,
      nickname: user.nickname || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
      isVerified: user.isVerified,
    };
  }

  /**
   * 사용자 정보 중복 검사
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
        throw new ConflictException("이미 사용 중인 휴대폰 번호입니다."); // 409
      }
    }
  }
}
