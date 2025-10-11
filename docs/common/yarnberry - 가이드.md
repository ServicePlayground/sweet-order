# Yarn Berry PnP 설정 가이드

## 개요

이 프로젝트는 Yarn Berry 4.9.4와 Plug'n'Play (PnP) 기능을 사용하여 의존성을 관리합니다. PnP는 기존의 `node_modules` 폴더 방식과는 완전히 다른 혁신적인 패키지 관리 방식입니다.

## 🤔 왜 PnP를 사용하는가?

### 기존 node_modules 방식의 문제점

#### 1. **디스크 공간 낭비**

```
# 기존 방식 (node_modules)
sweet-order/
├── node_modules/           # 수만 개의 파일
│   ├── react/             # React 패키지
│   ├── @types/react/      # React 타입 정의
│   ├── lodash/            # Lodash 유틸리티
│   └── ... (수만 개의 패키지)
├── apps/backend/
│   └── node_modules/      # 또 다른 수만 개의 파일
│       ├── @nestjs/core/  # NestJS 코어
│       ├── @nestjs/jwt/   # JWT 인증
│       └── ... (또 다른 수만 개)
```

**문제점:**

- 같은 패키지가 여러 곳에 중복 저장
- `node_modules` 폴더 하나당 수만 개의 파일
- 디스크 공간을 엄청나게 많이 차지

#### 2. **의존성 지옥 (Dependency Hell)**

```bash
# 기존 방식에서 발생하는 문제들
├── node_modules/
│   ├── package-a@1.0.0    # package-a 버전 1.0.0
│   └── package-b@2.0.0    # package-b 버전 2.0.0
│       └── node_modules/
│           └── package-a@1.5.0  # package-a 버전 1.5.0 (다른 버전!)
```

**문제점:**

- 같은 패키지의 다른 버전이 여러 곳에 존재
- 어떤 버전이 실제로 사용되는지 불분명
- "내 컴퓨터에서는 작동했는데" 문제 발생

#### 3. **느린 설치 속도**

```bash
# 기존 방식
yarn install
# → 수만 개의 파일을 복사
# → 중복된 패키지들을 여러 번 다운로드
# → 5-10분 소요
```

### PnP 방식의 해결책

#### 1. **디스크 공간 절약**

```
# PnP 방식
sweet-order/
├── .pnp.cjs               # 의존성 맵 파일 (하나의 파일!)
├── .yarn/cache/           # 패키지들이 압축된 상태로 저장
│   ├── npm-lodash-4.17.21-abc123.zip
│   ├── npm-@nestjs-core-10.0.0-def456.zip
│   └── ...
└── apps/backend/
    └── (node_modules 폴더 없음!)
```

**장점:**

- 패키지들이 압축된 상태로 저장
- 중복 제거로 디스크 공간 50-70% 절약
- `.pnp.cjs` 파일 하나로 모든 의존성 관리

#### 2. **명확한 의존성 해결**

```javascript
// .pnp.cjs 파일 내용 (간소화)
const packageMap = {
  lodash: "npm:lodash@4.17.21",
  "@nestjs/core": "npm:@nestjs/core@10.0.0",
  "@nestjs/jwt": "npm:@nestjs/jwt@11.0.0",
};
```

**장점:**

- 모든 패키지의 정확한 버전이 하나의 파일에 기록
- 어떤 버전이 사용되는지 명확
- 의존성 충돌 자동 해결

#### 3. **빠른 설치 속도**

```bash
# PnP 방식
yarn install
# → 패키지들을 압축된 상태로 다운로드
# → 중복 다운로드 없음
# → 1-2분 소요 (기존 대비 3-5배 빠름)
```

## 📦 패키지 공유는 어떻게 되는가?

### 글로벌 캐시 시스템

```bash
# PnP의 패키지 공유 방식
~/.yarn/berry/cache/              # 글로벌 캐시 (모든 프로젝트 공유)
├── npm-lodash-4.17.21-abc123.zip
├── npm-@nestjs-core-10.0.0-def456.zip
├── npm-typescript-5.5.0-ghi789.zip
└── ...

# 프로젝트별 캐시 (선택적)
sweet-order/.yarn/cache/          # 프로젝트별 캐시
├── npm-prisma-6.16.3-jkl012.zip
└── ...
```

