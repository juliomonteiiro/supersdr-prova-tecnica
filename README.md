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

## Z-API (webhook real)

A Z-API só entrega webhooks em **HTTPS**. Para testar na sua máquina, use um túnel (por exemplo [ngrok](https://ngrok.com/), **Microsoft Dev Tunnels** ou Cloudflare Tunnel) apontando para a porta do `.env` (`PORT`).

### Onde colar a URL no painel (obrigatório)

Configure a URL **somente** no webhook **«Ao receber»** (mensagens que **chegam** na instância).

**Não** use **«Ao enviar»** para esse fluxo: esse campo é para eventos de mensagens **enviadas** por você pela API, com outro tipo de payload.

Exemplo de URL pública (túnel Microsoft Dev Tunnels + rota do projeto):

- `https://<subdominio>-<porta>.brs.devtunnels.ms/webhook/zapi` (troque `<subdominio>` e `<porta>` pelos valores do seu túnel)

### Validação em ambiente real

Este fluxo **foi validado** com instância Z-API real: webhook em **«Ao receber»**, túnel HTTPS e gravação na tabela `Message` (`provider = zapi`, `externalId` = `messageId` da Z-API).

### Fuso horário e coluna `createdAt`

O horário gravado em `createdAt` vem do **`momment`** do payload da Z-API (timestamp em **milissegundos**, epoch UTC), quando o campo vem preenchido; caso contrário, usa o relógio do processo Node (`new Date()`).

No PostgreSQL o Prisma usa `timestamp(3)` **sem** fuso (`timestamp without time zone`): o valor é armazenado como “relógio civil” que o driver envia. Se o **servidor do Postgres**, o **cliente SQL** (DBeaver, etc.) ou o **processo Node** estiverem com **timezone em UTC**, e você comparar mentalmente com **América/São_Paulo** (UTC−3), é comum parecer **+3 horas** de diferença na visualização — não é causado pelo domínio do túnel (`devtunnels.ms`), e sim por **UTC vs horário de Brasília** na cadeia “origem do timestamp → gravação → ferramenta que exibe”.

Para conferir no banco:

```sql
SHOW TIMEZONE;
SELECT "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo' AS created_at_sp FROM "Message" LIMIT 5;
```

Se no futuro quiser padronizar tudo com fuso explícito no Postgres, a evolução natural é migrar para `timestamptz` e alinhar `TimeZone` da sessão ou da instância.

**Token (`Client-Token`, opcional mas recomendado em produção)**

1. No painel da Z-API, copie o token de segurança da conta ([documentação](https://developer.z-api.io/security/client-token)).
2. No `.env`, defina o mesmo valor em `ZAPI_CLIENT_TOKEN`. Com isso, todo `POST /webhook/zapi` precisa do header `Client-Token: <mesmo valor>`.
3. Se **não** definir `ZAPI_CLIENT_TOKEN`, o endpoint aceita o webhook sem checagem de header (útil para Postman / dev local).

Payloads reais podem trazer campos extras (por exemplo `instanceId`); o adapter aceita campos adicionais e normaliza `messageId`, `phone`, `text` e `momment` quando presentes.

## Testes

```bash
npm test
```
