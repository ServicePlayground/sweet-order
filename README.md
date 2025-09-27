# Sweet Order

Yarn Workspace + Turbo 기반 모노레포 프로젝트로 구성된 디저트 주문 플랫폼입니다.

## 📁 프로젝트 구조

```
sweet-order/
├─ package.json             # 루트 설정
├─ tsconfig.base.json       # TypeScript 설정
├─ turbo.json               # Turbo 설정
├─ yarn.lock                # Yarn 의존성 잠금 파일
├─ dist/                    # 빌드 결과물
├─ node_modules/            # 루트 의존성
├─ apps/                    # 애플리케이션들
│  └─ web-user/             # 사용자 웹 애플리케이션
│     ├─ frontend/          # 사용자 웹 프론트엔드 (구현 예정)
│     └─ backend/           # 사용자 웹 백엔드 (NestJS + TypeScript)
│        ├─ src/            # 소스 코드
│        ├─ prisma/         # 데이터베이스 스키마 및 마이그레이션
│        ├─ docs/           # 백엔드 문서
│        └─ package.json    # 백엔드 의존성
└─ (향후 추가 예정)
   ├─ apps/web-seller/      # 판매자 웹
   ├─ apps/web-admin/       # 관리자 웹
   ├─ apps/app-user/        # 사용자 모바일 앱
   ├─ apps/app-seller/      # 판매자 모바일 앱
   └─ packages/             # 공유 패키지들
```

## 🚀 주요 명령어

```bash
# (루트경로에서만) 의존성 설치
yarn install

# 개발 서버 시작 (모든 앱)
yarn dev

# 스테이징 서버 시작
yarn staging

# 스테이징용 빌드
yarn build:staging

# 프로덕션용 빌드
yarn build:production

# 린트 검사
yarn lint

# 타입 체크
yarn typecheck

# 코드 포맷팅
yarn format

# 포맷팅 검사
yarn format:check
```

### 백엔드 전용 명령어

```bash
# 백엔드 디렉토리로 이동
cd apps/web-user/backend

# 개발 환경 데이터베이스 마이그레이션
yarn db:migrate:dev

# 개발 환경 데이터베이스 리셋
yarn db:reset:dev

# 개발 환경 시드 데이터 삽입
yarn db:seed:dev

# Prisma Studio 실행 (데이터베이스 GUI)
yarn db:studio:dev

# 스테이징 환경 데이터베이스 배포
yarn db:deploy:staging

# 프로덕션 환경 데이터베이스 배포
yarn db:deploy:production
```

## 🛠 기술 스택

### 전체 프로젝트

- **패키지 매니저**: Yarn Workspace
- **빌드 시스템**: Turbo
- **언어**: TypeScript
- **아키텍처**: 모노레포
- **코드 품질**: ESLint + Prettier

### Web User Backend (현재 구현됨)

- **프레임워크**: NestJS
- **데이터베이스**: PostgreSQL + Prisma ORM
- **인증**: JWT + Passport
- **API 문서**: Swagger
- **보안**: Helmet, bcrypt
- **로깅**: Morgan
- **환경 관리**: dotenv-cli

## 📝 개발 가이드

1. **모노레포 구조**: Yarn Workspace와 Turbo를 활용한 효율적인 의존성 관리
2. **코드 품질**: 모든 변경사항은 린트와 타입 체크를 통과해야 함
3. **환경 설정**: 각 앱의 `.env.{environment}` 파일에서 환경별 관리
4. **데이터베이스**: Prisma를 통한 타입 안전한 데이터베이스 접근
5. **API 문서**: Swagger를 통한 자동 API 문서화

## 🚀 시작하기

### 필수 요구사항

- Node.js (v20 이상)
- Yarn (v4.9.4 이상)
- PostgreSQL (데이터베이스)

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd sweet-order
yarn install
```

### 2. 환경 설정

```bash
# 백엔드 환경 설정 파일 생성
cd apps/web-user/backend
cp .env.example .env.development
# .env.development 파일에서 데이터베이스 연결 정보 설정
```

### 3. 데이터베이스 설정

```bash
# 데이터베이스 마이그레이션 실행
yarn db:migrate:dev

# 시드 데이터 삽입 (선택사항)
yarn db:seed:dev
```

### 4. 개발 서버 시작

```bash
# 루트에서 모든 앱 개발 서버 시작
yarn dev

# 또는 백엔드만 실행
cd apps/web-user/backend
yarn dev
```

## 📚 각 앱별 상세 문서

### Web User Backend (현재 구현됨)

현재 구현된 백엔드 서비스에 대한 상세한 정보는 다음 문서들을 참조하세요:

- **[Web User Backend README](./apps/web-user/backend/README.md)**: 백엔드 서비스 개요
- **[NestJS 가이드](./apps/web-user/backend/docs/NestJS%20-%20가이드.md)**: NestJS 프레임워크 사용법
- **[데이터베이스 가이드](./apps/web-user/backend/docs/데이터베이스%20-%20가이드.md)**: Prisma ORM 및 데이터베이스 관리
- **[통합 로그인 및 회원가입 가이드](./apps/web-user/backend/docs/통합%20로그인%20및%20회원가입%20-%20가이드.md)**: 인증 시스템 구현

### 향후 구현 예정

- **Web User Frontend**: Next.js 기반 사용자 웹 애플리케이션
- **Web Seller Backend**: 판매자용 백엔드 서비스
- **Web Seller Frontend**: 판매자용 웹 애플리케이션
- **Web Admin Backend**: 관리자용 백엔드 서비스
- **Web Admin Frontend**: 관리자용 웹 애플리케이션
- **App User**: React Native 기반 사용자 모바일 앱
- **App Seller**: React Native 기반 판매자 모바일 앱
- **Packages**: 공유 패키지들 (UI 컴포넌트, 유틸리티, 타입 정의 등)
