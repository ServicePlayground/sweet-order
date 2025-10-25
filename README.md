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
│  │  │  └─ scripts/        # 스크립트 파일들
│  │  ├─ dist/              # 빌드 산출물
│  │  ├─ nest-cli.json      # Nest CLI 설정
│  │  └─ package.json       # 백엔드 의존성/스크립트
│  ├─ web-user/             # 사용자 웹 애플리케이션 (Next.js + TypeScript)
│  │  ├─ src/               # 소스 코드
│  │  │  ├─ app/            # Next.js App Router
│  │  │  │  ├─ layout.tsx   # 루트 레이아웃
│  │  │  │  ├─ page.tsx     # 홈페이지
│  │  │  │  ├─ login/       # 로그인 페이지
│  │  │  │  │  ├─ basic/    # 기본 로그인
│  │  │  │  │  └─ google/    # 구글 로그인
│  │  │  │  ├─ register/    # 회원가입 페이지
│  │  │  │  ├─ find-account/ # 계정 찾기
│  │  │  │  └─ reset-password/ # 비밀번호 재설정
│  │  │  ├─ common/         # 공통 컴포넌트 및 유틸리티
│  │  │  │  ├─ components/  # 재사용 가능한 컴포넌트
│  │  │  │  │  ├─ alerts/   # 알림 컴포넌트
│  │  │  │  │  ├─ buttons/  # 버튼 컴포넌트
│  │  │  │  │  ├─ inputs/   # 입력 컴포넌트
│  │  │  │  │  ├─ layouts/  # 레이아웃 컴포넌트
│  │  │  │  │  └─ providers/ # 프로바이더 컴포넌트
│  │  │  │  ├─ config/      # 설정 파일
│  │  │  │  ├─ constants/   # 상수
│  │  │  │  ├─ store/       # 전역 상태
│  │  │  │  ├─ types/       # 타입 정의
│  │  │  │  └─ utils/       # 유틸리티 함수
│  │  │  ├─ features/       # 기능별 모듈
│  │  │  │  └─ auth/        # 인증 기능
│  │  │  │      ├─ apis/    # 인증 API
│  │  │  │      ├─ components/ # 인증 컴포넌트
│  │  │  │      ├─ hooks/   # 인증 훅
│  │  │  │      ├─ store/   # 인증 상태
│  │  │  │      └─ types/   # 인증 타입
│  │  │  ├─ components/     # React 컴포넌트
│  │  │  ├─ hooks/          # 커스텀 훅
│  │  │  ├─ services/       # API 서비스
│  │  │  ├─ store/          # 상태 관리
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

### 공통
- **패키지 관리**: Yarn Berry 4.9.4 (node_modules)
- **모노레포**: Yarn Workspaces
- **언어**: TypeScript
- **코드 품질**: ESLint + Prettier

### 백엔드
- **프레임워크**: NestJS
- **데이터베이스**: PostgreSQL + Prisma ORM
- **인증**: JWT + Passport + Google OAuth
- **API 문서**: Swagger (3-way 분리)
- **보안**: Helmet + CORS + Rate Limiting
- **데이터베이스 환경**:
  - 개발: 로컬 PostgreSQL
  - 스테이징/프로덕션: AWS RDS PostgreSQL

### 프론트엔드
- **프레임워크**: Next.js 15 + React 19
- **상태 관리**: 
  - Zustand (클라이언트 상태)
  - TanStack Query (서버 상태)
- **API 통신**: Axios + React Query
- **에러 처리**: React Error Boundary
- **스타일링**: CSS Modules (향후 Tailwind CSS 도입 예정)
- **개발 도구**: React Query DevTools

## 🚀 시작하기

### 필수 요구사항

- Node.js (v20 이상)
- Yarn (v4.9.4 이상)

### 로컬 개발 환경 데이터베이스 설정

- **[로컬 데이터베이스 가이드](<./docs/backend/데이터베이스(로컬)%20-%20가이드.md>)**: 로컬 PostgreSQL 및 Prisma ORM 관리

### 로컬 개발 환경 설치 및 실행

