# ADR-006 — Vercel como plataforma de deploy e configuração

## Status

Aceito em 2026-11-11 e atualizado em 2026-11-17 após aprovação explícita, para
esclarecer o papel de Vercel sem reabrir o host do ADR-001.

## Contexto

O ADR-001 descarta Vercel como **Host** porque banco e autenticação devem
permanecer no Supabase. O projeto também precisa de uma plataforma para
deploy/configuração e de um painel onde variáveis de ambiente de Preview e
Production possam ser configuradas. O ADR-003 trata GitHub Actions como CI e
não escolhe a plataforma de deploy do produto.

## Decisões

1. Supabase permanece host de Postgres, Auth, RLS e Storage.
2. Vercel é a plataforma de deploy/configuração da aplicação; seu painel
   Preview/Production é o destino de configuração das variáveis de ambiente
   usadas pelos deployments.
3. Vercel não substitui nem hospeda o banco, Auth ou Storage do Supabase.
4. O projeto Vercel único do Frontend e da API expõe o Backend Nest por uma
   Vercel Node Function catch-all em `api/[...path].ts`. Essa função inicializa
   o Nest com `@nestjs/platform-express` e encaminha as requisições HTTP ao
   Express do Nest. A implantação combinada não usa o detector de projeto
   NestJS standalone da Vercel nem mantém um processo contínuo.
5. O runtime serverless do Backend na Vercel usa o Transaction Pooler
   compartilhado do Supabase em `DATABASE_URL`, na porta `6543`, com
   `pgbouncer=true` e `connection_limit=1`. O Prisma CLI local mantém o Session
   Pooler conforme o ADR-014; o build Vercel não executa migrations.
   Essa separação segue as recomendações do
   [Supabase para conexões serverless](https://supabase.com/docs/guides/database/connecting-to-postgres)
   e do
   [guia Supabase/Prisma](https://supabase.com/docs/guides/database/prisma).
6. `DATABASE_URL` deve seguir `rules/secrets.md`: `.env.local`,
   `.env.example` sem valor real e painel Vercel Preview/Production. Os
   valores podem ser diferentes por ambiente. A usuária configura valores
   reais diretamente nos destinos; o agente não recebe, grava, transmite ou
   usa esses valores.
7. O ambiente Vercel do Backend também requer `SUPABASE_URL` e
   `SUPABASE_ANON_KEY`. Deve ser usada somente a chave pública anon/
   publishable; não se usa `service_role`.
8. Esta decisão não automatiza migration, seed, deploy ou qualquer escrita
   em produção. A usuária executa as ações de produção.

## Alternativas consideradas

| Alternativa | Motivo para não adotar |
| --- | --- |
| Vercel como Host de banco/Auth/Storage | Reabre a alternativa descartada no ADR-001; Supabase continua sendo host desses serviços. |
| Deixar Vercel sem papel e não configurar variáveis de deployment | Não atende à regra de `rules/secrets.md`, que requer o painel Vercel para variáveis usadas pelo projeto, nem à escolha explícita da usuária de Vercel como deploy/config. |
| Escrever valores reais de conexão em arquivos ou no Git | Viola `rules/secrets.md` e as regras fixas de proteção de credenciais. |

## Consequências

- Código de aplicação pode ser implantado/configurado em Vercel sem transferir
  banco, Auth, RLS ou Storage do Supabase.
- Valores reais de `DATABASE_URL` serão inseridos pela usuária em cada destino;
  os arquivos versionados terão somente nomes e placeholders sem valor.
- O Backend é executado por invocação de Function, não como processo Nest
  continuamente ativo; aplicam-se os limites de duração e pacote das Vercel
  Functions. Consulte os
  [limites oficiais](https://vercel.com/docs/functions/limitations).
- O runtime de produção usa o Transaction Pooler do Supabase. O cliente Prisma
  limita cada instância serverless a uma conexão; estado de RLS é configurado
  dentro da transação de cada operação.
- A integração de deploy mantém uma cópia do Backend standalone em
  `Emprest_AI_Frontend/backend/`. Essa duplicação cria risco explícito de
  divergência entre os repositórios; a estratégia para uma única fonte de
  verdade ou sincronização automatizada fica como dívida técnica a resolver
  depois desta entrega.
- Nenhuma mudança em policies, migrations de produção, seed de produção ou
  Storage é autorizada por este ADR.
- CI continua tratado pelo ADR-003.

## Fora de decisão

- Organização, estrutura dos projetos e domínios no Vercel.
- Configuração operacional de duração das Functions e gestão de conexões do
  Prisma no runtime.
- Estratégia permanente para eliminar ou sincronizar a cópia do Backend entre
  os repositórios, a ser resolvida após esta entrega.
- Pipeline ou automação de CI/CD e política de publicação.
- Rotação e recuperação de credenciais.
