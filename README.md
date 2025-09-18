# Sweet Order

Yarn Workspace + Turbo 기반 모노레포 프로젝트로 구성된 디저트 주문 플랫폼입니다.

## 📁 프로젝트 구조

```
sweet-order/
├─ .yarn/                   # Yarn 패키지 매니저
├─ .yarnrc.yml              # Yarn 설정
├─ package.json             # 루트 설정
├─ tsconfig.base.json       # TypeScript 설정
├─ turbo.json               # Turbo 설정
├─ .eslintrc.js             # ESLint 설정
├─ .prettierrc.js           # Prettier 설정
├─ .cursorignore            # Cursor IDE 설정
├─ apps/                    # 애플리케이션들
│  ├─ web-user/             # 사용자 웹
│  │  ├─ frontend/
│  │  └─ backend/           # 사용자 웹 백엔드 (NestJS + TypeScript)
│  ├─ web-seller/           # 판매자 웹
│  │  ├─ frontend/
│  ├─ web-admin/            # 관리자 웹
│  │  ├─ frontend/
│  ├─ app-user/             # 사용자 모바일 앱
│  └─ app-seller/           # 판매자 모바일 앱
└─ packages/                # 공유 패키지들
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

- **패키지 매니저**: Yarn Workspace
- **빌드 시스템**: Turbo
- **언어**: TypeScript
- **아키텍처**: 모노레포
- **코드 품질**: ESLint + Prettier

## 📝 개발 가이드

1. **공통 로직**: `packages/` 디렉토리에 모듈화하여 재사용성 극대화
2. **타입 정의**: `packages/types/`에서 중앙 집중식 관리
3. **코드 품질**: 모든 변경사항은 린트와 타입 체크를 통과해야 함
4. **환경 설정**: 각 앱의 `.env.{environment}` 파일에서 환경별 관리

## 🚀 시작하기

### 필수 요구사항

- Node.js (v20 이상)
- Yarn (모노레포 패키지 매니저)

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd sweet-order
yarn install
```

### 2. 개발 서버 시작

```bash
# 모든 앱 개발 서버 시작
yarn dev

# 또는 특정 앱만 실행
cd apps/web-user/backend
yarn dev
```

## 📚 각 앱별 상세 문서

### Web User Backend

현재 구현된 백엔드 서비스에 대한 상세한 정보는 [Web User Backend README](./apps/web-user/backend/README.md)를 참조하세요.

### 향후 구현 예정

- **Web Seller Backend**: 판매자용 백엔드 서비스
- **Web Admin Backend**: 관리자용 백엔드 서비스
- **Frontend Applications**: Next.js 기반 웹 애플리케이션들
- **Mobile Applications**: React Native 기반 모바일 애플리케이션들
