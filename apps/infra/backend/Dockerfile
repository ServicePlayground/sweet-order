# syntax=docker/dockerfile:1

FROM node:20-slim
WORKDIR /app

# 시스템 의존성 설치 (Prisma 바이너리용)
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Yarn 및 Corepack 활성화
RUN corepack enable && yarn set version 4.9.4

# 1️⃣ (package.json, yarn.lock 필수)(dockerignore: node_modules 제외) 전체 프로젝트 복사
COPY . .

# 2️⃣ Yarn 환경 설정 (PnP → node-modules 전환)
RUN echo "nodeLinker: node-modules" > .yarnrc.yml \
 && echo "enableGlobalCache: true" >> .yarnrc.yml

# 3️⃣ 의존성 설치 (postinstall 자동 실행)
# 현재 동일경로 package.json에 "postinstall" 자동으로 스크립트 실행됨(db:postinstall로 수정시 자동실행 안됨)
RUN yarn install

# 4️⃣ backend 빌드
RUN yarn run backend:build:staging

# 5️⃣ backend 실행
# 컨테이너 시작 -> AWS 시크릿 주입 (DATABASE_URL 등) -> yarn run db:migrate:deploy(환경 변수 필요) 실행 -> 마이그레이션 성공 후 node apps/backend/dist/main.js 실행
CMD ["sh", "-c", "yarn run db:migrate:deploy && node apps/backend/dist/main.js"]


# ------------------- PnP → node-modules 전환 --------------------------
# Generate Prisma Client (PnP 문제 해결용 node-modules 전환)
# (배포 환경에서만 임시 변경) 기존 PnP 대신 node-modules 방식 사용
# ---------------------------------------------------------------------
# COPY .pnp.cjs ./.pnp.cjs
# COPY .yarn/unplugged/ ./.yarn/unplugged/
# COPY .yarn/cache/ ./.yarn/cache/
# COPY .yarn/install-state.gz ./.yarn/install-state.gz
# .yarn/sdks는 런타임에 필요하지 않으므로 제외

# PnP 로더 주입하여 애플리케이션 실행
# CMD ["node", "-r", "./.pnp.cjs", "apps/backend/dist/main.js"]
# ---------------------------------------------------------------------