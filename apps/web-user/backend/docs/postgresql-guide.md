# PostgreSQL 가이드

## 개요

PostgreSQL은 오픈소스 객체-관계형 데이터베이스 관리 시스템(ORDBMS)입니다. 이 가이드는 PostgreSQL의 핵심 개념, 설치, 설정, 그리고 Sweet Order 프로젝트에서의 활용 방법을 다룹니다.

## PostgreSQL 아키텍처

```mermaid
graph TB
    subgraph "Client Applications"
        APP1[Web Application]
        APP2[Mobile App]
        APP3[Admin Panel]
    end

    subgraph "PostgreSQL Server"
        subgraph "Connection Pooler"
            CP[pgBouncer]
        end

        subgraph "PostgreSQL Process"
            subgraph "Backend Processes"
                BP1[Postmaster]
                BP2[Backend Process 1]
                BP3[Backend Process 2]
                BP4[Backend Process N]
            end

            subgraph "Shared Memory"
                SM1[Shared Buffers]
                SM2[WAL Buffers]
                SM3[Lock Table]
            end

            subgraph "Storage"
                ST1[Data Files]
                ST2[WAL Files]
                ST3[Index Files]
            end
        end
    end

    APP1 --> CP
    APP2 --> CP
    APP3 --> CP

    CP --> BP1
    BP1 --> BP2
    BP1 --> BP3
    BP1 --> BP4

    BP2 --> SM1
    BP3 --> SM1
    BP4 --> SM1

    SM1 --> ST1
    SM2 --> ST2
    SM3 --> ST1
```

## 설치 및 설정

### macOS 설치 (Homebrew)

```bash
# PostgreSQL 설치
brew install postgresql@15

# PostgreSQL 서비스 시작
brew services start postgresql@15

# PostgreSQL 버전 확인
psql --version

# PostgreSQL에 접속
psql postgres
```

### 데이터베이스 생성

```sql
-- PostgreSQL에 접속한 후 실행
CREATE DATABASE sweet_order_db;
CREATE USER sweet_order_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sweet_order_db TO sweet_order_user;

-- 데이터베이스 연결 확인
\c sweet_order_db
\q
```

### 환경 변수 설정

```bash
# .env.development
DATABASE_URL="postgresql://sweet_order_user:your_secure_password@localhost:5432/sweet_order_db?schema=public"

# .env.staging
# .env.production
```

## 핵심 개념

### 1. 데이터 타입

PostgreSQL은 다양한 데이터 타입을 지원합니다:

#### 기본 타입

```sql
-- 숫자 타입
INTEGER, BIGINT, SMALLINT
DECIMAL(10,2), NUMERIC(10,2)
REAL, DOUBLE PRECISION

-- 문자열 타입
VARCHAR(255), TEXT
CHAR(10)

-- 날짜/시간 타입
DATE, TIME, TIMESTAMP
TIMESTAMPTZ  -- 타임존 포함

-- 불린 타입
BOOLEAN

-- JSON 타입
JSON, JSONB  -- JSONB가 더 효율적
```

#### Sweet Order 프로젝트에서 사용하는 타입

```sql
-- Prisma 스키마에서 사용하는 타입들
id        String   @id @default(cuid())  -- PostgreSQL: TEXT
email     String   @unique               -- PostgreSQL: TEXT
name      String?                        -- PostgreSQL: TEXT (nullable)
createdAt DateTime @default(now())       -- PostgreSQL: TIMESTAMPTZ
updatedAt DateTime @updatedAt            -- PostgreSQL: TIMESTAMPTZ
```

### 2. 인덱스

인덱스는 쿼리 성능을 향상시키는 중요한 요소입니다:

```sql
-- 단일 컬럼 인덱스
CREATE INDEX idx_users_email ON users(email);

-- 복합 인덱스
CREATE INDEX idx_users_email_name ON users(email, name);

-- 유니크 인덱스
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- 부분 인덱스 (조건부)
CREATE INDEX idx_active_users ON users(email) WHERE name IS NOT NULL;
```

### 3. 트랜잭션

PostgreSQL은 ACID 속성을 보장하는 트랜잭션을 지원합니다:

```sql
-- 트랜잭션 시작
BEGIN;

-- 여러 작업 수행
INSERT INTO users (email, name) VALUES ('user1@example.com', 'User 1');
INSERT INTO users (email, name) VALUES ('user2@example.com', 'User 2');

-- 커밋 또는 롤백
COMMIT;   -- 변경사항 저장
-- ROLLBACK;  -- 변경사항 취소
```

## Prisma와 PostgreSQL 연동

### Prisma 스키마 설정

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### 마이그레이션 관리

```bash
# 마이그레이션 생성
npx prisma migrate dev --name init

# 마이그레이션 적용
npx prisma migrate deploy

# 데이터베이스 리셋
npx prisma migrate reset

# Prisma Studio 실행 (GUI)
npx prisma studio
```

### NestJS에서 Prisma 사용

