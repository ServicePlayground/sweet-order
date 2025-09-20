# 일반 회원가입 프로세스 가이드

## 개요

이 문서는 Sweet Order 웹 사용자 백엔드의 일반 회원가입 프로세스에 대한 상세한 설명을 제공합니다.
회원가입부터 JWT 토큰 발급, 로그인 후 액세스 토큰 관리까지의 전체 흐름을 다룹니다.

## 목차

1. [회원가입 프로세스 개요](#회원가입-프로세스-개요)
2. [아이디 중복 검사](#아이디-중복-검사)
3. [휴대폰 인증 프로세스](#휴대폰-인증-프로세스)
4. [회원가입 완료 및 JWT 토큰 발급](#회원가입-완료-및-jwt-토큰-발급)
5. [로그인 후 액세스 토큰 관리](#로그인-후-액세스-토큰-관리)
6. [API 엔드포인트](#api-엔드포인트)
7. [데이터베이스 스키마](#데이터베이스-스키마)

---

## 회원가입 프로세스 개요

일반 회원가입은 다음과 같은 단계로 진행됩니다:

```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant API as AuthController
    participant AuthService as AuthService
    participant UserService as UserManagementService
    participant PhoneService as PhoneVerificationService
    participant JWT as JwtUtil
    participant DB as Database

    Client->>API: 1. 아이디 중복 검사
    API->>AuthService: checkUserIdAvailability()
    AuthService->>UserService: checkUserIdAvailability()
    UserService->>DB: SELECT * FROM users WHERE userId = ?
    DB-->>UserService: 사용자 존재 여부
    UserService-->>AuthService: { available: boolean }
    AuthService-->>API: { available: boolean }
    API-->>Client: 중복 검사 결과

    Client->>API: 2. 휴대폰 인증번호 발송
    API->>AuthService: sendVerificationCode()
    AuthService->>PhoneService: sendVerificationCode()
    PhoneService->>DB: INSERT INTO phone_verifications
    PhoneService-->>AuthService: 인증번호 발송 완료
    AuthService-->>API: 발송 완료
    API-->>Client: 발송 성공 메시지

    Client->>API: 3. 휴대폰 인증번호 확인
    API->>AuthService: verifyPhoneCode()
    AuthService->>PhoneService: verifyPhoneCode()
    PhoneService->>DB: UPDATE phone_verifications SET isVerified = true
    PhoneService-->>AuthService: 인증 완료
    AuthService-->>API: 인증 완료
    API-->>Client: 인증 성공 메시지

    Client->>API: 4. 회원가입 요청
    API->>AuthService: register()
    AuthService->>UserService: 중복 검사
    AuthService->>PhoneService: 인증 상태 확인
    AuthService->>JWT: generateTokenPair()
    AuthService->>DB: INSERT INTO users
    AuthService-->>API: AuthResponseDto
    API-->>Client: 회원가입 완료 + JWT 토큰
```

---

## 아이디 중복 검사

### API 엔드포인트

```
GET /auth/check-user-id?userId={userId}
```

### 코드 흐름

1. **클라이언트 요청**

   ```typescript
   // 요청 예시
   GET /auth/check-user-id?userId=user123
   ```

2. **AuthController 처리**

   ```typescript
   // apps/web-user/backend/src/modules/auth/auth.controller.ts
   @Get("check-user-id")
   @Public()
   async checkUserIdAvailability(@Query() checkUserIdDto: CheckUserIdDto) {
     return this.authService.checkUserIdAvailability(checkUserIdDto);
   }
   ```

3. **AuthService 위임**

   ```typescript
   // apps/web-user/backend/src/modules/auth/auth.service.ts
   async checkUserIdAvailability(checkUserIdDto: CheckUserIdDto) {
     return this.userManagementService.checkUserIdAvailability(checkUserIdDto);
   }
   ```

4. **UserManagementService 처리**

   ```typescript
   // apps/web-user/backend/src/modules/auth/services/user-management.service.ts
   async checkUserIdAvailability(checkUserIdDto: CheckUserIdDto) {
     const { userId } = checkUserIdDto;

     const existingUser = await this.prisma.user.findUnique({
       where: { userId },
     });

     return { available: !existingUser };
   }
   ```

5. **응답**
   ```json
   {
     "available": true // 사용 가능
   }
   ```
   또는
   ```json
   {
     "available": false // 이미 사용 중
   }
   ```

### 데이터베이스 쿼리

```sql
SELECT * FROM users WHERE user_id = 'user123';
```

---

## 휴대폰 인증 프로세스

### 1단계: 인증번호 발송

#### API 엔드포인트

```
POST /auth/send-verification-code
```

#### 요청 데이터

```json
{
  "phone": "010-1234-5678"
}
```

#### 코드 흐름

1. **AuthController 처리**

   ```typescript
   @Post("send-verification-code")
   @Public()
   async sendVerificationCode(@Body() sendCodeDto: SendVerificationCodeDto) {
     await this.authService.sendVerificationCode(sendCodeDto);
     return { message: "인증번호가 발송되었습니다." };
   }
   ```

2. **PhoneVerificationService 처리**

   ```typescript
   // apps/web-user/backend/src/modules/auth/services/phone-verification.service.ts
   async sendVerificationCode(sendCodeDto: SendVerificationCodeDto) {
     const { phone } = sendCodeDto;
     const normalizedPhone = PhoneUtil.normalizePhone(phone);

     // 6자리 랜덤 인증번호 생성
     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

     // 5분 후 만료 시간 설정
     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

     // 데이터베이스에 인증 정보 저장
     await this.prisma.phoneVerification.create({
       data: {
         phone: normalizedPhone,
         verificationCode,
         expiresAt,
         attemptCount: 0,
         isVerified: false,
       },
     });

     // 실제 SMS 발송 로직 (구현 예정)
     // await this.smsService.sendSMS(normalizedPhone, verificationCode);
   }
   ```

#### 데이터베이스 저장

```sql
INSERT INTO phone_verifications (
  id, phone, verification_code, attempt_count, expires_at, is_verified, created_at, updated_at
) VALUES (
  'cuid_123', '01012345678', '123456', 0, '2024-01-01 12:05:00', false, NOW(), NOW()
);
```

### 2단계: 인증번호 확인

#### API 엔드포인트

```
POST /auth/verify-phone-code
```

#### 요청 데이터

```json
{
  "phone": "010-1234-5678",
  "verificationCode": "123456"
}
```

#### 코드 흐름

1. **PhoneVerificationService 검증**

   ```typescript
   async verifyPhoneCode(verifyCodeDto: VerifyPhoneCodeDto) {
     const { phone, verificationCode } = verifyCodeDto;
     const normalizedPhone = PhoneUtil.normalizePhone(phone);

     // 1. 휴대폰 번호와 인증번호로 검증 정보 조회
     const phoneVerification = await this.prisma.phoneVerification.findFirst({
       where: {
         phone: normalizedPhone,
         verificationCode,
       },
       orderBy: { createdAt: "desc" },
     });

     // 2. 인증 정보 존재 확인
     if (!phoneVerification) {
       throw new BadRequestException("인증번호가 올바르지 않습니다.");
     }

     // 3. 이미 인증된 번호인지 확인
     if (phoneVerification.isVerified) {
       throw new BadRequestException("이미 인증된 번호입니다.");
     }

     // 4. 만료 시간 확인 (5분 이내)
     if (phoneVerification.expiresAt < new Date()) {
       throw new BadRequestException("인증번호가 만료되었습니다.");
     }

     // 5. 시도 횟수 확인 (5회 이내)
     if (phoneVerification.attemptCount >= 5) {
       throw new BadRequestException("인증 시도 횟수를 초과했습니다.");
     }

     // 6. 인증 성공 처리
     await this.prisma.phoneVerification.update({
       where: { id: phoneVerification.id },
       data: {
         isVerified: true,
         attemptCount: phoneVerification.attemptCount + 1,
       },
     });
   }
   ```

#### 데이터베이스 업데이트

```sql
UPDATE phone_verifications
SET is_verified = true, attempt_count = attempt_count + 1, updated_at = NOW()
WHERE id = 'cuid_123';
```

---

## 회원가입 완료 및 JWT 토큰 발급

### API 엔드포인트

```
POST /auth/register
```

### 요청 데이터

```json
{
  "userId": "user123",
  "password": "Password123!",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "nickname": "홍길동",
  "verificationCode": "123456"
}
```

### 코드 흐름

1. **AuthService 회원가입 처리** (현재 TODO 상태)

   ```typescript
   // apps/web-user/backend/src/modules/auth/auth.service.ts
   async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
     // TODO: 회원가입 로직 구현 예정
     // 1. 사용자 정보 중복 검사
     // 2. 휴대폰 인증 상태 확인
     // 3. 비밀번호 해시화
     // 4. 사용자 정보 저장
     // 5. JWT 토큰 생성
     // 6. AuthResponseDto 반환
   }
   ```

2. **예상 구현 흐름**

   ```typescript
   async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
     const { userId, password, name, phone, nickname, verificationCode } = registerDto;

     // 1. 사용자 정보 중복 검사
     await this.userManagementService.checkUserDuplication({
       userId,
       phone,
     });

     // 2. 휴대폰 인증 상태 확인
     const normalizedPhone = PhoneUtil.normalizePhone(phone);
     const phoneVerification = await this.prisma.phoneVerification.findFirst({
       where: {
         phone: normalizedPhone,
         verificationCode,
         isVerified: true,
       },
     });

     if (!phoneVerification) {
       throw new BadRequestException("휴대폰 인증이 완료되지 않았습니다.");
     }

     // 3. 비밀번호 해시화
     const passwordHash = await PasswordUtil.hashPassword(password);

     // 4. 사용자 정보 저장
     const user = await this.prisma.user.create({
       data: {
         userId,
         passwordHash,
         name,
         phone: normalizedPhone,
         nickname,
         isVerified: true,
       },
     });

     // 5. JWT 토큰 생성
     const tokenPair = await this.jwtUtil.generateTokenPair({
       sub: user.id,
       userId: user.userId,
       phone: user.phone,
     });

     // 6. AuthResponseDto 반환
     return {
       accessToken: tokenPair.accessToken,
       refreshToken: tokenPair.refreshToken,
       expiresIn: tokenPair.expiresIn,
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
   ```

### JWT 토큰 생성 과정

1. **JwtUtil.generateTokenPair() 호출**

   ```typescript
   // apps/web-user/backend/src/common/utils/jwt.util.ts
   async generateTokenPair(payload: Omit<JwtPayload, "iat" | "exp">): Promise<TokenPair> {
     const accessTokenPayload = {
       ...payload,
       type: TOKEN_TYPES.ACCESS,
     };

     const refreshTokenPayload = {
       sub: payload.sub,
       userId: payload.userId,
       type: TOKEN_TYPES.REFRESH,
     };

     const [accessToken, refreshToken] = await Promise.all([
       this.jwtService.signAsync(accessTokenPayload, {
         expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
       }),
       this.jwtService.signAsync(refreshTokenPayload, {
         expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
       }),
     ]);

     return {
       accessToken,
       refreshToken,
       expiresIn: this.getTokenExpirationTime(process.env.JWT_ACCESS_EXPIRES_IN || "1h"),
     };
   }
   ```

2. **토큰 페이로드 구조**

   ```typescript
   // Access Token Payload
   {
     "sub": "user_cuid_123",           // 사용자 고유 ID
     "userId": "user123",              // 사용자 로그인 ID
     "phone": "01012345678",           // 휴대폰 번호
     "type": "access",                 // 토큰 타입
     "iat": 1640995200,                // 발급 시간
     "exp": 1640998800                 // 만료 시간 (1시간 후)
   }

   // Refresh Token Payload
   {
     "sub": "user_cuid_123",           // 사용자 고유 ID
     "userId": "user123",              // 사용자 로그인 ID
     "type": "refresh",                // 토큰 타입
     "iat": 1640995200,                // 발급 시간
     "exp": 1641600000                 // 만료 시간 (7일 후)
   }
   ```

### 응답 데이터

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "user_cuid_123",
    "userId": "user123",
    "name": "홍길동",
    "phone": "01012345678",
    "nickname": "홍길동",
    "profileImageUrl": null,
    "isVerified": true
  }
}
```

---

## 로그인 후 액세스 토큰 관리

### 1. 토큰 사용 방법

클라이언트는 API 요청 시 Authorization 헤더에 액세스 토큰을 포함해야 합니다:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. JWT 가드 처리

1. **JwtAuthGuard 적용**

   ```typescript
   // apps/web-user/backend/src/modules/auth/guards/jwt-auth.guard.ts
   @Injectable()
   export class JwtAuthGuard extends AuthGuard("jwt") {}
   ```

2. **JwtStrategy 검증**

   ```typescript
   // apps/web-user/backend/src/modules/auth/guards/jwt.strategy.ts
   async validate(payload: JwtPayload): Promise<JwtUserInfo> {
     // 토큰 타입이 access인지 확인
     if (payload.type !== TOKEN_TYPES.ACCESS) {
       throw new UnauthorizedException("Invalid token type");
     }

     // 필수 필드 검증
     if (!payload.phone) {
       throw new UnauthorizedException("Invalid token payload");
     }

     return {
       id: payload.sub,
       userId: payload.userId,
       phone: payload.phone,
     };
   }
   ```

### 3. 액세스 토큰 갱신

액세스 토큰이 만료되면 리프레시 토큰을 사용하여 새로운 토큰을 발급받을 수 있습니다:

```typescript
// JwtUtil.refreshAccessToken()
async refreshAccessToken(refreshToken: string, userInfo: UserInfo): Promise<TokenPair> {
  // 리프레시 토큰 검증
  const payload = await this.verifyToken(refreshToken);

  if (payload.type !== TOKEN_TYPES.REFRESH) {
    throw new Error("Invalid token type");
  }

  // 새로운 토큰 쌍 생성
  return this.generateTokenPair({
    sub: userInfo.id,
    userId: userInfo.userId,
    phone: userInfo.phone,
  });
}
```

### 4. 토큰 만료 처리

- **액세스 토큰**: 기본 1시간 (환경변수로 설정 가능)
- **리프레시 토큰**: 기본 7일 (환경변수로 설정 가능)

토큰이 만료되면:

1. 클라이언트는 401 Unauthorized 응답을 받습니다
2. 리프레시 토큰으로 새로운 액세스 토큰을 요청합니다
3. 새로운 토큰으로 API 요청을 재시도합니다

---

## API 엔드포인트

### 인증 관련 API

| 메서드 | 엔드포인트                     | 설명                  | 인증 필요 |
| ------ | ------------------------------ | --------------------- | --------- |
| GET    | `/auth/check-user-id`          | 사용자 ID 중복 확인   | ❌        |
| GET    | `/auth/check-phone`            | 휴대폰 번호 중복 확인 | ❌        |
| POST   | `/auth/send-verification-code` | 휴대폰 인증번호 발송  | ❌        |
| POST   | `/auth/verify-phone-code`      | 휴대폰 인증번호 확인  | ❌        |
| POST   | `/auth/register`               | 회원가입              | ❌        |
| POST   | `/auth/login`                  | 로그인                | ❌        |
| POST   | `/auth/refresh`                | 토큰 갱신             | ❌        |
| POST   | `/auth/logout`                 | 로그아웃              | ✅        |

### 요청/응답 예시

#### 사용자 ID 중복 확인

```http
GET /auth/check-user-id?userId=user123
```

#### 휴대폰 인증번호 발송

```http
POST /auth/send-verification-code
Content-Type: application/json

{
  "phone": "010-1234-5678"
}
```

#### 휴대폰 인증번호 확인

```http
POST /auth/verify-phone-code
Content-Type: application/json

{
  "phone": "010-1234-5678",
  "verificationCode": "123456"
}
```

#### 회원가입

```http
POST /auth/register
Content-Type: application/json

{
  "userId": "user123",
  "password": "Password123!",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "nickname": "홍길동",
  "verificationCode": "123456"
}
```

---

## 데이터베이스 스키마

### Users 테이블

```sql
CREATE TABLE users (
  id VARCHAR(25) PRIMARY KEY,                    -- 고유 식별자 (CUID)
  user_id VARCHAR(255) UNIQUE NOT NULL,          -- 사용자 ID (로그인용)
  password_hash VARCHAR(255),                    -- 암호화된 비밀번호
  name VARCHAR(255),                             -- 사용자 실명
  phone VARCHAR(20) UNIQUE,                      -- 휴대폰 번호
  nickname VARCHAR(255),                         -- 닉네임
  profile_image_url TEXT,                        -- 프로필 이미지 URL
  is_verified BOOLEAN DEFAULT FALSE,             -- 휴대폰 인증 여부
  created_at TIMESTAMP DEFAULT NOW(),            -- 계정 생성일시
  updated_at TIMESTAMP DEFAULT NOW()             -- 계정 수정일시
);
```

### PhoneVerifications 테이블

```sql
CREATE TABLE phone_verifications (
  id VARCHAR(25) PRIMARY KEY,                    -- 고유 식별자 (CUID)
  phone VARCHAR(20) NOT NULL,                    -- 휴대폰 번호
  verification_code VARCHAR(6) NOT NULL,         -- 인증번호 (6자리)
  attempt_count INTEGER DEFAULT 0,               -- 인증 시도 횟수
  expires_at TIMESTAMP NOT NULL,                 -- 인증번호 만료시간
  is_verified BOOLEAN DEFAULT FALSE,             -- 인증 완료 여부
  created_at TIMESTAMP DEFAULT NOW(),            -- 인증 요청일시
  updated_at TIMESTAMP DEFAULT NOW(),            -- 인증 수정일시

  UNIQUE(phone, verification_code)               -- 휴대폰번호 + 인증번호 조합 유니크
);
```

---

## 보안 고려사항

### 1. 비밀번호 보안

- bcrypt를 사용한 해시화
- 최소 8자, 영문 대소문자, 숫자, 특수문자 포함
- 평문 저장 금지

### 2. 휴대폰 인증 보안

- 인증번호 5분 만료
- 일일 5회 시도 제한
- 6자리 랜덤 숫자

### 3. JWT 토큰 보안

- 액세스 토큰: 1시간 만료
- 리프레시 토큰: 7일 만료
- 토큰 타입 검증
- Bearer 토큰 방식 사용

### 4. API 보안

- Public 데코레이터로 인증 불필요 엔드포인트 명시
- JWT 가드로 보호된 엔드포인트 자동 인증
- 입력 데이터 유효성 검증

---

## 환경변수 설정

```env
# JWT 설정
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 데이터베이스 설정
DATABASE_URL=postgresql://username:password@localhost:5432/sweet_order

# SMS 서비스 설정 (구현 예정)
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://api.sms-service.com
```

---

## 구현 상태

### ✅ 완료된 기능

- 사용자 ID 중복 검사
- 휴대폰 인증번호 발송/확인
- JWT 토큰 생성/검증 유틸리티
- 인증 가드 및 전략
- 데이터베이스 스키마

### 🚧 구현 예정

- 회원가입 로직 (AuthService.register)
- 로그인 로직
- 토큰 갱신 로직
- 로그아웃 로직
- SMS 발송 서비스 연동

### 📋 향후 개선사항

- 소셜 로그인 (카카오, 네이버, 구글)
- 이메일 인증 기능
- 비밀번호 재설정 기능
- 계정 잠금/해제 기능
- 다중 기기 로그인 관리
