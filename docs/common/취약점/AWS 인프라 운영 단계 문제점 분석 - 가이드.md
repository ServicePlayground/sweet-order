# AWS 인프라 운영 단계 문제점 분석

## 📋 개요

본 문서는 SweetOrder 프로젝트의 AWS 인프라 문서를 분석하여, 실제 운영 단계에서 발생할 수 있는 문제점들을 정리한 가이드입니다.

---

## 🔴 심각한 문제점 (즉시 조치 필요)

### 1. 보안: 루트 계정 사용 권장

**위치**: GitHub Actions 워크플로우 및 EC2 접근 설정

**문제점**:

- GitHub Actions에서 EC2에 SSH 접속 시 루트 계정 또는 과도한 권한을 가진 사용자 사용 가능
- EC2 인스턴스 접근 권한 관리 부족

**위험성**:

- 루트 계정의 액세스 키가 유출되면 전체 AWS 계정이 위험에 노출됨
- 루트 계정은 모든 권한을 가지고 있어, 실수로 인한 대규모 리소스 삭제 가능
- AWS 보안 모범 사례 위반

**해결 방안**:

1. IAM 사용자 생성 (최소 권한 원칙 적용)
2. 필요한 권한만 부여:
   - `AmazonEC2FullAccess` (EC2 관리, GitHub Actions 배포용)
   - `SecretsManagerReadWrite` (Secrets Manager 접근)
   - S3 버킷 접근 권한 (파일 업로드용)
3. EC2 인스턴스에 전용 IAM 역할 부여 (SSH 키 대신)
4. MFA(Multi-Factor Authentication) 활성화
5. 액세스 키 정기적 로테이션

---

### 2. 가용성: EC2 단일 인스턴스 및 PostgreSQL 단일 설치

**위치**: `EC2_Route53_S3_CloudFront.md` 1단계

**문제점**:

- EC2 인스턴스가 단일 인스턴스로 배포됨
- PostgreSQL이 EC2에 직접 설치되어 단일 장애점 존재
- EC2 인스턴스 장애 시 전체 서비스 다운타임 발생
- 자동 장애 조치 불가능

**위험성**:

- EC2 인스턴스 장애 시 전체 애플리케이션 및 데이터베이스 다운타임 발생
- 데이터베이스 백업 복구 시간이 길어짐 (수동 복구 필요)
- 운영 환경에서 허용 불가능한 수준의 가용성

**해결 방안**:

1. **Production 환경**: 
   - EC2 Auto Scaling Group 구성 (최소 2개 인스턴스)
   - 또는 RDS Multi-AZ로 데이터베이스 분리 (비용 증가)
   - Application Load Balancer를 통한 로드 밸런싱
2. **Staging 환경**: 단일 인스턴스 유지 가능 (비용 절감)
3. 정기적인 EC2 스냅샷 및 PostgreSQL 백업 설정
4. 데이터베이스 백업 자동화 (cron 작업)

---

### 3. 성능: EC2 버스터블 클래스 사용

**위치**: `EC2_Route53_S3_CloudFront.md` 1.1번 항목

**문제점**:

```
- 인스턴스 타입: t3.small
```

**위험성**:

- 버스터블 클래스는 CPU 크레딧 기반으로 작동
- CPU 크레딧이 소진되면 성능이 급격히 저하됨
- 트래픽이 증가하면 크레딧 부족으로 인한 성능 저하 발생
- 애플리케이션과 데이터베이스가 같은 인스턴스에서 실행되어 리소스 경합 가능
- 운영 환경에서 예측 불가능한 성능 저하

**해결 방안**:

1. **Production 환경**:
   - `t3.medium` 이상 사용 (더 많은 크레딧)
   - 또는 `t4g.medium` (ARM 기반, 비용 효율적)
   - 애플리케이션과 데이터베이스를 별도 인스턴스로 분리 고려
2. **Staging 환경**: `t3.small` 유지 가능
3. CloudWatch 알람 설정:
   - CPU 크레딧 잔여량 모니터링
   - CPU 사용률 모니터링
   - 메모리 사용률 모니터링

---

### 4. Health Check 엔드포인트 검증 부족

**위치**: `main.ts` 51-53번 라인, Nginx 설정

**현재 구현**:

```typescript
httpAdapter.getInstance().get("/health", (_req: any, res: any) => {
  res.status(200).send("OK");
});
```

