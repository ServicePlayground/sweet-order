# 테스트 실행 가이드

이 문서는 백엔드 API 테스트를 실행하는 방법을 설명합니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
cd apps/web-user/backend
npm install
```

### 2. 테스트 데이터베이스 설정

```bash
# 테스트용 데이터베이스 생성 (PostgreSQL)
createdb sweet_order_test

# 테스트용 환경 변수 설정
export DATABASE_URL="postgresql://username:password@localhost:5432/sweet_order_test"
export JWT_SECRET="test_jwt_secret_key"
export NODE_ENV="test"
```

### 3. 테스트 실행

```bash
# 전체 E2E 테스트 실행
npm run test:e2e

# 특정 카테고리 테스트 실행
npm run test:e2e:auth          # 인증 관련 테스트
npm run test:e2e:integration   # 통합 테스트
npm run test:e2e:refactored    # 리팩터링된 테스트
```

## 📋 테스트 실행 명령어

### 기본 테스트 명령어

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지 확인
npm run test:cov

# 테스트 디버깅
npm run test:debug
```

### E2E 테스트 명령어

```bash
# 전체 E2E 테스트
npm run test:e2e

# 인증 관련 테스트만
npm run test:e2e:auth

# 통합 테스트만
npm run test:e2e:integration

# 리팩터링된 테스트만
npm run test:e2e:refactored

# 테스트 감시 모드
npm run test:e2e:watch

# E2E 테스트 디버깅
npm run test:e2e:debug
```

### 특정 테스트 실행

```bash
# 특정 테스트 파일 실행
npm run test:e2e -- --testPathPattern=register.e2e-spec.ts

# 특정 테스트 그룹 실행
npm run test:e2e -- --testNamePattern="성공 케이스"

# 특정 테스트만 실행 (focused test)
npm run test:e2e -- --testNamePattern="유효한 데이터로 회원가입 성공"
```

## 🔧 테스트 환경 설정

### 환경 변수

테스트 실행 전에 다음 환경 변수들을 설정해야 합니다:

```bash
# 필수 환경 변수
export NODE_ENV="test"
export DATABASE_URL="postgresql://username:password@localhost:5432/sweet_order_test"
export JWT_SECRET="test_jwt_secret_key"
export JWT_EXPIRES_IN="1h"
export JWT_REFRESH_EXPIRES_IN="7d"

# 선택적 환경 변수
export GOOGLE_CLIENT_ID="test_google_client_id"
export GOOGLE_CLIENT_SECRET="test_google_client_secret"
export SMS_API_KEY="test_sms_api_key"
export SMS_API_SECRET="test_sms_api_secret"
```

### 데이터베이스 설정

```bash
# 테스트 데이터베이스 생성
createdb sweet_order_test

# 테스트 데이터베이스 마이그레이션
npm run db:migrate:dev

# 테스트 데이터베이스 초기화
npm run db:reset:dev
```

## 📊 테스트 결과 해석

### 성공적인 테스트 실행

```
PASS test/auth/register.e2e-spec.ts
PASS test/auth/login.e2e-spec.ts
PASS test/integration/auth-flows.e2e-spec.ts

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        15.234 s
```

### 실패한 테스트 실행

```
FAIL test/auth/register.e2e-spec.ts
  ● 유효한 데이터로 회원가입 성공

    expect(received).toBe(expected)

    Expected: true
    Received: false

Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 44 passed, 45 total
```

### 테스트 커버리지

```
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   85.23 |    78.45 |   90.12 |   84.56 |
```

## 🐛 테스트 디버깅

### 1. 테스트 로그 확인

```bash
# 상세한 로그와 함께 테스트 실행
npm run test:e2e -- --verbose

# 특정 테스트만 디버깅
npm run test:e2e -- --testNamePattern="회원가입" --verbose
```

### 2. 테스트 디버깅 모드

```bash
# 디버깅 모드로 테스트 실행
npm run test:e2e:debug

# Chrome DevTools에서 디버깅
# chrome://inspect 접속 후 "Open dedicated DevTools for Node" 클릭
```

