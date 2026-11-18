# Deploy conjunto na Vercel

O repositório do Frontend é a raiz de integração: o Vite gera o site estático e
`api/[...path].ts` encaminha `/api/*` para o NestJS. O Backend standalone
permanece separado; a cópia `backend/` deste repositório é a fonte usada pelo
deploy conjunto e deve acompanhar as alterações do Backend.

## Projeto Vercel

Use o projeto Vercel existente conectado ao repositório `Emprest_AI_Frontend`;
não crie um segundo projeto para a API. Configure:

- Framework Preset: Vite
- Root Directory: `.`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

A Vercel detecta automaticamente a função Node em `api/[...path].ts`; não é
necessário `vercel.json` nem um adaptador `serverless-http`.

## Variáveis de ambiente

Configure em **Settings → Environment Variables** para Preview e Production:

| Nome | Uso |
| --- | --- |
| `DATABASE_URL` | URL do Supabase Transaction Pooler para o runtime Vercel |
| `SUPABASE_URL` | URL do projeto Supabase usada pelo Backend |
| `SUPABASE_ANON_KEY` | Chave pública anon/publishable usada pelo Backend |
| `VITE_SUPABASE_URL` | URL do projeto Supabase incorporada no Frontend |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anon/publishable incorporada no Frontend |

Use valores protegidos reais apenas no painel. Nunca configure
`SUPABASE_SERVICE_ROLE_KEY`; `PORT` e `NODE_ENV` são gerenciados pela Vercel.

Para `DATABASE_URL`, copie o host e o usuário exibidos em **Supabase → Connect
→ Transaction pooler** e substitua a senha pelo valor protegido, codificando
caracteres reservados como URL:

```text
postgresql://postgres.<PROJECT_REF>:<URL_ENCODED_DB_PASSWORD>@<POOLER_HOST_FROM_SUPABASE_CONNECT>:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

O host do pooler varia por projeto e deve ser copiado do painel, não montado a
partir da região. O Prisma CLI local continua usando Session Pooler conforme o
ADR-014; o build da Vercel não executa migrations.

## Publicação e validação

Depois de enviar as alterações deste repositório para o remoto conectado, a
Vercel instalará as dependências do workspace, gerará o Prisma Client, compilará
o Backend, verificará a função e fará o build do Frontend. As rotas preservadas
são `GET /api/equipment`, `GET /api/loans` e `POST /api/loans`, autenticadas
pela sessão Supabase.

Uma chamada sem Bearer token deve retornar `401`, o que confirma a proteção da
API. O catálogo real ainda depende de conectividade ao Supabase e das tabelas e
dados já existirem. O build não executa migrations ou seeds; não publique
esperando dados até essa pré-condição ser confirmada.
