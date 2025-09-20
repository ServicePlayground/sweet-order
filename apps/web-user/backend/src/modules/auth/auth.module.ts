import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "@web-user/backend/modules/auth/auth.controller";
import { AuthService } from "@web-user/backend/modules/auth/auth.service";
import { UserService } from "@web-user/backend/modules/auth/services/user.service";
import { PhoneService } from "@web-user/backend/modules/auth/services/phone.service";
import { JwtUtil } from "@web-user/backend/common/utils/jwt.util";
import { DatabaseModule } from "@web-user/backend/database/database.module";

/**
 * 인증 모듈
 * 사용자 인증, JWT 토큰 관리, 휴대폰 인증 등의 기능을 제공합니다.
 */
@Module({
  // 이 모듈에서 사용할 다른 모듈들을 import합니다
  imports: [
    // 데이터베이스 연결을 위한 모듈
    DatabaseModule,
    // Passport 인증 전략을 위한 모듈
    PassportModule,
    // JWT 토큰 처리를 위한 모듈 설정
    JwtModule.register({
      // JWT 서명에 사용할 비밀키
      secret: process.env.JWT_SECRET,
    }),
  ],
  // 이 모듈에서 제공하는 컨트롤러들 (API 엔드포인트 정의)
  controllers: [AuthController],
  // 이 모듈에서 제공하는 서비스들 (비즈니스 로직 처리)
  providers: [AuthService, UserService, PhoneService, JwtUtil],
})
export class AuthModule {}
