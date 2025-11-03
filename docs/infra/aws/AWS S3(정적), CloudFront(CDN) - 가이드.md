## 일반 파일 저장(이미지/파일 업로드·배포) 목적

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
← presigned URL + fileUrl 받음
→ presigned URL로 S3 업로드
→ /api/user/profile 에 fileUrl 전달
[백엔드]
→ fileUrl을 DB에 저장
← OK 응답
[프론트엔드]
→ <img src={fileUrl} /> 렌더링

정리하면

프론트엔드는 파일 자체를 백엔드에 전송하지 않습니다.
→ 대신, S3로 바로 올리고 그 “결과 URL”을 백엔드에 알려줍니다.

백엔드는 실제 파일을 보관하지 않고, URL만 DB에 저장합니다.
→ 예: profile_image_url 같은 필드에 CloudFront URL이 들어감.

프론트엔드는 나중에 API에서 받은 이 URL을 그대로 <img src="...">로 사용.

역할 하는 일 데이터 흐름
프론트엔드 파일 선택 → presigned URL 요청 → S3에 직접 업로드 → 업로드된 파일 URL을 백엔드에 전달 파일 → S3, URL → 백엔드
백엔드 presigned URL 생성 / 업로드된 URL 저장 / DB 관리 요청받고 URL 생성·저장
S3 + CloudFront 실제 파일 저장 + CDN 캐싱 제공 저장 및 서빙 담당

🧩 전체 흐름 요약

프론트엔드에서 업로드 준비

사용자가 파일(예: 이미지)을 선택.

프론트엔드가 백엔드에 “이 이미지를 업로드할 presigned URL을 달라”고 요청합니다.

POST /api/uploads/presign
body: { fileName: "profile.png", contentType: "image/png" }

백엔드에서 presigned URL 생성

AWS SDK로 S3에 업로드 가능한 임시 URL(presigned URL)을 만들어서 프론트로 반환.

{
"uploadUrl": "https://s3.ap-northeast-2.amazonaws.com/my-bucket/uploads/profile.png?...",
"fileUrl": "https://cdn.myapp.com/uploads/profile.png"
}

uploadUrl → S3에 직접 PUT 요청할 주소 (짧은 시간만 유효)

fileUrl → 업로드 후 최종적으로 접근할 CloudFront URL (이미지 표시용)

프론트엔드에서 S3로 직접 업로드

백엔드에서 받은 uploadUrl로 파일을 바로 업로드합니다.

await fetch(uploadUrl, {
method: "PUT",
headers: { "Content-Type": file.type },
body: file,
});

업로드가 성공하면 실제 파일은 S3에 저장됩니다.

백엔드로 업로드된 파일 경로(URL) 전달

업로드 완료 후, 프론트엔드는 **“이 파일이 여기 저장되어 있다”**는 정보를 백엔드로 알려줍니다.

백엔드는 그 URL을 DB에 저장합니다.
(예: 프로필 이미지 주소, 게시물 이미지 주소 등)

POST /api/user/profile
body: { imageUrl: "https://cdn.myapp.com/uploads/profile.png" }

→ 백엔드는 DB에 imageUrl을 그대로 저장.

프론트엔드에서 이미지 표시

나중에 사용자 정보를 불러올 때 DB에 저장된 imageUrl을 받아서
<img src={imageUrl} /> 로 바로 보여주면 됩니다.

CloudFront가 앞단에 있으므로 빠르게 이미지가 로드됩니다.
