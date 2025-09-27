# 백엔드 API 테스트 가이드

이 문서는 백엔드 API 테스트 코드의 구조와 사용법을 설명합니다.

## 📁 테스트 구조

```
test/
├── base/                          # 테스트 베이스 클래스 및 공통 유틸리티
│   ├── base-test.ts              # 기본 테스트 클래스
│   ├── auth-test-base.ts         # 인증 테스트 베이스 클래스
│   ├── test-constants.ts         # 테스트 상수 정의
│   └── test-decorators.ts        # 테스트 데코레이터
├── utils/                         # 테스트 유틸리티
│   ├── test-data.factory.ts      # 테스트 데이터 팩토리
│   ├── test-helpers.ts           # 테스트 헬퍼 함수
│   └── mock-services.ts          # 모킹 서비스
├── auth/                          # 인증 관련 테스트
│   ├── register.e2e-spec.ts      # 회원가입 테스트
│   ├── login.e2e-spec.ts         # 로그인 테스트
│   ├── google-auth.e2e-spec.ts   # 구글 인증 테스트
│   ├── check-user-id.e2e-spec.ts # ID 중복 확인 테스트
│   ├── phone-verification.e2e-spec.ts # 휴대폰 인증 테스트
│   ├── user-management.e2e-spec.ts # 사용자 관리 테스트
│   └── token-refresh.e2e-spec.ts # 토큰 갱신 테스트
├── integration/                   # 통합 테스트
│   ├── auth-flows.e2e-spec.ts    # 인증 플로우 테스트
│   └── error-scenarios.e2e-spec.ts # 에러 시나리오 테스트
├── refactored/                    # 리팩터링된 테스트
│   ├── register-refactored.e2e-spec.ts
│   └── integration-flows-refactored.e2e-spec.ts
├── setup.ts                       # 테스트 설정
└── jest-e2e.json                 # E2E 테스트 설정
```

## 🚀 테스트 실행

### 전체 테스트 실행

```bash
npm run test:e2e
```

### 특정 테스트 실행

```bash
# 인증 관련 테스트만 실행
npm run test:e2e -- --testPathPattern=auth

# 통합 테스트만 실행
npm run test:e2e -- --testPathPattern=integration

# 특정 테스트 파일 실행
npm run test:e2e -- --testPathPattern=register.e2e-spec.ts
```

### 테스트 커버리지 확인

```bash
npm run test:cov
```

### 테스트 디버깅

```bash
npm run test:debug
```

## 📋 테스트 케이스

### 1. 일반 회원가입 플로우

- ✅ 유효한 데이터로 회원가입 성공
- ✅ ID 중복 확인
- ✅ 휴대폰 인증 완료 후 회원가입
- ❌ 중복된 사용자 ID로 회원가입 실패
- ❌ 중복된 휴대폰 번호로 회원가입 실패
- ❌ 휴대폰 인증 없이 회원가입 실패

### 2. 일반 로그인 플로우

- ✅ 유효한 아이디/비밀번호로 로그인 성공
- ❌ 존재하지 않는 사용자로 로그인 실패
- ❌ 잘못된 비밀번호로 로그인 실패
- ❌ 휴대폰 인증이 완료되지 않은 사용자로 로그인 실패

### 3. 구글 로그인 플로우

- ✅ 휴대폰 인증이 완료된 구글 사용자로 로그인 성공
- ❌ 등록되지 않은 구글 사용자로 로그인 실패
- ❌ 휴대폰 인증이 완료되지 않은 구글 사용자로 로그인 실패
- ❌ 잘못된 구글 코드로 로그인 실패

### 4. 구글 회원가입 플로우

- ✅ 유효한 구글 정보로 회원가입 성공
- ❌ 중복된 구글 ID로 회원가입 실패
- ❌ 중복된 휴대폰 번호로 구글 회원가입 실패
- ❌ 휴대폰 인증 없이 구글 회원가입 실패

### 5. 계정 찾기 플로우

- ✅ 휴대폰 인증을 통한 계정 찾기 성공
- ❌ 등록되지 않은 휴대폰 번호로 계정 찾기 실패
- ❌ 휴대폰 인증 없이 계정 찾기 실패

### 6. 비밀번호 변경 플로우

- ✅ 휴대폰 인증을 통한 비밀번호 변경 성공
- ❌ 존재하지 않는 사용자로 비밀번호 변경 실패
- ❌ 사용자 ID와 휴대폰 번호가 일치하지 않을 때 비밀번호 변경 실패
- ❌ 휴대폰 인증 없이 비밀번호 변경 실패

### 7. 휴대폰 번호 변경 플로우

- ✅ 인증된 사용자의 휴대폰 번호 변경 성공
- ❌ 인증 토큰 없이 휴대폰 번호 변경 실패
- ❌ 이미 사용 중인 휴대폰 번호로 변경 실패
- ❌ 새 휴대폰 번호 인증 없이 변경 실패

### 8. 토큰 갱신 플로우

- ✅ 유효한 refresh token으로 access token 갱신 성공
- ❌ 유효하지 않은 refresh token으로 갱신 실패
- ❌ 만료된 refresh token으로 갱신 실패
- ❌ 삭제된 사용자의 refresh token으로 갱신 실패

### 9. 휴대폰 인증 플로우

- ✅ 유효한 휴대폰 번호로 인증번호 발송 성공
- ✅ 유효한 인증번호로 휴대폰 인증 성공
- ❌ 인증번호 발송 제한 초과
- ❌ 이미 인증된 휴대폰 번호로 인증번호 발송 실패
- ❌ 잘못된 인증번호로 인증번호 확인 실패
- ❌ 인증번호 발송 없이 인증번호 확인 실패

