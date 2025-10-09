# Sweet Order

Yarn Berry PnP + Workspace 기반 모노레포 프로젝트로 구성된 디저트 주문 플랫폼입니다.

## 📁 프로젝트 구조

```
sweet-order/
├─ package.json             # 루트 설정
├─ .yarnrc.yml              # Yarn Berry PnP 설정
├─ .pnp.cjs                 # PnP 의존성 맵 (yarn install 시 생성)
├─ tsconfig.base.json       # TypeScript 설정
├─ yarn.lock                # Yarn 의존성 잠금 파일
├─ apps/                    # 애플리케이션들
│  └─ backend/              # 백엔드 서비스 (NestJS + TypeScript)
│     ├─ src/               # 소스 코드
│     │  ├─ apis/           # API 모듈들 (User, Seller, Admin)
│     │  ├─ modules/        # 비즈니스 로직 모듈들
│     │  ├─ common/         # 공통 유틸리티
│     │  ├─ infra/          # 인프라 설정 (데이터베이스)
│     │  └─ config/         # 설정 파일들
│     ├─ dist/              # 빌드 산출물
│     ├─ nest-cli.json      # Nest CLI 설정
│     └─ package.json       # 백엔드 의존성/스크립트
├─ docs/                    # 프로젝트 문서
│  ├─ backend/              # 백엔드 관련 문서
│  └─ common/               # 공통 문서
└─ packages/                # 공유 패키지들 (향후 구현 예정)
```

## 🚀 주요 명령어

```bash
# 의존성 설치
yarn install

# 개발 서버 시작
yarn dev

# 빌드
yarn build:production

# 코드 품질 검사
yarn lint
yarn format

# 데이터베이스 관리
yarn db:migrate:dev
yarn db:studio:dev
```

## 🛠 기술 스택

- **패키지 관리**: Yarn Berry 4.9.4 (PnP)
- **모노레포**: Yarn Workspaces
- **언어**: TypeScript
- **백엔드**: NestJS + PostgreSQL + Prisma
- **인증**: JWT + Passport + Google OAuth
- **API 문서**: Swagger (3-way 분리)
- **보안**: Helmet + CORS + Rate Limiting
- **코드 품질**: ESLint + Prettier

## 🚀 시작하기

### 필수 요구사항

- Node.js (v20 이상)
- Yarn (v4.9.4 이상)
- PostgreSQL

### 설치 및 실행

```bash
# 프로젝트 클론
git clone <repository-url>
cd sweet-order

# 의존성 설치
yarn install

# 개발 서버 시작
yarn dev
```

## 📚 상세 문서

### 공통 문서

- **[Yarn Berry 가이드](./docs/common/yarnberry%20-%20가이드.md)**: Yarn Berry PnP 설정 및 사용법

### 백엔드 문서

- **[Backend README](./docs/backend/README.md)**: 백엔드 서비스 개요 및 사용법
- **[NestJS 가이드](./docs/backend/NestJS%20-%20가이드.md)**: NestJS 프레임워크 사용법
- **[데이터베이스 가이드](./docs/backend/데이터베이스%20-%20가이드.md)**: Prisma ORM 및 데이터베이스 관리
- **[통합 로그인 및 회원가입 가이드](./docs/backend/통합%20로그인%20및%20회원가입%20-%20가이드.md)**: 인증 시스템 구현
- **[통합 인증 데코레이터 가이드](./docs/backend/통합%20인증%20데코레이터%20-%20가이드.md)**: 통합 인증 시스템 사용법

### 현재 구현 상태

#### ✅ 완료된 기능

- **백엔드 API**: 3-way 분리된 API (User, Seller, Admin)
- **인증 시스템**: JWT + Google OAuth + 휴대폰 인증
- **상품 관리**: 상품 CRUD, 좋아요, 필터링
- **데이터베이스**: PostgreSQL + Prisma ORM
- **API 문서**: Swagger 3-way 분리
- **보안**: Rate Limiting + CORS + Helmet

#### 🔄 향후 구현 예정

- **Web User Frontend**: Next.js 기반 사용자 웹 애플리케이션
- **Web Seller**: 판매자용 웹 애플리케이션
- **Web Admin**: 관리자용 웹 애플리케이션
- **App User/Seller**: React Native 기반 모바일 앱
- **Packages**: 공유 패키지들 (UI 컴포넌트, 유틸리티, 타입 정의 등)
