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

## Prisma와 PostgreSQL 연동

### Prisma 스키마 설정

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
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
import { PrismaClient } from "@prisma/client";

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

```

## 참고 자료

- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [PostgreSQL 튜토리얼](https://www.postgresqltutorial.com/)
- [Prisma PostgreSQL 가이드](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

## 관련 문서

- [NestJS 가이드](./nestjs-guide.md)
```
