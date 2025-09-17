# Sweet Order

Yarn 4 + Turbo 기반 모노레포 프로젝트

## 📁 프로젝트 구조

```
sweet-order/
├─ .yarn/                   # Yarn 4 패키지 매니저
├─ .yarnrc.yml              # Yarn 4 설정
├─ package.json             # 루트 설정
├─ tsconfig.base.json       # TypeScript 설정
├─ turbo.json               # Turbo 설정
├─ .eslintrc.js             # ESLint 설정
├─ .prettierrc.js           # Prettier 설정
├─ .cursorignore            # Cursor IDE 설정
├─ apps/                    # 애플리케이션들
│  ├─ web-user/             # 사용자 웹 (frontend + backend)
│  │  ├─ frontend/          # 사용자 웹 프론트엔드
│  │  └─ backend/           # 사용자 웹 백엔드 (Express.js + TypeScript)
│  ├─ web-seller/           # 판매자 웹 (frontend + backend)
│  │  ├─ frontend/
│  │  └─ backend/
│  ├─ web-admin/            # 관리자 웹 (frontend + backend)
│  │  ├─ frontend/
│  │  └─ backend/
│  ├─ app-user/             # 사용자 모바일 앱
│  └─ app-seller/           # 판매자 모바일 앱
└─ packages/                # 공유 패키지들 (향후 확장 예정)
   ├─ ui/                   # 공통 UI 컴포넌트
   ├─ utils/                # 유틸리티 함수들
   ├─ types/                # TypeScript 타입 정의
   └─ config/               # 공통 설정

```

## 🚀 주요 명령어

```bash
# (루트경로에서만) 의존성 설치
yarn install

# 개발 서버 시작 (모든 앱)
yarn dev

# 스테이징 서버 시작
yarn staging

# 프로덕션 서버 시작
yarn production

# 개발용 빌드
yarn build:dev

# 스테이징용 빌드
yarn build:staging

# 프로덕션용 빌드
yarn build:production

# 개발용 서버 실행
yarn serve:dev

# 스테이징용 서버 실행
yarn serve:staging

# 프로덕션용 서버 실행
yarn serve:production

# 린트 검사
yarn lint

# 타입 체크
yarn typecheck

# 코드 포맷팅
yarn format

# 포맷팅 검사
yarn format:check
```

## 🛠 기술 스택

### 공통

- **패키지 매니저**: Yarn 4
- **빌드 시스템**: Turbo
- **언어**: TypeScript
- **아키텍처**: 모노레포
- **코드 품질**: ESLint + Prettier

### Web User Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **보안**: Helmet, CORS
- **로깅**: Morgan
- **환경 관리**: dotenv

## 📝 개발 가이드

1. 공통 로직은 `packages/` 디렉토리에 모듈화 (향후 확장)
2. 타입 정의는 `packages/types/`에서 관리
3. UI 컴포넌트는 `packages/ui/`에서 재사용 가능하게 개발
4. 모든 변경사항은 린트와 타입 체크를 통과해야 함
5. 환경별 설정은 각 앱의 `.env.{environment}` 파일에서 관리

## 🚀 시작하기

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd sweet-order
yarn install
```

### 2. Web User Backend 실행

```bash
# 개발 서버 시작
yarn dev

# 또는 특정 앱만 실행
cd apps/web-user/backend
yarn dev
```

### 3. 환경 설정

각 앱의 환경 변수 파일을 확인하고 필요한 설정을 추가하세요:

- `apps/web-user/backend/.env.development`
- `apps/web-user/backend/.env.staging`
- `apps/web-user/backend/.env.production`
