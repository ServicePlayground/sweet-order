# Sweet Order Web User Backend

Sweet Order 웹 사용자 애플리케이션을 위한 NestJS 백엔드 서비스입니다.
모듈 기반 아키텍처로 구성되어 있습니다.

## 🏗️ 아키텍처 개요

- **Framework**: NestJS
- **Architecture**: 모듈 기반 아키텍처 (Controller, Service, Module)
- **API Versioning**: `/v1` 접두사 사용
- **Documentation**: Swagger/OpenAPI 자동 생성
- **Environment**: 개발/스테이징/프로덕션 환경 분리

## 🚀 시작하기

### 필수 요구사항

- Node.js (v20 이상)
- Yarn (모노레포 패키지 매니저)

### 설치

1. 루트 디렉토리에서 의존성 설치:

```bash
# 루트 디렉토리에서 실행
yarn install
```

2. 또는 개별 백엔드 디렉토리에서:

```bash
cd apps/web-user/backend
yarn install
```

3. 환경 변수 설정:

백엔드 디렉토리에 환경별 `.env` 파일을 생성하세요:

**`.env.development`** (개발 환경)

**`.env.staging`** (스테이징 환경)

**`.env.production`** (프로덕션 환경)

### 애플리케이션 실행

#### 모노레포에서 실행 (권장)

```bash
# 루트 디렉토리에서 모든 앱 실행
yarn dev

# 또는 특정 환경으로 실행
yarn staging
yarn production
```

#### 개별 백엔드 실행

```bash
cd apps/web-user/backend

# 개발 모드
yarn dev

# 스테이징 모드
yarn staging

# 프로덕션 모드
yarn production

# 빌드
yarn build:dev
yarn build:staging
yarn build:production
```

### 개발 도구

#### 코드 품질 검사

```bash
# 린트 검사 및 자동 수정
yarn lint

# 타입 체크
yarn typecheck

# 코드 포맷팅
yarn format

# 포맷팅 검사
yarn format:check
```

## 📚 API 문서

개발 환경에서 실행 시 Swagger API 문서를 확인할 수 있습니다:

- URL: `http://localhost:3000/v1/docs`

## 🏗️ 프로젝트 구조

```
src/
├── app.module.ts                    # 루트 모듈
├── main.ts                          # 애플리케이션 진입점
├── common/                          # 공통 모듈
│   ├── decorators/                  # 커스텀 데코레이터
│   │   └── api-response.decorator.ts
│   ├── dto/                         # 공통 DTO
│   │   ├── error-response.dto.ts
│   │   └── success-response.dto.ts
│   ├── filters/                     # 전역 예외 필터
│   │   └── global-exception.filter.ts
│   └── interfaces/                  # 공통 인터페이스
│       └── api-response.interface.ts
├── config/                          # 설정
│   └── constants/                   # 상수 정의
│       └── app.constants.ts
├── modules/                         # 기능 모듈들
│   ├── health/                      # 헬스 체크 모듈
│   │   ├── health.controller.ts     # 헬스 체크 컨트롤러
│   │   ├── health.service.ts        # 헬스 체크 서비스
│   │   ├── health.module.ts         # 헬스 체크 모듈
│   │   └── dto/                     # 헬스 체크 DTO
│   │       └── health-response.dto.ts
│   ├── auth/                        # 인증 모듈 (향후 구현)
│   ├── users/                       # 사용자 모듈 (향후 구현)
│   └── orders/                      # 주문 모듈 (향후 구현)
└── database/                        # 데이터베이스 관련 (향후 구현)
    ├── entities/                    # 엔티티
    ├── migrations/                  # 마이그레이션
    └── seeds/                       # 시드 데이터
```

## 🔧 현재 구현된 기능

### ✅ 완료된 기능

1. **서버 설정**
   - NestJS 애플리케이션 부트스트랩
   - 환경별 설정 관리 (`@nestjs/config`)
   - CORS 설정 (환경별 분기)
   - 보안 헤더 (Helmet)
   - HTTP 요청 로깅 (Morgan)

2. **API 구조**
   - `/v1` API 버전 관리
   - Swagger 문서 자동 생성 (개발 환경)
   - 전역 유효성 검사 파이프
   - 통일된 응답 형식

3. **에러 처리**
   - 전역 예외 필터
   - 통일된 에러 응답 형식
   - HTTP 상태 코드 관리

4. **헬스 체크**
   - 서버 상태 확인 API
   - 서비스 정보 포함

## 🚀 향후 확장 계획

### 🔄 단기 계획 (1-2개월)

- [ ] **인증/인가 모듈**: JWT 기반 사용자 인증
- [ ] **사용자 관리 모듈**: 회원가입, 프로필 관리, 사용자 CRUD
- [ ] **데이터베이스 연동**: Prisma ORM + PostgreSQL

### 🔄 중기 계획 (3-6개월)

- [ ] **주문 관리 모듈**: 주문 생성, 조회, 수정, 취소
- [ ] **상품 관리 모듈**: 메뉴 관리, 재고 관리, 카테고리
- [ ] **결제 시스템**: 결제 처리, 결제 내역 관리
- [ ] **캐싱 시스템**: Redis를 통한 성능 최적화

### 🔄 장기 계획 (6개월+)

- [ ] **파일 업로드**: 이미지 업로드, 파일 관리
- [ ] **이메일 서비스**: 알림, 마케팅 이메일
- [ ] **푸시 알림**: 실시간 알림 시스템
- [ ] **분석 시스템**: 사용자 행동 분석, 매출 분석
- [ ] **마이크로서비스**: 서비스 분리 및 확장

## 📋 기술 부채 및 개선사항

- [ ] **환경 변수 검증**: Joi 또는 class-validator를 통한 환경 변수 검증
- [ ] **로깅 시스템**: Winston 또는 Pino를 통한 구조화된 로깅
- [ ] **모니터링**: APM 도구 연동 (New Relic, DataDog 등)
- [ ] **보안 강화**: Rate Limiting, Input Sanitization
- [ ] **성능 최적화**: 압축, 캐싱, 데이터베이스 쿼리 최적화