### 3. 테스트 중단점 설정

```typescript
// 테스트 코드에서 중단점 설정
it("회원가입 테스트", async () => {
  debugger; // 여기서 실행이 중단됩니다

  const response = await request(app.getHttpServer()).post("/auth/register").send(userData);

  expect(response.status).toBe(201);
});
```

## 🔄 테스트 유지보수

### 1. 테스트 데이터 정리

```bash
# 테스트 후 데이터베이스 정리
npm run db:reset:dev

# 특정 테스트 데이터만 정리
psql sweet_order_test -c "DELETE FROM users WHERE user_id LIKE 'test%';"
```

### 2. 테스트 실패 시 확인사항

- 데이터베이스 연결 상태
- 환경 변수 설정
- 의존성 서비스 상태 (Redis, 외부 API 등)
- 테스트 데이터 정리 상태

### 3. 테스트 성능 최적화

```bash
# 병렬 테스트 실행 (주의: 데이터베이스 충돌 가능)
npm run test:e2e -- --maxWorkers=4

# 특정 테스트만 실행하여 시간 단축
npm run test:e2e -- --testPathPattern="critical"
```

## 📈 테스트 모니터링

### 1. 테스트 실행 시간 모니터링

```bash
# 테스트 실행 시간 측정
time npm run test:e2e

# 특정 테스트의 실행 시간 확인
npm run test:e2e -- --testNamePattern="성능 테스트" --verbose
```

### 2. 테스트 커버리지 모니터링

```bash
# 커버리지 리포트 생성
npm run test:cov

# HTML 커버리지 리포트 확인
open coverage/lcov-report/index.html
```

### 3. 테스트 결과 저장

```bash
# 테스트 결과를 파일로 저장
npm run test:e2e > test-results.txt 2>&1

# JSON 형태로 결과 저장
npm run test:e2e -- --json --outputFile=test-results.json
```

## 🚨 문제 해결

### 자주 발생하는 문제들

#### 1. 데이터베이스 연결 실패

```bash
# 데이터베이스 서비스 상태 확인
pg_ctl status

# 데이터베이스 연결 테스트
psql sweet_order_test -c "SELECT 1;"
```

#### 2. 포트 충돌

```bash
# 사용 중인 포트 확인
lsof -i :3000

# 다른 포트로 테스트 실행
PORT=3001 npm run test:e2e
```

#### 3. 메모리 부족

```bash
# Node.js 메모리 제한 증가
node --max-old-space-size=4096 node_modules/.bin/jest --config ./test/jest-e2e.json
```

#### 4. 테스트 타임아웃

```bash
# 테스트 타임아웃 증가
npm run test:e2e -- --testTimeout=60000
```

## 📝 테스트 실행 체크리스트

### 테스트 실행 전

- [ ] 데이터베이스 연결 확인
- [ ] 환경 변수 설정 확인
- [ ] 의존성 설치 확인
- [ ] 테스트 데이터 정리

### 테스트 실행 중

- [ ] 테스트 진행 상황 모니터링
- [ ] 에러 로그 확인
- [ ] 성능 지표 모니터링

### 테스트 실행 후

- [ ] 테스트 결과 확인
- [ ] 실패한 테스트 분석
- [ ] 커버리지 리포트 확인
- [ ] 테스트 데이터 정리

## 🔗 관련 문서

- [테스트 구조 가이드](./test/README.md)
- [API 문서](../docs/api.md)
- [개발 환경 설정 가이드](../docs/development.md)
- [배포 가이드](../docs/deployment.md)

## 📞 지원

테스트 실행 관련 문제가 있으시면:

1. 이 가이드의 문제 해결 섹션 확인
2. 테스트 로그 및 에러 메시지 확인
3. 개발팀에 문의

---

**참고**: 이 가이드는 지속적으로 업데이트됩니다. 최신 정보는 항상 이 문서를 참조하세요.
