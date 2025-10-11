# Sweet Order Backend

Sweet Order 플랫폼을 위한 NestJS 백엔드 서비스입니다. 3-way 분리된 API 구조로 User, Seller, Admin 역할별로 독립적인 API를 제공합니다.

## 🚀 빠른 시작

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# API 문서 확인
# User API: http://localhost:3000/v1/docs/user
# Seller API: http://localhost:3000/v1/docs/seller
# Admin API: http://localhost:3000/v1/docs/admin
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

- **3-way API 분리**: User, Seller, Admin 역할별 독립적인 API
- **통합 인증 시스템**: JWT + Google OAuth + 휴대폰 인증
- **상품 관리**: 상품 CRUD, 좋아요, 필터링, 검색 기능
- **역할 기반 접근 제어**: 통합 `@Auth` 데코레이터로 권한 관리
- **데이터베이스**: Prisma ORM + PostgreSQL
- **API 문서**: Swagger 3-way 분리 문서
- **보안**: Rate Limiting, CORS, Helmet

### 🔄 개발 중

- 주문 관리 시스템
- 결제 연동
- 파일 업로드
- Admin API 확장

## 📁 프로젝트 구조

```
src/
├── app.module.ts              # 루트 모듈
├── main.ts                    # 애플리케이션 진입점
├── apis/                      # API 모듈들 (3-way 분리)
│   ├── user/                  # User API 모듈
│   │   ├── controllers/       # User 컨트롤러들
│   │   └── user-api.module.ts
│   ├── seller/                # Seller API 모듈
│   │   ├── controllers/       # Seller 컨트롤러들
│   │   └── seller-api.module.ts
│   └── admin/                 # Admin API 모듈
│       ├── controllers/       # Admin 컨트롤러들 (비어있음)
│       └── admin-api.module.ts
├── modules/                   # 비즈니스 로직 모듈
│   ├── auth/                 # 인증 모듈
│   │   ├── auth.module.ts    # 인증 모듈
│   │   ├── auth.service.ts   # 인증 서비스
│   │   ├── constants/        # 인증 상수
│   │   ├── decorators/       # 통합 인증 데코레이터
│   │   ├── dto/              # 인증 DTO
│   │   ├── guards/           # 인증 가드
│   │   ├── services/         # 인증 서비스들
│   │   ├── strategies/       # JWT 전략
│   │   ├── types/           # 인증 타입
│   │   └── utils/            # 인증 유틸리티
│   └── product/              # 상품 모듈
│       ├── constants/        # 상품 상수
│       ├── dto/             # 상품 DTO
│       ├── product.module.ts # 상품 모듈
│       ├── product.service.ts # 상품 서비스
│       ├── services/        # 상품 서비스들
│       └── utils/           # 상품 유틸리티
├── common/                    # 공통 모듈
│   ├── constants/            # 공통 상수
│   ├── decorators/           # 커스텀 데코레이터
│   ├── interceptors/         # 응답 인터셉터
│   ├── types/               # 공통 타입
│   └── utils/                # 유틸리티 함수
├── infra/                     # 인프라 설정
│   └── database/             # 데이터베이스
│       ├── database.module.ts
│       ├── prisma.service.ts
│       └── prisma/           # Prisma 스키마 및 마이그레이션
└── config/                    # 설정 파일들
    └── swagger.config.ts     # Swagger 설정
```

## 📚 상세 문서

자세한 개발 가이드와 API 문서는 `/docs` 폴더를 참고하세요:

## 🔗 API 엔드포인트

### User API (`/v1/user`)

- **인증**: `/v1/user/auth/*` - 로그인, 회원가입, 휴대폰 인증
- **상품**: `/v1/user/products/*` - 상품 조회, 좋아요

### Seller API (`/v1/seller`)

- **상품**: `/v1/seller/products/*` - 상품 관리 (삭제 등)

### Admin API (`/v1/admin`)

- **관리**: 향후 구현 예정

### API 문서

- **User API**: http://localhost:3000/v1/docs/user
- **Seller API**: http://localhost:3000/v1/docs/seller
- **Admin API**: http://localhost:3000/v1/docs/admin