**문제점**:

- 단순히 "OK"만 반환하여 실제 애플리케이션 상태를 확인하지 않음
- 데이터베이스 연결 상태 미확인
- 메모리/디스크 상태 미확인
- 의존성 서비스(S3, Secrets Manager) 상태 미확인
- PM2 프로세스 상태 미확인

**위험성**:

- 데이터베이스 연결이 끊어져도 Health Check가 성공으로 표시됨
- Nginx가 비정상 백엔드 인스턴스에 트래픽을 계속 라우팅
- PM2 프로세스가 다운되어도 Health Check가 성공으로 표시될 수 있음
- 실제 장애 발생 시 감지 불가

**해결 방안**:

1. Health Check 엔드포인트 개선:
   ```typescript
   // 데이터베이스 연결 확인
   // 메모리 사용량 확인
   // 의존성 서비스 상태 확인
   // PM2 프로세스 상태 확인
   ```
2. Liveness vs Readiness 구분:
   - `/health/live`: 애플리케이션 프로세스 상태 (PM2 상태 확인)
   - `/health/ready`: 서비스 준비 상태 (DB 연결 등)
3. Nginx에서 Health Check 실패 시 백엔드로 트래픽 라우팅 중단

---

## 🟡 중간 수준 문제점 (단기 조치 권장)

### 5. S3 CORS 설정에 Production 도메인 누락

**위치**: `AWS S3(정적), CloudFront(CDN) - 가이드.md` 19-29번 항목

**현재 설정**:

```json
"AllowedOrigins": [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://staging.sweetorders.com",
  "https://seller-staging.sweetorders.com",
  "https://admin-staging.sweetorders.com"
]
```

**문제점**:

- Production 도메인이 CORS 설정에 포함되지 않음
- Production 환경에서 S3 직접 접근 시 CORS 오류 발생 가능

**해결 방안**:

1. Production 도메인 추가:
   - `https://www.sweetorders.com`
   - `https://seller.sweetorders.com`
   - `https://admin.sweetorders.com`
2. 환경별 버킷 분리 시 각 버킷에 해당 환경 도메인만 설정

---

### 6. CloudFront SSL 인증서 리전 불일치

**위치**: `AWS S3(정적), CloudFront(CDN) - 가이드.md` 62-64번 항목

**문제점**:

```
(SSL 인증서 요청) AWS > Certificate Manager > 인증서 요청
- (us-east-1)
```

**설명**:

- CloudFront는 글로벌 서비스이므로 SSL 인증서는 `us-east-1` 리전에 발급해야 함
- 하지만 다른 AWS 리소스는 `ap-northeast-1` (도쿄) 리전 사용

**위험성**:

- 리전 관리 복잡도 증가
- 인증서 갱신 시 리전 확인 필요
- 실수로 잘못된 리전에 인증서 발급 시 CloudFront 연동 실패

**해결 방안**:

1. 문서에 리전 선택 이유 명시 (현재 문서에 있음)
2. 인증서 발급 체크리스트에 리전 확인 항목 추가
3. CloudWatch 알람으로 인증서 만료 모니터링

---

### 7. Secrets Manager 환경 변수 로딩 에러 처리 부족

**위치**: `loadSecretsFromEnv.ts` 3-22번 라인

**현재 구현**:

```typescript
if (!raw) {
  console.warn("No SECRETS_ARN environment variable found");
  return; // 조용히 실패
}
```

**문제점**:

- `SECRETS_ARN`이 없어도 애플리케이션이 계속 실행됨
- 필수 환경 변수가 누락되어도 시작 시점에 감지 불가
- 운영 환경에서 환경 변수 누락 시 런타임 에러 발생

**해결 방안**:

1. 필수 환경 변수 검증 로직 추가
2. 환경 변수 누락 시 애플리케이션 시작 실패 처리
3. 명확한 에러 메시지 제공

---

### 8. PostgreSQL 백업 및 복구 전략 미명시

**위치**: `EC2_Route53_S3_CloudFront.md` 3단계

**문제점**:

- PostgreSQL 자동 백업 설정이 문서에 명시되지 않음
- 백업 보관 기간 미명시
- 복구 절차 미문서화
- EC2 인스턴스 스냅샷 전략 미명시

**위험성**:

