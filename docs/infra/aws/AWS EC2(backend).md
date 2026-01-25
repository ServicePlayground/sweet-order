# AWS EC2(backend) - 가이드

#### 1. AWS EC2 인스턴스 생성

- 리전 확인: ap-northeast-2(서울)
- 이름: `sweet-order-backend-{환경}`
- 애플리케이션 및 OS 이미지(Amazon Machine Image): Amazon Linux 2023 6.12
- 아키텍쳐: x86_64
- 인스턴스: t3.small
- 키페어(EC2 인스턴스에 SSH로 접속하기 위한 비밀번호 대신 사용하는 인증 파일): 새 키 페어 생성 > 이름: `sweet-order-ec2-key-{환경}` > 키 페어 유형: RSA > 프라이빗 키 파일 형식: .pem > 생성 > .pem 파일 다운로드 (안전하게 보관)
- VPC: 기본 VPC 선택
- 서브넷: 아무거나 하나 클릭(단, 퍼블릭 서브넷이어야함)
- 퍼블릭 IP 자동 할당: 활성화
- 보안그룹: 
    - (따로 보안 그룹을 만들지 않았다면) 새 보안 그룹 생성 
        - 이름: `sweet-order-ec2-sg-{환경}` 
        - 인바운드 규칙: 유형: SSH(22), 프로토콜: TCP, 포트: 22, 소스 유형 : 위치 무관
        - 인바운드 규칙: 유형: HTTP(80), 프로토콜: TCP, 포트: 80, 소스 유형 : 위치 무관
        - 인바운드 규칙: 유형: HTTPS(443), 프로토콜: TCP, 포트: 443, 소스 유형 : 위치 무관
- 고급 네트워크 구성: 그대로 두기
- 스토리지 구성: 기본값 사용(볼륨 유형: gp3, 크기: 8GB(최소크기, 프리티어에 적합), 암호화: 비활성화(비용 절감))
- 고급 세부 정보: 그대로 두기
- 인스턴스 개수: 2개

#### 2. AWS EC2 인스턴스 접속 (Amazon Linux 2023)

- 인스턴스 생성 후 대기 (약 1-2분) > 인스턴스에 연결 클릭 > "SSH 클라이언트" 탭 선택 > 예시 명령어 복사
- 로컬에 저장되어 있는 .pem 키 존재하는 파일 경로에서 터미널 열고 아래 명렁어 입력

```bash
# 1. 키 파일 권한 설정 (다운로드한 .pem 파일)
chmod 400 sweet-order-ec2-key-{환경}.pem

# 2. SSH 접속
ssh -i sweet-order-ec2-key-{환경}.pem ec2-user@{aws에서복사한 주소 그대로 복사}
```

#### 3. EC2 서버에서 시스템 업데이트 (Amazon Linux 2023)

```bash
# 시스템 업데이트
sudo dnf update -y
```

#### 4. EC2 서버에서 Docker 설치 (Amazon Linux 2023)

```bash
# Docker 설치
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# 재로그인 필요
exit

# 다시 SSH 접속
ssh -i sweet-order-ec2-key-{환경}.pem ec2-user@{aws에서복사한 주소 그대로 복사}
```

#### 5. EC2 서버에서 AWS CLI 설치 (Amazon Linux 2023)

```bash
# AWS CLI v2 설치
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 설치 확인
aws --version
```

#### 6. EC2 환경 변수 설정 (AWS Secrets Manager 사용)

1. aws > secrets manager > 생성 > 다른 유형의 보안 암호 > 키/값 입력 > 보안 암호 이름: sweetorder-ec2-env-{환경} > 생성 > 보안 암호 ARN 복사
2. aws > IAM > 역할 > 생성 > AWS 서비스, EC2 > SecretsManagerReadWrite 정책 추가 > 이름: ec2-secrets-access-role-{환경} > 생성
3. aws > EC2 > 인스턴스 선택 > 작업 > 보안 > IAM 역할 수정 > ec2-secrets-access-role-{환경} 선택 > IAM 역할 업데이트
4. EC2에서 Secrets Manager 값 정상적으로 가져오는지 테스트

