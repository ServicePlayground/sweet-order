import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "@apps/backend/modules/auth/auth.service";
import { AuthPhoneService } from "@apps/backend/modules/auth/services/auth-phone.service";
import { AuthGoogleOauthService } from "@apps/backend/modules/auth/services/auth-google-oauth.service";
import { AuthAccountFindService } from "@apps/backend/modules/auth/services/auth-account-find.service";
import { AuthMypagePhoneService } from "@apps/backend/modules/auth/services/auth-mypage-phone.service";
import { AuthMypageProfileService } from "@apps/backend/modules/auth/services/auth-mypage-profile.service";
import { AuthWithdrawService } from "@apps/backend/modules/auth/services/auth-withdraw.service";
import { JwtUtil } from "@apps/backend/modules/auth/utils/jwt.util";
import { JwtStrategy } from "@apps/backend/modules/auth/strategies/jwt.strategy";
import { AuthGuard } from "@apps/backend/modules/auth/guards/auth.guard";

/**
 * 인증 모듈
 * 사용자 인증, JWT 토큰 관리, 휴대폰 인증, 구글 OAuth를 제공합니다.
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthAccountFindService,
    AuthMypagePhoneService,
    AuthMypageProfileService,
    AuthWithdrawService,
    AuthPhoneService,
    AuthGoogleOauthService,
    JwtUtil,
    JwtStrategy,
    AuthGuard,
  ],
  exports: [
    AuthService,
    AuthGuard,
    AuthPhoneService,
    AuthMypagePhoneService,
    AuthMypageProfileService,
    AuthWithdrawService,
    AuthAccountFindService,
  ],
})
export class AuthModule {}
