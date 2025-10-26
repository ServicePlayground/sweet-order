# Vercel 배포 가이드

## 개요

Sweet Order 프로젝트의 web-user, web-seller 애플리케이션을 Vercel에 배포하고 관리하는 가이드입니다.

## Vercel을 선택한 이유

### 1. Next.js 최적화

- Next.js 프레임워크에 특화된 배포 플랫폼
- 자동 최적화 및 성능 향상
- Edge Network를 통한 글로벌 CDN

### 2. 개발자 경험

- GitHub 연동을 통한 자동 배포
- 간단한 설정과 빠른 배포

### 3. 비용 효율성

- 무료 티어 제공
- 사용량 기반 과금

## Vercel의 장점과 특징

### 1. 자동 배포

- GitHub 푸시 시 자동 배포
- 브랜치별 프리뷰 배포
- 롤백 기능

### 2. 개발자 도구

- 실시간 로그 모니터링
- 성능 분석 도구
- 에러 추적

### 3. 확장성

- 무제한 대역폭
- 글로벌 CDN
- 자동 스케일링

## 배포 과정

### 1. GitHub 연동

- Vercel 대시보드에서 GitHub 저장소 연결
- 자동 배포 설정 완료
- 브랜치별 배포 환경 구성

### 2. 환경변수 설정

- Vercel 대시보드에서 환경변수 추가
- Development, Preview, Production 환경별 설정
- 보안이 중요한 변수는 Private으로 설정

### 3. 도메인 설정 (자세한 내용은 [AWS Route53(도메인) - 가이드](<../aws/AWS%20Route53(도메인)%20-%20가이드.md>) 참고)

- 커스텀 도메인 `sweetorders.com` 연결
- AWS Route53에서 DNS 레코드 추가
- SSL 인증서 자동 발급

## 주요 설정

### 1. 빌드 설정

- Framework: Next.js
- Build Command: `next build`
- Install Command: `yarn install`
- Root Directory: `apps/web-user`
- Output Directory: `.next(default)`

### 3. 도메인 구성

- Production: `sweetorders.com`

## 모니터링 및 관리

### 1. 배포 모니터링

- Vercel 대시보드에서 배포 상태 확인
- 실시간 로그 모니터링
- 성능 메트릭 추적

### 2. 에러 추적

- 자동 에러 감지
- 스택 트레이스 제공
- 알림 설정

### 3. 성능 분석

- Core Web Vitals 모니터링
- 페이지 로드 시간 분석
- 사용자 경험 지표

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 성능 최적화](https://vercel.com/docs/analytics)
