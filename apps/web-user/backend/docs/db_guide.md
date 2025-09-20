# 데이터베이스 관리 가이드

## 환경별 데이터베이스 설정

### 개발 환경 (Development)
- **데이터베이스**: 로컬 PostgreSQL
- **연결 방식**: 직접 연결
- **용도**: 로컬 개발 및 테스트

### 스테이징 환경 (Staging)
- **데이터베이스**: AWS RDS PostgreSQL
- **연결 방식**: Prisma Accelerate
- **용도**: 배포 전 검증 및 테스트

### 프로덕션 환경 (Production)
- **데이터베이스**: AWS RDS PostgreSQL (Multi-AZ)
- **연결 방식**: Prisma Accelerate
- **용도**: 실제 서비스 운영

## 명령어 사용법

### 개발 환경
```bash
# 스키마 동기화
yarn run db:push

# 마이그레이션 생성 및 적용
yarn run db:migrate

# 시드 데이터 삽입
yarn run db:seed

# Prisma Studio 실행
yarn run db:studio

# 마이그레이션 상태 확인
yarn run db:status
```

### 스테이징 환경
```bash
# 스키마 동기화
yarn run db:push:staging

# 마이그레이션 적용
yarn run db:migrate:staging

# 시드 데이터 삽입
yarn run db:seed:staging

# Prisma Studio 실행
yarn run db:studio:staging

# 배포 (마이그레이션 + 클라이언트 생성)
yarn run db:deploy:staging

# 백업 생성
yarn run db:backup:staging
```

### 프로덕션 환경
```bash
# 마이그레이션 배포 (안전한 배포)
yarn run db:migrate:deploy

# Prisma Studio 실행 (읽기 전용 권장)
yarn run db:studio:production

# 배포 (마이그레이션 + 클라이언트 생성)
yarn run db:deploy:production

# 백업 생성
yarn run db:backup:production
```

## AWS RDS 확장성 고려사항

### 1. 데이터베이스 연결 최적화
- **Prisma Accelerate**: 쿼리 캐싱 및 연결 풀링
- **Connection Pooling**: 동시 연결 수 제한
- **Read Replicas**: 읽기 전용 쿼리 분산

### 2. 환경별 설정
```bash
# 개발: 로컬 PostgreSQL
DATABASE_URL="postgresql://user:pass@localhost:5432/dev_db"

# 스테이징: AWS RDS + Accelerate
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=staging_key"

# 프로덕션: AWS RDS Multi-AZ + Accelerate
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=prod_key"
```

### 3. 보안 설정
- **SSL 연결**: 프로덕션에서 필수
- **VPC**: 데이터베이스를 VPC 내부에 배치
- **IAM 역할**: 애플리케이션에서 IAM 역할 사용
- **암호화**: 저장 시 및 전송 시 암호화

### 4. 모니터링 및 백업
- **CloudWatch**: 데이터베이스 메트릭 모니터링
- **자동 백업**: RDS 자동 백업 설정
- **Point-in-Time Recovery**: 특정 시점 복구
- **Multi-AZ**: 고가용성 보장

## 마이그레이션 전략

### 1. 개발 단계
```bash
# 스키마 변경 후
yarn run db:migrate  # 마이그레이션 파일 생성 및 적용
```

### 2. 스테이징 배포
```bash
# 마이그레이션 상태 확인
yarn run db:status:staging

# 마이그레이션 적용
yarn run db:deploy:staging
```

### 3. 프로덕션 배포
```bash
# 백업 생성
yarn run db:backup:production

# 마이그레이션 적용 (Zero-downtime)
yarn run db:deploy:production
```

## 트러블슈팅

### 연결 오류
1. 환경변수 확인: `echo $DATABASE_URL`
2. 네트워크 연결 확인
3. AWS 보안 그룹 설정 확인

### 마이그레이션 오류
1. 마이그레이션 상태 확인: `yarn run db:status`
2. 충돌 해결: `yarn run db:migrate:reset` (개발 환경만)
3. 수동 마이그레이션: `yarn run db:migrate:deploy`

### 성능 이슈
1. Prisma Accelerate 사용
2. 쿼리 최적화
3. 인덱스 추가
4. Read Replica 활용
