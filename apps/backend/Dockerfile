# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copia apenas arquivos de dependências e instala
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia backend
COPY apps/backend ./apps/backend
WORKDIR /app/apps/backend

# Build do NestJS
RUN yarn build

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Copia build e package.json
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/yarn.lock ./

# Instala apenas dependências de produção
RUN yarn install --production --frozen-lockfile

# Definindo variáveis de ambiente
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

# Start command
# Sem aumentar heap, para não ultrapassar 512MB
CMD ["node", "dist/main.js"]
