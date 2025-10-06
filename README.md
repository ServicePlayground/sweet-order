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
│  └─ web-user/             # 사용자 웹 애플리케이션
│     └─ backend/           # 사용자 웹 백엔드 (NestJS + TypeScript)
│        ├─ src/            # 소스 코드
│        ├─ dist/           # 빌드 산출물
│        ├─ nest-cli.json   # Nest CLI 설정
│        └─ package.json    # 백엔드 의존성/스크립트
├─ docs/                    # 프로젝트 문서
│  ├─ backend/              # 백엔드 관련 문서
│  └─ common/               # 공통 문서
└─ packages/                 # 공유 패키지들
   └─ shared-database/       # Prisma 스키마 및 마이그레이션
      ├─ prisma/             # schema.prisma, generated client, migrations
      └─ package.json
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
yarn typecheck
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

- **[Web User Backend README](./docs/backend/README.md)**: 백엔드 서비스 개요 및 사용법
- **[NestJS 가이드](./docs/backend/NestJS%20-%20가이드.md)**: NestJS 프레임워크 사용법
- **[데이터베이스 가이드](./docs/backend/데이터베이스%20-%20가이드.md)**: Prisma ORM 및 데이터베이스 관리
- **[통합 로그인 및 회원가입 가이드](./docs/backend/통합%20로그인%20및%20회원가입%20-%20가이드.md)**: 인증 시스템 구현

### 향후 구현 예정

- **Web User Frontend**: Next.js 기반 사용자 웹 애플리케이션
- **Web Seller**: 판매자용 웹 애플리케이션
- **Web Admin**: 관리자용 웹 애플리케이션
- **App User/Seller**: React Native 기반 모바일 앱
- **Packages**: 공유 패키지들 (UI 컴포넌트, 유틸리티, 타입 정의 등)