```bash
# 로컬에 저장되어 있는 .pem 키 존재하는 파일 경로에서 터미널 열고 아래 명렁어 입력
ssh -i sweet-order-ec2-key-{환경}.pem ec2-user@{aws에서복사한 주소 그대로 복사}

aws secretsmanager get-secret-value \
--secret-id {보안 암호 ARN} \
--region ap-northeast-2 \
--query SecretString \
--output text
```

5. 필요한 부분 github workflow에서 필요한 github secrets 추가 (EC2_HOST, EC2_SSH_KEY)

**동작 방식:**
1. GitHub 워크플로우: EC2에 SSH로 접속하여 배포 스크립트 실행
2. EC2 배포: EC2에서 AWS Secrets Manager API를 호출하여 JSON 값 가져오기 (`aws secretsmanager get-secret-value --secret-id sweetorder-ec2-env-{환경}`)
3. Docker 컨테이너: JSON 문자열을 `SECRETS_ARN` 환경변수로 컨테이너에 전달 (`-e SECRETS_ARN="$SECRETS_JSON"`)
4. 애플리케이션: `loadSecretsFromEnv()` 함수가 `process.env.SECRETS_ARN`을 읽어 JSON을 파싱하여 `process.env`에 주입

------------------------------------

#### 8. RDS 보안 그룹 생성 (EC2에서 RDS 접근용)

1. aws 콘솔 > VPC > 보안 그룹 > 보안 그룹 생성
   - 이름: `db-staging-sg`
   - 설명: `RDS security group for staging`
   - VPC: 기본 VPC 선택
   - 인바운드 규칙:
     - 유형: PostgreSQL
     - 프로토콜: TCP
     - 포트: 5432
     - 소스: `sweet-order-ec2-sg-{환경}` (EC2 보안 그룹 선택)
   - 아웃바운드 규칙: 전체 허용

#### 9. RDS 데이터베이스 생성

  - 자세한 내용은 `AWS RDS(데이터베이스) - 가이드.md` 참고


#### 12. 로컬에서 Docker 이미지 빌드 및 푸시(Docker 이미지: 앱이 돌아가는 환경(운영체제, 코드 등)을 통째로 담은 상자)

1. 로컬에서 Docker 설치
 - 공식홈페이지 > Docker Desktop 설치
 - 설치 확인: `docker --version`
 - apps/infra/backend 디렉토리에서 Dockerfile 생성

2. 로컬에서 AWS CLI 설치 및 AWS 자격증명 설정
 - (aws cli 설치) brew install awscli
 - AWS > (루트계정이 있다면 > 오른쪽 위 상단 또는 IAM 사용자가 있다면 IAM 사용자) > 보안 자격 증명 > 액세스 키 만들기 > 액세스 키 ID, 비밀 액세스 키 복사
 - 명령어 `aws configure` 실행 > Access Key ID, Secret Access Key, Region, Output Format: json 입력

3. ECR 로그인
AWS_REGION=ap-northeast-2  # aws 우상단에서 확인
AWS_ACCOUNT_ID={AWS_ACCOUNT_ID} # aws 우상단에서 확인

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

4. 이미지 빌드 및 푸시
docker buildx create --use

ENV="staging" # staging, prod
ECR="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
REPO="sweet-order/backend"
VERSION=$(date +%Y%m%d-%H%M)

docker buildx build --platform linux/amd64,linux/arm64 -f apps/infra/backend/Dockerfile -t ${ECR}/${REPO}:${ENV} -t ${ECR}/${REPO}:${ENV}-${VERSION} --push .

#### 13. GitHub Actions를 통한 자동 배포 설정 (태그 기반)

**목적**: 태그 푸시 시 자동으로 Docker 이미지를 빌드하고 ECR에 푸시한 후 EC2에 자동 배포