**공유 방식:**

1. **글로벌 캐시**: 모든 프로젝트가 공유하는 패키지 저장소
2. **프로젝트별 캐시**: 특정 프로젝트에서만 사용하는 패키지
3. **중복 제거**: 같은 패키지는 한 번만 다운로드하고 공유

### 실제 예시

```bash
# 프로젝트 A에서 lodash 설치
cd project-a
yarn add lodash
# → ~/.yarn/berry/cache/에 lodash 다운로드

# 프로젝트 B에서 lodash 설치
cd project-b
yarn add lodash
# → 이미 다운로드된 lodash 재사용 (다운로드 없음!)

# Sweet Order 프로젝트에서 lodash 설치
cd sweet-order
yarn add lodash
# → 역시 이미 다운로드된 lodash 재사용
```

## ⚙️ 주요 설정 파일

### `.yarnrc.yml` - PnP 설정의 핵심

```yaml
# PnP 모드 활성화 (node_modules 대신 .pnp.cjs 사용)
nodeLinker: pnp

# Yarn Berry 버전 지정
yarnPath: .yarn/releases/yarn-4.9.4.cjs

# PnP 모드 설정
pnpMode: loose # strict vs loose

# 글로벌 캐시 비활성화 (프로젝트별 캐시 사용)
enableGlobalCache: false

# 의존성 해결 최적화 (문제 해결용)
packageExtensions:
  "@nestjs/core@*":
    peerDependencies:
      "typescript": "*" # TypeScript 의존성 자동 해결
  "@nestjs/schematics@*":
    peerDependencies:
      "typescript": "*"
```

## 🔧 PnP 모드 상세 설명

### `pnpMode: loose` vs `strict`

#### **loose 모드 (현재 사용 중)**

```yaml
pnpMode: loose
```

**특징:**

- 기존 코드와의 호환성을 최대한 보장
- 일부 패키지가 PnP를 완전히 지원하지 않아도 작동
- 개발 편의성 우선

**예시:**

```javascript
// loose 모드에서는 이런 코드도 작동
import { someFunction } from "some-package"; // PnP 미지원 패키지도 작동
```

#### **strict 모드**

```yaml
pnpMode: strict
```

**특징:**

- 모든 의존성이 명시적으로 선언되어야 함
- 더 엄격한 보안과 성능
- PnP를 완전히 지원하는 패키지만 사용 가능

### `enableGlobalCache: false` - 프로젝트별 캐시 사용

```yaml
enableGlobalCache: false
```

**동작 방식:**

1. **프로젝트별 캐시**: 각 프로젝트의 `.yarn/cache/` 디렉토리에 패키지 저장

**현재 프로젝트 설정:**

- `enableGlobalCache: false`로 설정되어 프로젝트별 캐시를 사용합니다.
- 각 프로젝트의 `.yarn/cache/` 디렉토리에 패키지가 저장됩니다.

## 🛠️ packageExtensions - 의존성 문제 해결

### 왜 필요한가?

일부 패키지들은 PnP를 완전히 지원하지 않아서 의존성 문제가 발생합니다.

### NestJS 관련 문제 해결

**문제 상황:**

```bash
# NestJS 패키지들이 TypeScript를 요구하지만 선언되지 않음
@nestjs/core@10.0.0 requires typescript as peerDependency
@nestjs/schematics@10.0.0 requires typescript as peerDependency
```

**해결 방법:**

```yaml
packageExtensions:
  "@nestjs/core@*":
    peerDependencies:
      "typescript": "*" # TypeScript 의존성 자동 추가
  "@nestjs/schematics@*":
    peerDependencies:
      "typescript": "*"
```

**결과:**

- NestJS 패키지들이 TypeScript를 자동으로 찾을 수 있음
- 수동으로 TypeScript를 설치할 필요 없음

## 🚀 PnP의 실제 장점

### 1. **성능 향상** - 설치 속도 3-5배 빨라짐

**기존 방식:**

```bash
yarn install
# → 수만 개의 파일을 복사
# → 중복된 패키지들을 여러 번 다운로드
# → 5-10분 소요
```

**PnP 방식:**

