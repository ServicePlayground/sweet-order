import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "@apps/backend/modules/auth/auth.service";
import { UserService } from "@apps/backend/modules/auth/services/user.service";
import { PhoneService } from "@apps/backend/modules/auth/services/phone.service";
import { GoogleService } from "@apps/backend/modules/auth/services/google.service";
import { JwtUtil } from "@apps/backend/modules/auth/utils/jwt.util";
import { CookieUtil } from "@apps/backend/modules/auth/utils/cookie.util";
import { JwtStrategy } from "@apps/backend/modules/auth/strategies/jwt.strategy";
import { AuthGuard } from "@apps/backend/modules/auth/guards/auth.guard";

/**
 * 인증 모듈
 * 사용자 인증, JWT 토큰 관리, 휴대폰 인증, 구글 OAuth 등의 기능을 제공합니다.
 */
@Module({
  // 이 모듈에서 사용할 다른 모듈들을 import합니다
  imports: [
    // Passport 인증 전략을 위한 모듈
    PassportModule,
    // JWT 토큰 처리를 위한 모듈 설정
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  // 이 모듈에서 제공하는 서비스들 (비즈니스 로직 처리)
  providers: [
    AuthService,
    UserService,
    PhoneService,
    GoogleService,
    JwtUtil,
    CookieUtil,
    JwtStrategy,
    AuthGuard,
  ],
  // 다른 모듈에서 사용할 수 있도록 export하는 서비스들
  exports: [AuthService, AuthGuard, CookieUtil],
})
export class AuthModule {}