**동작 방식:**
1. GitHub에 태그 푸시 (`backend/staging-*` 또는 `backend/prod-*`)
2. GitHub Actions가 자동으로 트리거됨
3. 태그에서 환경(staging/prod) 추출
4. Docker 이미지 빌드 및 ECR에 푸시
5. EC2에 SSH 접속하여 최신 이미지 pull 및 컨테이너 재시작

**설정 단계:**

1. **GitHub Secrets 설정**
   - GitHub 저장소 > Settings > Secrets and variables > Actions > New repository secret
   - 다음 secrets를 추가:
     - `AWS_ACCESS_KEY_ID`: AWS IAM 사용자의 Access Key ID
     - `AWS_SECRET_ACCESS_KEY`: AWS IAM 사용자의 Secret Access Key
     - `AWS_REGION`: `ap-northeast-2`
     - `AWS_ACCOUNT_ID`: AWS 계정 ID (콘솔 우상단에서 확인)
     - `ECR_REPOSITORY`: `sweet-order/backend`
     - `EC2_HOST`: EC2 인스턴스의 퍼블릭 IP 또는 도메인 (예: `ec2-xxx-xxx-xxx-xxx.ap-northeast-2.compute.amazonaws.com`)
     - `EC2_USER`: `ec2-user` (Amazon Linux 2023의 경우)
     - `EC2_SSH_KEY`: EC2 키 페어의 .pem 파일 내용 (전체 내용을 복사)
       ```bash
       # 로컬에서 .pem 파일 내용 확인
       cat sweet-order-ec2-key-{환경}.pem
       ```
     - `SECRETS_ARN`: AWS Secrets Manager의 ARN (예: `arn:aws:secretsmanager:ap-northeast-2:123456789012:secret:backend-secrets-xxxxx`)

2. **EC2 보안 그룹 설정 (GitHub Actions에서 SSH 접속 허용)**
   - AWS 콘솔 > EC2 > 보안 그룹 > `sweet-order-ec2-sg-{환경}` 선택
   - 인바운드 규칙 편집 > 규칙 추가:
     - 유형: SSH(22)
     - 프로토콜: TCP
     - 포트: 22
     - 소스 유형: 위치 무관 (또는 GitHub Actions IP 범위)
     - 참고: 보안을 위해 GitHub Actions IP 범위만 허용하는 것이 좋지만, IP가 자주 변경되므로 필요시 위치 무관으로 설정

3. **워크플로우 파일 확인**
   - `.github/workflows/deploy-ec2-backend.yml` 파일이 생성되어 있는지 확인
   - 태그 패턴 확인:
     ```yaml
     on:
       push:
         tags:
           - "backend/staging-*"
           - "backend/prod-*"
     ```

4. **배포 방법**
   - 태그를 생성하고 푸시:
     ```bash
     # Staging 환경 배포
     git tag backend/staging-v1.0.0
     git push origin backend/staging-v1.0.0
     
     # 또는 Production 환경 배포
     git tag backend/prod-v1.0.0
     git push origin backend/prod-v1.0.0
     ```
   - GitHub > Actions 탭에서 워크플로우 실행 확인
   - EC2에 SSH 접속하여 컨테이너 상태 확인:
     ```bash
     ssh -i sweet-order-ec2-key-{환경}.pem ec2-user@{EC2_HOST}
     docker ps
     docker logs sweet-order-backend
     ```

**트러블슈팅:**

- **SSH 접속 실패**: EC2 보안 그룹에서 SSH(22) 포트가 GitHub Actions IP에서 접근 가능한지 확인
- **컨테이너 실행 실패**: `docker logs sweet-order-backend`로 로그 확인
- **환경 변수 문제**: Secrets Manager ARN이 올바른지 확인
- **태그 형식 오류**: 태그는 반드시 `backend/staging-*` 또는 `backend/prod-*` 형식이어야 함


---


