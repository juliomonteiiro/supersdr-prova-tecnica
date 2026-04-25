# supersdr-prova-tecnica

Serviço de normalização de webhooks para o SuperSDR: recebe payloads específicos de cada provedor, valida, converte para um formato interno único e persiste mensagens com tratamento idempotente.

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuração

```bash
npm install
cp .env.example .env
```

Edite o `.env` e defina um `DATABASE_URL` válido.

Gere o Prisma Client:

```bash
npm run prisma:generate
```

## Banco de dados e migrations

O projeto usa **Prisma 7**. A URL do banco para o **Migrate** fica em `prisma.config.ts` (variável `DATABASE_URL`). Os arquivos SQL versionados ficam em `prisma/migrations` e devem ir para o Git.

**Primeira vez no ambiente local (desenvolvimento)**

Aplicar migrations já existentes e criar as tabelas:

```bash
npm run prisma:migrate:dev
```

Quando você alterar `schema.prisma` e precisar de uma nova migration, o Prisma pedirá um nome descritivo.

**Produção ou CI (sem prompts)**

Aplicar somente migrations já commitadas:

```bash
npm run prisma:migrate:deploy
```

**Conferir histórico de migrations vs banco**

```bash
npm run prisma:migrate:status
```

**Observação:** `npm run prisma:push` sincroniza o schema sem gerar arquivos de migration. Para a prova técnica, prefira **migrations** para qualquer mudança de schema que precise ser reproduzida a partir do repositório.

## Executar a API

```bash
npm run dev
```

- HTTP: `http://localhost:3000` (ou a porta definida no `.env`)
- Webhook: `POST /webhook/:provider` com `provider` em `zapi`, `meta` ou `evolution`
- Swagger: `/docs`

## Testes

```bash
npm test
```
