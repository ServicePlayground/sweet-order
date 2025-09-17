# Web User Backend

Sweet Order 프로젝트의 Web User 백엔드 서버입니다.

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **보안**: Helmet, CORS
- **로깅**: Morgan
- **환경 관리**: dotenv
- **개발 도구**: tsx (TypeScript 실행기)
- **Database**: PostgreSQL (향후 Prisma ORM 추가 예정)
- **Containerization**: Docker (향후 추가 예정)

## 프로젝트 구조

```
src/
├── config/          # 환경 설정
├── controllers/     # 컨트롤러
├── middleware/      # 미들웨어
├── routes/          # 라우트
├── services/        # 비즈니스 로직
├── types/           # 타입 정의
├── utils/           # 유틸리티 함수
└── index.ts         # 서버 진입점
```

## 시작하기

### 1. 의존성 설치

```bash
# 루트에서 전체 프로젝트 의존성 설치
yarn install

# 또는 이 디렉토리에서만 설치
cd apps/web-user/backend
yarn install
```

### 2. 환경 변수 설정

환경별 설정 파일이 이미 준비되어 있습니다:

- `.env.development` - 개발 환경
- `.env.staging` - 스테이징 환경
- `.env.production` - 프로덕션 환경

필요에 따라 각 파일을 편집하여 환경 변수를 설정하세요.

### 3. 개발 서버 실행

```bash
# 개발 환경으로 실행
yarn dev

# 스테이징 환경으로 실행
yarn staging

# 프로덕션 환경으로 실행
yarn production
```

서버는 `http://localhost:3000`에서 실행됩니다.

### 4. 빌드

```bash
# 개발용 빌드
yarn build:dev

# 스테이징용 빌드
yarn build:staging

# 프로덕션용 빌드
yarn build:production
```

### 5. 프로덕션 서버 실행

```bash
# 개발용 서버 실행
yarn serve:dev

# 스테이징용 서버 실행
yarn serve:staging

# 프로덕션용 서버 실행
yarn serve:production
```

## API 엔드포인트

### Health Check

- `GET /api/health` - 서버 상태 확인

## 개발 도구

### 코드 품질

```bash
# 린트 검사
yarn lint

# 타입 체크
yarn typecheck

# 코드 포맷팅
yarn format

# 포맷팅 검사
yarn format:check
```

## 환경 설정

현재 지원하는 환경:

- **Development**: 개발 환경 (기본값)
- **Staging**: 스테이징 환경
- **Production**: 프로덕션 환경

각 환경별로 다른 설정을 사용할 수 있으며, `NODE_ENV` 환경 변수로 제어됩니다.

## 향후 계획

- [ ] PostgreSQL + Prisma ORM 설정
- [ ] Docker 컨테이너화
- [ ] JWT 인증 시스템
- [ ] API 문서화 (Swagger)
- [ ] 로깅 시스템 개선
- [ ] 테스트 코드 작성 (Jest)
- [ ] API 버전 관리
- [ ] 레이트 리미팅
- [ ] 캐싱 시스템 (Redis)