```bash
yarn install
# → 패키지들을 압축된 상태로 다운로드
# → 중복 다운로드 없음
# → 1-2분 소요
```

### 2. **디스크 공간 절약** - 50-70% 공간 절약

**기존 방식:**

```
sweet-order/
├── node_modules/     # 2.1GB
└── apps/backend/
    └── node_modules/ # 1.8GB
# 총 3.9GB 사용
```

**PnP 방식:**

```
sweet-order/
├── .pnp.cjs         # 1KB
├── .yarn/cache/     # 1.3GB (압축된 상태)
└── apps/backend/
    └── (node_modules 없음!)
# 총 1.3GB 사용 (66% 절약!)
```

### 3. **보안 강화** - 불필요한 패키지 접근 방지

**기존 방식:**

```javascript
// 어떤 패키지든 접근 가능 (보안 위험)
import { someFunction } from "unwanted-package"; // 의도하지 않은 패키지 접근
```

**PnP 방식:**

```javascript
// 명시적으로 선언된 패키지만 접근 가능
import { someFunction } from "declared-package"; // 안전한 패키지 접근만 허용
```

### 4. **일관성 보장** - "내 컴퓨터에서는 작동했는데" 문제 해결

**기존 방식:**

```bash
# 개발자 A의 컴퓨터
node_modules/
├── lodash@4.17.20
└── react@18.2.0

# 개발자 B의 컴퓨터
node_modules/
├── lodash@4.17.21  # 다른 버전!
└── react@18.1.0    # 다른 버전!
```

**PnP 방식:**

```javascript
// .pnp.cjs 파일 (모든 개발자가 동일)
const packageMap = {
  lodash: "npm:lodash@4.17.21", // 정확한 버전 고정
  react: "npm:react@18.2.0", // 정확한 버전 고정
};
```

## ⚠️ 주의사항 및 제한사항

### IDE 설정 - PnP 지원 활성화

#### VS Code 설정

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**왜 필요한가?**

- VS Code가 `.pnp.cjs` 파일을 읽고 패키지 위치를 찾을 수 있도록 함
- 자동 완성과 타입 체크가 제대로 작동하도록 함

#### WebStorm/IntelliJ 설정

1. Settings > Languages & Frameworks > Node.js and NPM
2. Package manager: Yarn 선택
3. Enable PnP support 체크

**왜 필요한가?**

- IDE가 PnP 방식으로 패키지를 찾을 수 있도록 함
- 코드 네비게이션과 리팩토링이 제대로 작동하도록 함

## 💻 실제 개발 워크플로우

### 패키지 설치 - PnP 방식

#### 루트에서 패키지 추가

```bash
# 루트에 패키지 추가 (모든 워크스페이스에서 사용 가능)
yarn add lodash

# 결과: .pnp.cjs 파일에 lodash 추가
# 모든 워크스페이스에서 import 가능
```

#### 특정 워크스페이스에 패키지 추가

```bash
# 백엔드에만 패키지 추가
yarn workspace @sweet-order/backend add @nestjs/jwt

# 결과: 백엔드 package.json에만 추가
# 다른 워크스페이스에서는 사용 불가
```

#### 개발 의존성 추가

```bash
# 루트에 개발 도구 추가
yarn add -D prettier

# 결과: 모든 워크스페이스에서 개발 도구로 사용 가능
```

### 스크립트 실행 - 워크스페이스 방식

#### 루트 스크립트 실행

```bash
# 루트 package.json의 스크립트 실행
yarn dev                    # → yarn workspace @sweet-order/backend dev
yarn build:production       # → yarn workspace @sweet-order/backend build:production
```

#### 워크스페이스 스크립트 직접 실행

```bash
# 특정 워크스페이스의 스크립트 직접 실행
yarn workspace @sweet-order/backend dev
yarn workspace @sweet-order/backend typecheck
yarn workspace @sweet-order/backend lint
```

### 의존성 관리 - PnP 최적화

#### 의존성 업데이트

```bash
# 모든 패키지 업데이트
yarn upgrade

# 특정 패키지만 업데이트
yarn upgrade lodash

# 특정 워크스페이스의 패키지 업데이트
yarn workspace @sweet-order/backend upgrade @nestjs/core
```

#### 캐시 관리

