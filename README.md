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
├─ apps/                    # 애플리케이션들
│  ├─ web-user/             # 사용자 웹 (frontend + backend)
│  │  ├─ frontend/          
│  │  └─ backend/
│  ├─ web-seller/           # 판매자 웹 (frontend + backend)
│  │  ├─ frontend/
│  │  └─ backend/
│  ├─ web-admin/            # 관리자 웹 (frontend + backend)
│  │  ├─ frontend/
│  │  └─ backend/
│  ├─ app-user/             # 사용자 모바일 앱
│  └─ app-seller/           # 판매자 모바일 앱
└─ packages/                # 공유 패키지들
   ├─ ui/                   # 공통 UI 컴포넌트
   ├─ utils/                # 유틸리티 함수들
   ├─ types/                # TypeScript 타입 정의
   ├─ config/               # 공통 설정
   ├─ tsconfig/             # TypeScript 설정
   └─ eslint-config/        # ESLint 설정

```

## 🚀 주요 명령어

```bash
# 개발 서버 시작
yarn dev

# 빌드
yarn build

# 린트 검사
yarn lint

# 타입 체크
yarn typecheck

# 테스트 실행
yarn test
```

## 🛠 기술 스택

- **패키지 매니저**: Yarn 4
- **빌드 시스템**: Turbo
- **언어**: TypeScript
- **아키텍처**: 모노레포

## 📝 개발 가이드

1. 공통 로직은 `packages/` 디렉토리에 모듈화
2. 타입 정의는 `packages/types/`에서 관리
3. UI 컴포넌트는 `packages/ui/`에서 재사용 가능하게 개발
4. 모든 변경사항은 린트와 타입 체크를 통과해야 함
