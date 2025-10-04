# Sweet Order Web User Backend

Sweet Order 웹 사용자 애플리케이션을 위한 NestJS 백엔드 서비스입니다.

## 🚀 빠른 시작

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# API 문서 확인
# http://localhost:3000/docs
```

### 데이터베이스 설정

```bash
# 마이그레이션 실행
yarn db:migrate:dev

# 시드 데이터 생성
yarn db:seed:dev

# Prisma Studio 실행
yarn db:studio:dev
```

## 🏗️ 주요 기능

### ✅ 구현 완료

- **인증 시스템**: JWT 기반 로그인/회원가입, 구글 소셜 로그인, 휴대폰 인증
- **상품 관리**: 상품 목록/상세 조회, 필터링, 검색, 좋아요 기능
- **데이터베이스**: Prisma ORM + PostgreSQL
- **API 문서**: Swagger 자동 생성
- **보안**: Rate Limiting, CORS, Helmet

### 🔄 개발 중

- 주문 관리 시스템
- 결제 연동
- 파일 업로드

## 📁 프로젝트 구조

```
src/
├── app.module.ts              # 루트 모듈
├── main.ts                    # 애플리케이션 진입점
├── common/                    # 공통 모듈
│   ├── decorators/           # 커스텀 데코레이터
│   ├── interceptors/         # 응답 인터셉터
│   ├── types/                # 타입 정의
│   └── utils/                # 유틸리티 함수
├── database/                  # 데이터베이스
│   ├── database.module.ts    # DB 모듈
│   └── prisma.service.ts     # Prisma 서비스
└── modules/                   # 기능 모듈
    ├── auth/                 # 인증 모듈
    └── product/              # 상품 모듈
```

## 📚 상세 문서

자세한 개발 가이드와 API 문서는 `/docs` 폴더를 참고하세요:

- [NestJS 가이드](./docs/NestJS%20-%20가이드.md)
- [데이터베이스 가이드](./docs/데이터베이스%20-%20가이드.md)
- [통합 로그인 및 회원가입 가이드](./docs/통합%20로그인%20및%20회원가입%20-%20가이드.md)
