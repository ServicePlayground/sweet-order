## 일반 파일 저장(이미지/파일 업로드·배포) 목적

### AWS S3 버킷 생성

1. AWS > S3 > 버킷 생성

- 버킷 유형: 범용
- 버킷 이름: sweetorder-uploads-{환경}-apne1
- 객체 소유권: ACL 비활성화됨
- 모든 퍼블릭 액세스 차단
- 버전 관리 OFF
- 기본 암호화 유형: SSE-S3
- 버킷 키: 비활성화

2. 프론트엔드 CORS 설정

2-1. AWS > S3 > 생성한 버킷 클릭 > 권한 탭 > CORS부분 아래 코드 삽입

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "https://staging.sweetorder.com",
      "https://seller-staging.sweetorder.com",
      "https://admin-staging.sweetorder.com"
    ],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
    "AllowedHeaders": ["*"], // 전체 허용
    "ExposeHeaders": ["ETag"], // 업로드 후 파일 확인용
    "MaxAgeSeconds": 3000
  }
]
```

3. 백엔드 환경 변수 AWS Secerts Manager에 저장

4. 백엔드에서 @aws-sdk/client-s3 설치 후 파일 업로드 API 구현

---

### CloudFront 생성

1. AWS > CloudFront > 배포 생성

- 1단계
  - Distribution name: sweetorder-static-staging
  - Distribution type: Single website or app
  - Domain: (생략)
- 2단계
  - Origin type: Amazon S3
  - Origin: browse S3 버튼 클릭 > 해당 버킷 선택(sweetorder-uploads-{환경}-apne1)
  - Origin path: (생략)
  - Settings: 선택되어 있는 상태 유지
- 3단계
  - Web Application Firewall: 보안 보호 비활성화

2. 정책 복사 및 저장
   - 2-1. 생성한 배포 클릭 > origin(원본) 탭 > 해당 origin 선택 후 편집 > 정책 복사 버튼 클릭
   - 2-2. AWS > S3 > sweetorder-uploads-{환경}-apne1 버킷 클릭 > 권한 탭 > 버킷 정책 편집 > CloudFront에서 복사한 정책을 JSON 편집기에 붙여넣기 > 저장

3. (SSL 인증서 요청) AWS > Certificate Manager > 인증서 요청 (4단계까지 완료후 발급될때까지 기다려야함)

- 인증서 유형: 퍼블릭 인증서 요청
- 도메인 이름: static-staging.sweetorders.com
- 내보내기: 내보내기 비활성화
- 검증 방법: DNS 검증
- 키 알고리즘: RSA 2048

4. (DNS 레코드 생성) AWS > Route53 > 호스팅 영역 > sweetorders.com > 레코드 생성 > Type: CNAME, 위 3번에서 발급된 값 입력 > 생성

5. (CloudFront에 SSL 인증서 연결) AWS > CloudFront > 생성한 배포 클릭 > 편집

- Alternate domain names (CNAMEs): (항목 추가) static-staging.sweetorders.com
- Custom SSL certificate: 드롭다운에서 발급된 인증서 선택

6. (커스텀 도메인이 CloudFront Distribution을 가리키도록 설정)
   - 6-2. AWS > CloudFront > 생성한 배포 클릭 > General 탭 > Distribution domain name에서 값(\*.cloudfront.net) 복사
   - 6-1. AWS > Route53 > 호스팅 영역 > sweetorders.com > 레코드 생성 > name: static-staging, type: A, Alais: 체크, 트래픽 라우팅 대상: CloudFront배포에 대한 별칭, 드롭다운에서 배포 선택

---

1. 파일 크기 제한 추가 (DoS 방지)
   FileInterceptor에 10MB 제한 추가
   빈 파일 업로드 차단
2. 파일 타입 검증 추가
   실행 파일 차단: .exe, .bat, .sh, .php, .jsp 등
   허용 파일 타입만 업로드 가능 (이미지, 문서 등)
3. 파일 이름 검증 및 정규화
   경로 탐색 공격 방지 (../../ 제거)
   특수문자 제거/치환
   파일 이름 길이 제한 (255자)
4. 파일 이름 중복 처리
   타임스탬프 + 랜덤 문자열로 고유 파일명 생성
   기존 파일 덮어쓰기 방지
5. MIME 타입 검증 강화
   확장자와 MIME 타입 일치 검증
   허용된 MIME 타입만 허용
6. URL 인코딩 처리
   특수문자 안전 처리
   각 경로 세그먼트 개별 인코딩

---

[사용자]
↓ (파일 선택)
[프론트엔드]
→ /api/uploads/presign 요청
→ /api/user/profile 에 fileUrl 전달
[백엔드]
→ fileUrl을 DB에 저장
← OK 응답
[프론트엔드]
→ <img src={fileUrl} /> 렌더링

S3 + CloudFront 실제 파일 저장 + CDN 캐싱 제공 저장 및 서빙 담당

CloudFront가 앞단에 있으므로 빠르게 이미지가 로드됩니다.