## 🔟 Application Load Balancer (ALB) 설정

> 📌 **목적**: HTTPS, 도메인 연결, 고가용성

### 10-1. ALB 생성

1. **AWS 콘솔** > **EC2** > **로드 밸런서** > **로드 밸런서 생성**

**기본 구성**:
- 로드 밸런서 유형: **Application Load Balancer**
- 이름: `sweet-order-backend-staging-alb`
- 체계: **인터넷 경계**
- IP 주소 유형: **IPv4**

**네트워크 매핑**:
- VPC: 위에서 생성한 VPC 선택
- 가용 영역: 최소 2개 선택 (고가용성)
- 서브넷: 퍼블릭 서브넷 선택

**보안 그룹**:
- 새 보안 그룹 생성 또는 기존 선택
- 이름: `alb-staging-sg`
- 인바운드: HTTP (80), HTTPS (443) - `0.0.0.0/0`
- 아웃바운드: 전체 허용

**리스너 및 라우팅**:
- 프로토콜: **HTTP**, 포트: **80**
- 기본 작업: **대상 그룹 생성**

**대상 그룹 구성**:
- 대상 유형: **인스턴스**
- 대상 그룹 이름: `sweet-order-backend-staging-tg`
- 프로토콜: **HTTP**, 포트: **8080**
- VPC: 동일 VPC 선택
- 상태 확인:
  - 프로토콜: **HTTP**
  - 경로: `/health`
  - 정상 임계값: **2**
  - 비정상 임계값: **2**
  - 제한 시간: **5초**
  - 간격: **30초**

**등록할 대상**:
- EC2 인스턴스 선택 후 **등록된 대상에 추가**

2. **생성 완료 후 DNS 이름 확인**: `sweet-order-backend-staging-alb-xxxxx.ap-northeast-1.elb.amazonaws.com`

### 10-2. HTTPS 리스너 추가

1. **SSL 인증서 발급** (ACM):
   - **AWS 콘솔** > **Certificate Manager** > **인증서 요청**
   - 리전: **ap-northeast-1** (ALB용)
   - 인증서 유형: **퍼블릭 인증서 요청**
   - 도메인 이름: `api-staging.sweetorders.com`
   - 검증 방법: **DNS 검증**
   - Route53에 레코드 자동 생성 (또는 수동 추가)
   - 발급 완료 대기 (약 5-10분)

2. **ALB에 HTTPS 리스너 추가**:
   - **로드 밸런서** > `sweet-order-backend-staging-alb` 선택
   - **리스너** 탭 > **리스너 추가**
   - 프로토콜: **HTTPS**, 포트: **443**
   - 기본 작업: `sweet-order-backend-staging-tg` 선택
   - 기본 인증서: 위에서 발급한 인증서 선택

3. **HTTP → HTTPS 리다이렉트** (선택사항):
   - HTTP 리스너 (포트 80) 편집
   - 기본 작업: **리다이렉트** → HTTPS (443)

---

## 1️⃣1️⃣ Route53 도메인 연결

> 📌 **참고**: 자세한 내용은 `AWS Route53(도메인) - 가이드.md` 참고

### 11-1. 도메인 구매 (Route53에서)

1. **AWS 콘솔** > **Route53** > **도메인 등록** > 도메인 검색 및 구매
2. Hosted Zone 자동 생성 확인

### 11-2. ALB에 도메인 연결

1. **Route53** > **호스팅 영역** > `sweetorders.com` 선택
2. **레코드 생성**:
   - 레코드 이름: `api-staging`
   - 레코드 유형: **A**
   - 별칭: **예**
   - 별칭 대상: **Application 및 Classic Load Balancer에 대한 별칭**
   - 리전: `ap-northeast-1`
   - 로드 밸런서: `sweet-order-backend-staging-alb` 선택
   - 라우팅 정책: **단순 라우팅**
   - **레코드 생성**

3. **확인**: `https://api-staging.sweetorders.com/health` 접속 테스트

---
