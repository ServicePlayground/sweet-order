# Sweet Order

Yarn Berry + Workspace 기반 모노레포 프로젝트로 구성된 디저트 주문 플랫폼입니다.

## 📁 프로젝트 구조

```
sweet-order/
├─ package.json             # 루트 설정
├─ .yarnrc.yml              # Yarn Berry 설정
├─ node_modules/            # 의존성 패키지들 (node_modules 방식)
├─ tsconfig.base.json       # TypeScript 기본 설정
├─ tsconfig.json            # TypeScript 설정
├─ eslint.config.js         # ESLint 설정
├─ yarn.lock                # Yarn 의존성 잠금 파일
├─ apps/                    # 애플리케이션들
│  ├─ backend/              # 백엔드 서비스 (NestJS + TypeScript)
│  │  ├─ src/               # 소스 코드
│  │  │  ├─ apis/           # API 모듈들 (User, Seller, Admin)
│  │  │  ├─ modules/        # 비즈니스 로직 모듈들
│  │  │  ├─ common/         # 공통 유틸리티
│  │  │  ├─ infra/          # 인프라 설정 (데이터베이스)
│  │  │  └─ config/         # 설정 파일들
│  │  ├─ dist/              # 빌드 산출물
│  │  ├─ nest-cli.json      # Nest CLI 설정
│  │  └─ package.json       # 백엔드 의존성/스크립트
│  ├─ web-user/             # 사용자 웹 애플리케이션 (Next.js + TypeScript)
│  │  ├─ src/               # 소스 코드
│  │  │  ├─ app/            # Next.js App Router
│  │  │  ├─ components/     # React 컴포넌트
│  │  │  ├─ hooks/          # 커스텀 훅
│  │  │  ├─ lib/            # 유틸리티 라이브러리
│  │  │  ├─ services/       # API 서비스
│  │  │  ├─ store/          # 상태 관리
│  │  │  ├─ styles/         # 스타일 파일
│  │  │  └─ types/          # TypeScript 타입 정의
│  │  ├─ public/            # 정적 파일
│  │  ├─ next.config.ts     # Next.js 설정
│  │  └─ package.json       # 프론트엔드 의존성/스크립트
│  ├─ web-seller/           # 판매자 웹 애플리케이션 (향후 구현)
│  ├─ web-admin/            # 관리자 웹 애플리케이션 (향후 구현)
│  └─ infra/                 # 인프라 설정
│     ├─ backend/           # 백엔드 Docker 설정
│     └─ frontend/          # 프론트엔드 인프라 (향후 구현)
├─ docs/                    # 프로젝트 문서
│  ├─ backend/              # 백엔드 관련 문서
│  ├─ common/               # 공통 문서
│  └─ infra/                 # 인프라 관련 문서
│     └─ aws/               # AWS 인프라 가이드
└─ packages/                # 공유 패키지들 (향후 구현 예정)
```

## 🛠 기술 스택

- **패키지 관리**: Yarn Berry 4.9.4 (node_modules)
- **모노레포**: Yarn Workspaces
- **언어**: TypeScript
- **백엔드**: NestJS + PostgreSQL + Prisma
- **프론트엔드**: Next.js 15 + React 19 + TypeScript
- **데이터베이스**:
  - 개발: 로컬 PostgreSQL
  - 스테이징/프로덕션: AWS RDS PostgreSQL
- **인증**: JWT + Passport + Google OAuth
- **API 문서**: Swagger (3-way 분리)
- **보안**: Helmet + CORS + Rate Limiting
- **코드 품질**: ESLint + Prettier

## 🚀 시작하기

### 필수 요구사항

- Node.js (v20 이상)
- Yarn (v4.9.4 이상)

### 로컬 개발 환경 설치 및 실행

```bash
# 프로젝트 클론
git clone <repository-url>
cd sweet-order

# 의존성 설치(자동으로 postinstall 스크립트 실행, 이름 변경시 자동실행 안됨)
# 파일 경로에 한글이 존재하면 오류가 발생할 수 있습니다.
yarn install

# 개발 서버 시작(.env.development 환경변수 필요)
yarn backend:dev          # 백엔드 개발 서버
yarn web-user:dev         # 사용자 웹 개발 서버

# 데이터베이스 관리
yarn db:migrate:dev         # 백엔드 개발 데이터베이스 마이그레이션
yarn db:studio:dev         # 백엔드 개발 데이터베이스 스튜디오
yarn db:seed:dev         # 백엔드 개발 데이터베이스 시드
yarn db:reset:dev         # 백엔드 개발 데이터베이스 리셋

# 코드 품질 검사
yarn common:lint
yarn common:format
```

## 📚 상세 문서

### 공통 문서

- **[Yarn Berry PnP 가이드](<./docs/common/(이전버전)yarnberry%20PnP%20-%20가이드.md>)**: Yarn Berry PnP 설정 및 사용법 (이전 버전)
- **[Yarn Berry node_modules 가이드](<./docs/common/(현재버전)yarnberry%20nodemodules%20-%20가이드.md>)**: Yarn Berry node_modules 설정 및 사용법 (현재 적용)
- **[환경변수 가이드](./docs/common/환경변수%20-%20가이드.md)**: 환경변수 관리 및 보안 정책

### 백엔드 문서

- **[Backend README](./docs/backend/README.md)**: 백엔드 서비스 개요 및 사용법
- **[NestJS 가이드](./docs/backend/NestJS%20-%20가이드.md)**: NestJS 프레임워크 사용법
- **[로컬 데이터베이스 가이드](<./docs/backend/데이터베이스(로컬)%20-%20가이드.md>)**: 로컬 PostgreSQL 및 Prisma ORM 관리
- **[통합 로그인 및 회원가입 가이드](./docs/backend/통합%20로그인%20및%20회원가입%20-%20가이드.md)**: 인증 시스템 구현
- **[통합 플랫폼 인증 관리 가이드](./docs/backend/통합%20플랫폼%20인증%20관리%20-%20가이드.md)**: 통합 인증 시스템 사용법

### 프론트엔드 문서

- **[Web User 가이드](./docs/web-user/)**: 사용자 웹 애플리케이션 개발 및 사용법 (향후 구현)

### 인프라 문서

- **[AWS RDS 가이드](<./docs/infra/aws/AWS%20RDS(데이터베이스)%20-%20가이드.md>)**: AWS RDS PostgreSQL 설정 및 관리
- **[AWS App Runner 가이드](<./docs/infra/aws/AWS%20App%20Runner(backend)%20-%20가이드.md>)**: AWS App Runner 백엔드 배포 가이드
- **[AWS Region 가이드](./docs/infra/aws/AWS%20Region%20-%20가이드.md)**: AWS 리전 선택 가이드
