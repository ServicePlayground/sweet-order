# syntax=docker/dockerfile:1

FROM node:20-slim
WORKDIR /app


# 시스템 의존성 설치 (Prisma 바이너리용)
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# PnP 런타임 필수 파일 (로컬에서 사전 빌드된 것들)
COPY .pnp.cjs ./.pnp.cjs
COPY .yarnrc.yml ./.yarnrc.yml
COPY yarn.lock ./yarn.lock
COPY .yarn/install-state.gz ./.yarn/install-state.gz
COPY .yarn/unplugged/ ./.yarn/unplugged/
COPY .yarn/cache/ ./.yarn/cache/
# .yarn/sdks는 런타임에 필요하지 않으므로 제외

# 백엔드 빌드 산출물 (로컬에서 사전 빌드된 dist 디렉토리)
COPY apps/backend/dist ./apps/backend/dist


# PnP 로더 주입하여 애플리케이션 실행
CMD ["node", "-r", "./.pnp.cjs", "apps/backend/dist/main.js"]
