# Stage 1: Pruner
FROM node:22-slim AS pruner
WORKDIR /app
RUN yarn global add turbo@^2
COPY . .
RUN turbo prune --scope=backend-exemplify-see --docker

# Stage 2: Builder
FROM node:22-slim AS builder
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ . 
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN yarn workspace backend-exemplify-see prisma generate
RUN yarn build

# Stage 3: Runner
FROM node:22-slim AS runner

WORKDIR /app

# instalar Chromium + libs
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxrender1 \
    wget \
    xdg-utils \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ . 
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn install --pure-lockfile --production

RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs

COPY --from=pruner --chown=nodejs:nodejs /app/out/full/ .
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/node_modules/.prisma ./node_modules/.prisma

WORKDIR /app/apps/backend
USER nodejs
EXPOSE 3000

RUN mv ./prisma/migrate.sh ./migrate.sh && chmod +x migrate.sh

CMD [ "node", "dist/src/main.js" ]