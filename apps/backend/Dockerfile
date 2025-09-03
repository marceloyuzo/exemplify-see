# Stage 1: Pruner (para monorepo)
FROM node:22-alpine AS pruner

WORKDIR /app

# Instala Turbo para prune do monorepo
RUN yarn global add turbo@^2

# Copia tudo e gera o prune apenas do backend
COPY . .
RUN turbo prune --scope=backend-exemplify-see --docker

# Stage 2: Builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN yarn workspace backend-exemplify-see prisma generate

RUN yarn build

# Stage 3: Runner
FROM node:22-alpine AS runner

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn install --pure-lockfile --production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=pruner --chown=nodejs:nodejs /app/out/full/ .
COPY --from=builder --chown=nodejs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/apps/backend
USER nodejs
EXPOSE 3000

RUN mv ./prisma/migrate.sh ./migrate.sh && chmod +x migrate.sh

CMD [ "node", "dist/src/main.js" ]

