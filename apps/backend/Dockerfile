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