- 데이터 손실 시 복구 불가능
- 백업 정책 미설정 시 데이터 손실 위험
- EC2 인스턴스 장애 시 전체 데이터베이스 복구 어려움

**해결 방안**:

1. PostgreSQL 자동 백업 설정 (cron 작업):
   - 일일 백업 (pg_dump)
   - 백업 파일을 S3에 자동 업로드
   - 백업 보관 기간 설정 (Production: 30일, Staging: 7일)
2. EC2 인스턴스 스냅샷 정기 생성 (주간/월간)
3. 백업 복구 테스트 절차 문서화
4. Cross-Region 백업 복제 (S3 Cross-Region Replication)
5. Point-in-Time Recovery를 위한 WAL 아카이빙 설정 (선택적)

---

### 9. EC2 Auto Scaling 및 로드 밸런싱 설정 미명시

**위치**: `EC2_Route53_S3_CloudFront.md`

**문제점**:

- EC2 Auto Scaling Group 설정이 문서에 명시되지 않음
- 단일 EC2 인스턴스로만 배포되어 확장성 부족
- 트래픽 증가 시 자동 확장 불가능
- 로드 밸런서 설정 미명시

**위험성**:

- 트래픽 급증 시 서비스 다운타임 발생 가능
- 단일 인스턴스 장애 시 전체 서비스 중단
- 수동으로만 인스턴스 확장 가능하여 대응 지연

**해결 방안**:

1. **Production 환경**:
   - EC2 Auto Scaling Group 구성:
     - 최소 인스턴스: 2 (고가용성)
     - 최대 인스턴스: 10 (트래픽에 따라 조정)
     - 원하는 용량: 2
   - Application Load Balancer 구성
   - CPU 사용률 기반 자동 스케일링 정책 설정
2. **Staging 환경**: 단일 인스턴스 유지 가능 (비용 절감)
3. CloudWatch 알람으로 트래픽 및 CPU 사용률 모니터링

---

### 10. 모니터링 및 알람 설정 미명시

**위치**: 모든 AWS 문서

**문제점**:

- CloudWatch 알람 설정이 문서화되지 않음
- 주요 메트릭 모니터링 전략 부재
- 장애 발생 시 알림 체계 미구축

**위험성**:

- 장애 발생 시 즉시 감지 불가
- 문제 해결 지연으로 인한 서비스 다운타임 증가

**해결 방안**:

1. 필수 CloudWatch 알람 설정:
   - EC2: CPU 사용률, 메모리 사용률, CPU 크레딧 잔여량, 디스크 사용률
   - PostgreSQL: 연결 수, 쿼리 성능, 디스크 I/O
   - Nginx: 응답 시간, 에러율, 요청 수
   - PM2: 프로세스 상태, 메모리 사용량
   - S3: 버킷 크기, 요청 수
2. SNS를 통한 알림 설정 (이메일, Slack 등)
3. 대시보드 구성으로 주요 메트릭 시각화
4. EC2 인스턴스 상태 체크 알람 (시스템 상태 확인)

---

## 🟢 경미한 문제점 (장기 개선 권장)

### 11. 배포 버전 추적 전략

**위치**: GitHub Actions 워크플로우

**문제점**:

- 배포된 코드 버전 추적 어려움
- 특정 배포 시점의 코드 버전 확인 불가능
- 롤백 시 이전 버전 식별 어려움

**해결 방안**:

1. GitHub Actions 워크플로우에서 Git 커밋 해시를 환경 변수로 설정
2. 애플리케이션 시작 시 커밋 해시를 로그에 출력
3. `/health` 엔드포인트에 버전 정보 포함 (선택적)
4. 배포 태그와 Git 커밋 해시 매핑 문서화

---

### 12. 비용 최적화 전략 부재

**문제점**:

- 리소스 사용량 모니터링 전략 부재
- 사용하지 않는 리소스 정리 계획 없음
- EC2 인스턴스 스케일링으로 인한 비용 최적화 부족
- Reserved Instance/Savings Plan 고려 사항 없음

**해결 방안**:

1. AWS Cost Explorer를 통한 비용 분석
2. 사용하지 않는 리소스 정기 점검
3. 트래픽 패턴 분석 후 Reserved Instance 검토
4. EC2 인스턴스 스케일 다운 정책 설정 (비피크 시간)
5. S3 스토리지 클래스 최적화 (Standard → Intelligent-Tiering)

---

작성일: 2025-11-23