```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

```typescript
// src/modules/users/users.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: { email: string; name?: string }) {
    return this.prisma.user.create({
      data,
    });
  }
}
```

## 성능 최적화

### 1. 쿼리 최적화

```sql
-- EXPLAIN을 사용한 쿼리 분석
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- 인덱스 힌트
SELECT * FROM users WHERE email = 'user@example.com'
USING INDEX idx_users_email;
```

### 2. 연결 풀링

```typescript
// Prisma 연결 풀 설정
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // 연결 풀 설정
  // ?connection_limit=20&pool_timeout=20
}
```

### 3. 캐싱 전략

```typescript
// Redis와 함께 사용하는 예시
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findOne(id: string) {
    // 캐시에서 먼저 확인
    const cached = await this.redis.get(`user:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // 데이터베이스에서 조회
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    // 캐시에 저장 (5분)
    await this.redis.setex(`user:${id}`, 300, JSON.stringify(user));

    return user;
  }
}
```

## 보안 고려사항

### 1. 연결 보안

```bash
# SSL 연결 강제
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# 연결 제한
# postgresql.conf에서 max_connections 설정
max_connections = 100
```

### 2. 사용자 권한 관리

```sql
-- 읽기 전용 사용자 생성
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE sweet_order_db TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- 애플리케이션 사용자 권한 제한
REVOKE ALL ON DATABASE sweet_order_db FROM sweet_order_user;
GRANT CONNECT ON DATABASE sweet_order_db TO sweet_order_user;
GRANT USAGE ON SCHEMA public TO sweet_order_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sweet_order_user;
```

### 3. 데이터 암호화

```sql
-- 민감한 데이터 암호화
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 암호화된 컬럼 추가
ALTER TABLE users ADD COLUMN encrypted_phone BYTEA;

-- 데이터 암호화/복호화
INSERT INTO users (email, encrypted_phone)
VALUES ('user@example.com', pgp_sym_encrypt('010-1234-5678', 'encryption_key'));

SELECT email, pgp_sym_decrypt(encrypted_phone, 'encryption_key') as phone
FROM users;
```

## 모니터링 및 로깅

### 1. 성능 모니터링

```sql
-- 활성 연결 확인
SELECT * FROM pg_stat_activity;

-- 느린 쿼리 확인
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 테이블 크기 확인
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. 로그 설정

```bash
# postgresql.conf 설정
log_destination = 'stderr'
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'  # 또는 'mod' (수정 쿼리만)
log_min_duration_statement = 1000  # 1초 이상 쿼리 로깅
```

## 백업 및 복구

### 1. 백업

```bash
# 전체 데이터베이스 백업
pg_dump -h localhost -U sweet_order_user -d sweet_order_db > backup.sql

# 압축 백업
pg_dump -h localhost -U sweet_order_user -d sweet_order_db | gzip > backup.sql.gz

# 스키마만 백업
pg_dump -h localhost -U sweet_order_user -d sweet_order_db --schema-only > schema.sql

# 데이터만 백업
pg_dump -h localhost -U sweet_order_user -d sweet_order_db --data-only > data.sql
```

### 2. 복구

```bash
# 백업에서 복구
psql -h localhost -U sweet_order_user -d sweet_order_db < backup.sql

# 압축 백업에서 복구
gunzip -c backup.sql.gz | psql -h localhost -U sweet_order_user -d sweet_order_db
```

## 문제 해결

### 1. 연결 문제

```bash
# PostgreSQL 서비스 상태 확인
brew services list | grep postgresql

# 포트 확인
lsof -i :5432

# 연결 테스트
psql -h localhost -U sweet_order_user -d sweet_order_db
```

### 2. 성능 문제

```sql
-- 락 확인
SELECT * FROM pg_locks WHERE NOT granted;

-- 장시간 실행 중인 쿼리 확인
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- 인덱스 사용률 확인
SELECT
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_tup_read DESC;
```

### 3. 디스크 공간 문제

```sql
-- 데이터베이스 크기 확인
SELECT pg_size_pretty(pg_database_size('sweet_order_db'));

-- 테이블별 크기 확인
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- WAL 파일 정리
SELECT pg_switch_wal();  -- PostgreSQL 13+
-- 또는
SELECT pg_switch_xlog();  -- PostgreSQL 12 이하
```

## 모범 사례

### 1. 스키마 설계

- **정규화**: 적절한 수준의 정규화 유지
- **인덱스**: 자주 조회되는 컬럼에 인덱스 생성
- **제약조건**: 데이터 무결성을 위한 제약조건 설정
- **네이밍**: 일관된 네이밍 컨벤션 사용

### 2. 쿼리 최적화

- **EXPLAIN 사용**: 쿼리 실행 계획 분석
- **인덱스 활용**: 적절한 인덱스 사용
- **N+1 문제 방지**: JOIN 또는 include 사용
- **페이징**: 대용량 데이터 조회 시 LIMIT/OFFSET 사용

### 3. 운영 관리

- **정기 백업**: 자동화된 백업 시스템 구축
- **모니터링**: 성능 및 리소스 모니터링
- **업데이트**: 정기적인 PostgreSQL 업데이트
- **보안**: 최소 권한 원칙 적용

## Sweet Order 프로젝트 특화 설정

### 1. 프로젝트별 스크립트

```json
// package.json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:migrate:reset": "prisma migrate reset",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```

### 2. 환경별 설정

```typescript
// src/config/database.config.ts
export const databaseConfig = {
  development: {
    url: process.env.DATABASE_URL,
    logging: true,
  },
  staging: {
    url: process.env.DATABASE_URL,
    logging: false,
    ssl: { rejectUnauthorized: false },
  },
  production: {
    url: process.env.DATABASE_URL,
    logging: false,
    ssl: { rejectUnauthorized: false },
    connectionLimit: 20,
  },
};
```

## 참고 자료

- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [PostgreSQL 튜토리얼](https://www.postgresqltutorial.com/)
- [Prisma PostgreSQL 가이드](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

## 관련 문서

- [NestJS 가이드](./nestjs-guide.md)
- [데이터베이스 설정 가이드](../DATABASE_SETUP.md)
- [환경 변수 설정 가이드](../ENV_SETUP.md)
