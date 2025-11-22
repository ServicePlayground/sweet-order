# Yarn Berry node_modules 설정 가이드 (현재 적용)

## 개요

이 프로젝트는 Yarn Berry 4.9.4와 node_modules 방식을 사용하여 의존성을 관리합니다. Yarn Berry의 고급 기능과 Workspace를 활용한 모노레포 관리에 중점을 둡니다.

# PnP 모드 비활성화 (postinstall시 prisma 관련 이슈가 너무 많이 존재함, prisma-pnp 호환성 문제 해결용)

## 🤔 왜 node_modules 방식을 사용하는가?

### PnP 방식의 문제점

#### 1. **Prisma 호환성 문제**

```
# PnP 방식에서 발생하는 문제들
yarn install
# → Prisma generate 실행 시 오류 발생
# → postinstall 스크립트에서 멈춤
# → 빌드 과정에서 패키지 찾기 실패
```

**문제점:**

- Prisma가 PnP 환경에서 제대로 작동하지 않음
- postinstall 스크립트 실행 시 패키지 경로 문제
- 개발 도구들이 PnP를 완전히 지원하지 않음

#### 2. **개발 도구 호환성 문제**

```bash
# PnP 방식에서 발생하는 문제들
- VS Code에서 타입 인식 실패
- ESLint/Prettier 설정 복잡
- 디버깅 도구 작동 불안정
```

**문제점:**

- IDE 지원이 제한적
- 개발 도구 설정이 복잡
- 디버깅과 프로파일링 어려움

## 📦 패키지 공유는 어떻게 되는가?

### **1. Yarn Workspaces Hoisting 정책**

- **공통 의존성**: 여러 workspace에서 공통으로 사용하는 패키지들은 **루트의 node_modules/**에만 설치됩니다
- **고유 의존성**: 특정 workspace에서만 사용하는 패키지들은 **해당 workspace의 node_modules/**에 설치됩니다

````

## ⚙️ 주요 설정 파일

### `.yarnrc.yml` - node_modules 설정의 핵심

```yaml
# node_modules 방식 사용 (PnP 대신)
nodeLinker: node-modules
````

## 🔧 Workspace Hoisting 상세 설명

### Workspace Hoisting 동작 방식

**Hoisting이란?**

- 여러 workspace에서 공통으로 사용하는 패키지들을 루트 `node_modules/`로 끌어올리는 기능
- 중복 제거와 디스크 공간 절약 효과

**현재 프로젝트 설정:**

- `nodeLinker: node-modules`로 설정되어 전통적인 node_modules 방식 사용
- Workspace hoisting으로 공통 의존성들을 루트에서 관리
- 각 프로젝트별 고유 의존성만 해당 workspace에 설치

## 📚 요약

### Yarn Berry의 핵심 개념

1. **Workspace Hoisting**: 공통 의존성을 루트에서 관리하여 중복 제거
2. **명확한 의존성**: yarn.lock으로 정확한 버전 고정

## 📖 참고 자료

- [Yarn Berry 공식 문서](https://yarnpkg.com/getting-started)
- [워크스페이스 가이드](https://yarnpkg.com/features/workspaces)
- [packageExtensions 가이드](https://yarnpkg.com/configuration/yarnrc#packageExtensions)