```bash
# 프로젝트 클론
git clone <repository-url>
cd sweet-order

# 의존성 설치(자동으로 postinstall 스크립트 실행, 이름 변경시 자동실행 안됨)
# 파일 경로에 한글이 존재하면 오류가 발생할 수 있습니다.
yarn install

# 개발 서버 시작(.env.development 환경변수 필요)
yarn backend:dev          # 백엔드 개발 서버 (포트: 3000)
yarn web-user:dev         # 사용자 웹 개발 서버 (포트: 3001)

# 데이터베이스 관리
yarn db:migrate:dev         # 백엔드 개발 데이터베이스 마이그레이션
yarn db:studio:dev         # 백엔드 개발 데이터베이스 스튜디오
yarn db:seed:dev         # 백엔드 개발 데이터베이스 시드
yarn db:reset:dev         # 백엔드 개발 데이터베이스 리셋

# 빌드 및 배포
yarn backend:build:staging     # 백엔드 스테이징 빌드
yarn backend:build:production  # 백엔드 프로덕션 빌드
yarn web-user:build            # 프론트엔드 빌드
yarn web-user:start             # 프론트엔드 프로덕션 서버 시작

# 코드 품질 검사
yarn common:lint              # ESLint 검사
yarn common:lint:fix          # ESLint 자동 수정
yarn common:format            # Prettier 포맷팅
yarn common:format:check       # Prettier 포맷팅 검사
```

## 📚 상세 문서

### 플로우 차트
- **[통합 인증 플로우 차트](./docs/common/flow-chart/인증%20-%20가이드.md)**: 통합 인증 시스템 플로우 차트

### 공통 문서

- **[Yarn Berry PnP 가이드](<./docs/common/(이전버전)yarnberry%20PnP%20-%20가이드.md>)**: Yarn Berry PnP 설정 및 사용법 (이전 버전)
- **[Yarn Berry node_modules 가이드](<./docs/common/(현재버전)yarnberry%20nodemodules%20-%20가이드.md>)**: Yarn Berry node_modules 설정 및 사용법 (현재 적용)
- **[통합 인증 가이드](./docs/common/통합%20인증%20-%20가이드.md)**: 통합 인증 시스템 사용법
- **[통합 플랫폼 인증 가이드](./docs/common/통합%20플랫폼%20인증%20-%20가이드.md)**: 통합 플랫폼 인증 시스템 사용법

### 백엔드 문서

- **[Backend README](./docs/backend/README.md)**: 백엔드 서비스 개요 및 사용법
- **[Backend 기술 스택 가이드](./docs/backend/기술%20스택%20-%20가이드.md)**: 백엔드 기술 스택 및 아키텍처
- **[Backend 환경변수 가이드](./docs/backend/환경변수%20-%20가이드.md)**: 환경변수 관리 및 보안 정책

### 프론트엔드 문서

- **[Web User README](./docs/web-user/README.md)**: 사용자 웹 애플리케이션 개요 및 사용법
- **[Web User 기술 스택 가이드](./docs/web-user/기술%20스택%20-%20가이드.md)**: 사용자 웹 애플리케이션 기술 스택
- **[Web User 에러와 로딩 처리 가이드](./docs/web-user/에러와%20로딩%20처리%20-%20가이드.md)**: 에러 처리 및 로딩 상태 관리

### 인프라 문서

- **[AWS RDS 가이드](<./docs/infra/aws/AWS%20RDS(데이터베이스)%20-%20가이드.md>)**: AWS RDS PostgreSQL 설정 및 관리
- **[AWS App Runner 가이드](<./docs/infra/aws/AWS%20App%20Runner(backend)%20-%20가이드.md>)**: AWS App Runner 백엔드 배포 가이드
- **[AWS Region 가이드](./docs/infra/aws/AWS%20Region%20-%20가이드.md)**: AWS 리전 선택 가이드
- **[AWS Route53 가이드](<./docs/infra/aws/AWS%20Route53(도메인)%20-%20가이드.md>)**: AWS Route53 도메인 설정 가이드
