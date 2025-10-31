# Sweet Order Backend

Sweet Order 플랫폼을 위한 NestJS 백엔드 서비스입니다. 3-way 분리된 API 구조로 User, Seller, Admin 역할별로 독립적인 API를 제공합니다.

## 🏗️ 주요 기능

### ✅ 구현 완료

- **3-way API 분리**: User, Seller, Admin 역할별 독립적인 API
- **통합 인증 시스템**: JWT + Google OAuth + 휴대폰 인증
- **상품 관리**: 상품 CRUD, 좋아요, 필터링, 검색 기능
- **사업자진위확인**: 국세청 API 연동을 통한 사업자등록번호 진위확인
- **역할 기반 접근 제어**: 통합 `@Auth` 데코레이터로 권한 관리
- **데이터베이스**: Prisma ORM + PostgreSQL
- **API 문서**: Swagger 3-way 분리 문서
- **보안**: Rate Limiting, CORS, Helmet

### 🔄 개발 중

- 주문 관리 시스템
- 결제 연동
- 파일 업로드
- Admin API 확장

## 📚 상세 문서

자세한 개발 가이드와 API 문서는 `/docs` 폴더를 참고하세요:

## 🔗 API 엔드포인트

### User API (`/v1/user`)

- **인증**: `/v1/user/auth/*` - 로그인, 회원가입, 휴대폰 인증
- **상품**: `/v1/user/products/*` - 상품 조회, 좋아요

### Seller API (`/v1/seller`)

- **상품**: `/v1/seller/products/*` - 상품 관리 (삭제 등)
- **사업**: `/v1/seller/business/*` - 사업자등록번호 진위확인

### Admin API (`/v1/admin`)

- **관리**: 향후 구현 예정

### API 문서

- **User API**: http://localhost:3000/v1/docs/user
- **Seller API**: http://localhost:3000/v1/docs/seller
- **Admin API**: http://localhost:3000/v1/docs/admin