## 🛠️ 테스트 유틸리티

### TestDataFactory

테스트에 사용할 다양한 데이터를 생성하는 팩토리 클래스입니다.

```typescript
// 유효한 사용자 데이터 생성
const userData = TestDataFactory.createValidUser();

// 유효하지 않은 사용자 ID들 생성
const invalidUserIds = TestDataFactory.createInvalidUserIds();

// 테스트용 휴대폰 번호들 생성
const testPhones = TestDataFactory.createTestPhones();
```

### TestHelpers

테스트에서 자주 사용되는 공통 기능들을 제공하는 헬퍼 클래스입니다.

```typescript
// 휴대폰 인증 완료
await TestHelpers.completePhoneVerification(app, phone);

// 사용자 생성
const { user, response } = await TestHelpers.createUser(app, userData);

// 로그인
const loginResponse = await TestHelpers.loginUser(app, userId, password);
```

### BaseTest

모든 테스트에서 공통으로 사용되는 설정과 헬퍼 메서드를 제공하는 베이스 클래스입니다.

```typescript
class MyTest extends BaseTest {
  async beforeAll() {
    await this.initializeApp();
  }

  async afterAll() {
    await this.cleanupApp();
  }

  async beforeEach() {
    await this.beforeEachSetup();
  }
}
```

### AuthTestBase

인증 관련 테스트에서 공통으로 사용되는 메서드들을 제공하는 베이스 클래스입니다.

```typescript
class MyAuthTest extends AuthTestBase {
  async testRegistration() {
    // 회원가입 플로우 실행
    const { user, response } = await this.executeGeneralRegistrationFlow();

    // 응답 검증
    this.expectUserDataResponse(response, user.userId);
  }
}
```

## 🎯 테스트 데코레이터

테스트 코드의 가독성과 구조를 개선하기 위한 데코레이터들을 제공합니다.

```typescript
@TestGroup('회원가입')
@TestScenario('일반 회원가입')
@TestSetup({ timeout: 30000 })
describe('일반 회원가입 API', () => {
  // 테스트 코드
});

@IntegrationTest
@SecurityTest
describe('보안 테스트', () => {
  // 테스트 코드
});
```

## 📊 테스트 상수

테스트에서 자주 사용되는 상수들을 중앙 집중화하여 관리합니다.

```typescript
import { TEST_CONSTANTS } from "../base/test-constants";

// HTTP 상태 코드
TEST_CONSTANTS.HTTP_STATUS.OK;
TEST_CONSTANTS.HTTP_STATUS.BAD_REQUEST;

// 에러 메시지
TEST_CONSTANTS.ERROR_MESSAGES.BUSINESS.USER_NOT_FOUND;

// 성공 메시지
TEST_CONSTANTS.SUCCESS_MESSAGES.USER_REGISTERED;
```

## 🔧 모킹 서비스

외부 서비스나 의존성을 모킹하여 테스트의 안정성을 보장합니다.

```typescript
import { setupAllMocks, resetAllMocks } from "../utils/mock-services";

beforeAll(() => {
  setupAllMocks();
});

beforeEach(() => {
  resetAllMocks();
});
```

## 📈 성능 테스트

동시 요청 처리 능력과 응답 시간을 테스트합니다.

```typescript
describe("성능 테스트", () => {
  it("동시에 여러 회원가입 요청 처리", async () => {
    const promises = userDataList.map((userData) =>
      request(app.getHttpServer()).post("/auth/register").send(userData),
    );

    const responses = await Promise.all(promises);

    responses.forEach((response) => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
```

## 🔒 보안 테스트

SQL 인젝션, XSS 등의 보안 취약점을 테스트합니다.

```typescript
describe("보안 테스트", () => {
  it("SQL 인젝션 시도로 로그인 실패", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        userId: "'; DROP TABLE users; --",
        password: "SomePassword123!",
      })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
```

## 🚨 에러 시나리오 테스트

다양한 에러 상황을 테스트하여 시스템의 안정성을 보장합니다.

```typescript
describe("에러 시나리오", () => {
  it("중복된 사용자 ID로 회원가입 시도", async () => {
    // 첫 번째 사용자 생성
    await TestHelpers.createUser(app, userData1);

    // 두 번째 사용자 생성 시도 (같은 ID)
    const response = await request(app.getHttpServer())
      .post("/auth/register")
      .send(userData2)
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("이미 존재");
  });
});
```

## 📝 테스트 작성 가이드라인

1. **명확한 테스트 이름**: 테스트가 무엇을 테스트하는지 명확하게 표현
2. **단일 책임**: 각 테스트는 하나의 기능만 테스트
3. **독립성**: 테스트 간 의존성이 없도록 작성
4. **재사용성**: 공통 기능은 헬퍼 함수나 베이스 클래스로 분리
5. **가독성**: 테스트 코드가 이해하기 쉽도록 작성
6. **완전성**: 성공 케이스와 실패 케이스를 모두 테스트
7. **엣지 케이스**: 경계값과 예외 상황도 테스트

## 🔄 지속적 개선

테스트 코드는 지속적으로 개선되어야 합니다:

1. **리팩터링**: 중복 코드 제거 및 구조 개선
2. **성능 최적화**: 테스트 실행 시간 단축
3. **커버리지 향상**: 누락된 테스트 케이스 추가
4. **유지보수성**: 코드 변경 시 테스트 수정 용이성
5. **문서화**: 테스트 목적과 방법 명확히 문서화

## 📞 문의

테스트 관련 문의사항이 있으시면 개발팀에 연락해주세요.
