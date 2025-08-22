# Exemplify-SEE

Sistema de criação e gerenciamento de planos de aula baseado em abordagens pedagógicas e eixos temáticos.

## 📁 Estrutura do Monorepo

Este projeto utiliza [Turborepo](https://turborepo.com/) para gerenciar um monorepo com as seguintes aplicações:

### 🏗️ Aplicações

- **`apps/backend`** - API REST em NestJS com autenticação Firebase e banco PostgreSQL
- **`apps/frontend`** - Interface web em Next.js 15 com React 19 e Tailwind CSS

### 🗄️ Banco de Dados

- **PostgreSQL 16** rodando em container Docker
- **Prisma ORM** para gerenciamento do banco
- **Migrations** para controle de versão do schema
- **Seed** para dados iniciais

### 🔧 Tecnologias Principais

- **Backend**: NestJS, Prisma, PostgreSQL, Firebase Admin
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI
- **Monorepo**: Turborepo, Yarn Workspaces
- **Autenticação**: Firebase Authentication
- **Banco**: PostgreSQL com Docker

## 🚀 Como Inicializar o Projeto

### Pré-requisitos

- Node.js >= 18
- Yarn >= 1.22.22
- Docker e Docker Compose

### 1. Clone e Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd exemplify-see

# Instale as dependências do monorepo
yarn install
```

### 2. Configuração do Banco de Dados

```bash
# Suba o container do PostgreSQL
docker-compose up -d

# Verifique se o container está rodando
docker ps
```

### 3. Configuração do Backend

```bash
# Entre na pasta do backend
cd apps/backend

# Copie o arquivo de ambiente (se existir)
cp .env.example .env

# Configure as variáveis de ambiente no .env:
# DATABASE_URL="postgresql://postgres:dev123@localhost:5432/exemplify-see"
# FIREBASE_PROJECT_ID="seu-projeto-firebase"
# FIREBASE_PRIVATE_KEY="sua-chave-privada"
# FIREBASE_CLIENT_EMAIL="seu-email-cliente"

# Execute as migrations do Prisma
yarn db:migrate:deploy

# Execute o seed para dados iniciais
yarn db:seed

# Volte para a raiz do projeto
cd ../..
```

### 4. Executar as Aplicações

```bash
# Desenvolvimento completo (backend + frontend)
yarn dev

# Ou execute separadamente:

# Backend apenas
yarn dev --filter=backend

# Frontend apenas  
yarn dev --filter=frontend
```

### 5. Acessar as Aplicações

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Banco de Dados**: localhost:5432

## 📊 Estrutura do Banco de Dados

O sistema possui as seguintes entidades principais:

- **Users**: Usuários com autenticação Firebase
- **Approaches**: Abordagens pedagógicas
- **Axis**: Eixos temáticos dentro das abordagens
- **Questions**: Perguntas associadas aos eixos
- **Answers**: Respostas possíveis para as perguntas
- **Transitions**: Transições entre perguntas baseadas nas respostas
- **LessonPlans**: Planos de aula criados pelos usuários

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Executar todas as aplicações
yarn dev

# Build de todas as aplicações
yarn build

# Lint de todas as aplicações
yarn lint

# Verificar tipos TypeScript
yarn check-types
```

### Banco de Dados

```bash
# Visualizar o banco no Prisma Studio
yarn db:studio

# Criar nova migration
yarn db:migrate

# Aplicar migrations existentes
yarn db:migrate:deploy

# Resetar o banco (cuidado!)
yarn db:migrate:reset

# Ver status das migrations
yarn db:migrate:status

# Executar seed
yarn db:seed

# Gerar cliente Prisma
yarn db:generate

# Push do schema para o banco
yarn db:push

# Pull do schema do banco
yarn db:pull
```

### Docker

```bash
# Parar o banco
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Ver logs do banco
docker-compose logs postgres
```

## 🔐 Configuração do Firebase

Para que a autenticação funcione, você precisa:

1. Criar um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ativar Authentication com Google
3. Criar uma conta de serviço e baixar a chave privada
4. Configurar as variáveis de ambiente no `.env`

## 📝 Scripts Disponíveis

### Root (Monorepo)
- `yarn dev` - Executa backend e frontend em desenvolvimento
- `yarn build` - Build de todas as aplicações
- `yarn lint` - Lint de todas as aplicações
- `yarn format` - Formatação com Prettier

### Banco de Dados (Prisma)
- `yarn db:studio` - Abre o Prisma Studio para visualizar o banco
- `yarn db:migrate` - Cria nova migration baseada nas mudanças do schema
- `yarn db:migrate:deploy` - Aplica migrations existentes
- `yarn db:migrate:reset` - Reseta o banco e aplica migrations + seed
- `yarn db:migrate:status` - Mostra status das migrations
- `yarn db:seed` - Executa o seed para dados iniciais
- `yarn db:generate` - Gera o cliente Prisma
- `yarn db:push` - Push do schema para o banco
- `yarn db:pull` - Pull do schema do banco

### Backend
- `yarn dev` - Executa em modo watch
- `yarn start` - Executa em produção
- `yarn test` - Executa testes

### Frontend
- `yarn dev` - Executa com Turbopack
- `yarn build` - Build para produção
- `yarn start` - Servidor de produção

## 🐛 Solução de Problemas

### Banco não conecta
```bash
# Verifique se o container está rodando
docker ps

# Reinicie o container
docker-compose restart postgres
```

### Erro de migrations
```bash
cd apps/backend
npx prisma migrate reset
npx prisma db seed
```

### Portas ocupadas
- Backend: 3001
- Frontend: 3000  
- PostgreSQL: 5432

## 📚 Documentação Adicional

- [Turborepo Docs](https://turborepo.com/docs)
- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
