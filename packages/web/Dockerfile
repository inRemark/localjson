# Build from monorepo root:
#   docker build -f packages/web/Dockerfile -t localjson:latest .

# ── build stage ────────────────────────────────────────────────
FROM node:lts-alpine AS build-stage
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/web/package.json ./packages/web/
COPY packages/desktop/package.json ./packages/desktop/

# 固定 pnpm 与本地一致；使用 npmmirror 避免构建机访问 registry.npmjs.org 超时
RUN npm config set registry https://registry.npmmirror.com \
  && npm install -g pnpm@10.21.0 \
  && pnpm config set registry https://registry.npmmirror.com \
  && pnpm config set fetch-timeout 600000 \
  && pnpm config set fetch-retries 5 \
  && pnpm install --frozen-lockfile

COPY packages/core ./packages/core
COPY packages/web ./packages/web

RUN pnpm --filter @localjson/web build

# ── production stage ───────────────────────────────────────────
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/packages/web/dist /usr/share/nginx/html
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