```bash
# 캐시 확인 및 정리
yarn install --check-cache

# 글로벌 캐시 정리
yarn cache clean

# PnP 파일 재생성 (문제 해결 시)
rm .pnp.cjs
yarn install
```

## 🔧 문제 해결 가이드

### Yarn 디렉터리 구조 이해 (`.yarn` 내부)

#### `cache/`

- 압축된 캐시(zip) 상태로는 동작이 어려운 패키지를 Yarn이 자동으로 “펼친” 위치입니다.
- 빌드 스크립트 실행, 파일 시스템 직접 접근 등이 필요한 패키가 이 경로에서 동작합니다.
- 사용자는 일반적으로 수동 관리할 필요가 없습니다.

#### `sdks/`

- VS Code/IDE가 프로젝트의 정확한 버전의 TypeScript, ESLint 등을 사용하도록 하는 SDK 파일 모음입니다.
- `yarn dlx @yarnpkg/sdks vscode` 또는 `yarn sdks`로 생성/갱신합니다.
- IDE가 PnP 환경에서 올바른 바이너리를 참조하게 해 주므로, 타입 검사/자동완성이 안정적입니다.

#### `unplugged/`

- 압축된 캐시(zip) 상태로는 동작이 어려운 패키지를 Yarn이 자동으로 “펼친” 위치입니다.
- 빌드 스크립트 실행, 파일 시스템 직접 접근 등이 필요한 패키지가 이 경로에서 동작합니다.
- 사용자는 일반적으로 수동 관리할 필요가 없습니다.

#### `install-state.gz`

- 설치 단계의 스냅샷(메타데이터)으로, 재설치 시 무엇을 건너뛸 수 있는지 빠르게 판단합니다.
- Yarn 4에서는 이 파일을 커밋하는 것이 권장됩니다. CI에서도 설치 최적화가 일관되게 적용됩니다.

### 의존성 해결 오류

#### peer dependency 문제 확인

```bash
# peer dependency 문제 진단
yarn explain peer-requirements

# 결과 예시:
# p11f819 → ✘ @sweet-order/backend doesn't provide typescript
# → TypeScript가 누락되었다는 의미
```

#### 의존성 트리 확인

```bash
# 특정 패키지가 어디서 사용되는지 확인
yarn why lodash

# 결과 예시:
# @sweet-order/backend@workspace:apps/backend
# └─ lodash@npm:4.17.21
#    └─ Used by: @nestjs/common
```

### PnP 관련 오류

#### PnP 파일 재생성

```bash
# PnP 파일이 손상되었을 때
rm .pnp.cjs
yarn install

# 결과: 새로운 .pnp.cjs 파일 생성
```

#### 캐시 정리

```bash
# 캐시 문제가 있을 때
yarn cache clean
yarn install

# 결과: 캐시를 정리하고 패키지 재다운로드
```

### 일반적인 오류와 해결책

#### "Cannot resolve module" 오류

```bash
# 문제: 패키지를 찾을 수 없음
# 해결: 패키지가 .pnp.cjs에 등록되어 있는지 확인
yarn why <package-name>
```

#### "Peer dependency not found" 오류

```bash
# 문제: peer dependency 누락
# 해결: packageExtensions에 추가하거나 수동 설치
yarn add <missing-package>
```

#### IDE에서 타입 인식 안됨

```bash
# 문제: VS Code에서 타입을 찾지 못함
# 해결: TypeScript 서버 재시작
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

## 📚 요약

### PnP의 핵심 개념

1. **node_modules 폴더 없음**: `.pnp.cjs` 파일 하나로 모든 의존성 관리
2. **글로벌 캐시**: 모든 프로젝트가 패키지를 공유하여 디스크 공간 절약
3. **명확한 의존성**: 모든 패키지의 정확한 버전이 하나의 파일에 기록
4. **빠른 설치**: 압축된 패키지로 3-5배 빠른 설치 속도

## 📖 참고 자료

- [Yarn Berry 공식 문서](https://yarnpkg.com/getting-started)
- [PnP 가이드](https://yarnpkg.com/features/pnp)
- [워크스페이스 가이드](https://yarnpkg.com/features/workspaces)
- [packageExtensions 가이드](https://yarnpkg.com/configuration/yarnrc#packageExtensions)
