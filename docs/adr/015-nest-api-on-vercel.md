# ADR-015 — API Nest no mesmo projeto Vercel

## Status

Aceito em 2026-11-17 para a API de empréstimos.

## Contexto

O ADR-006 escolhe Vercel como plataforma de deploy/configuração da aplicação,
mas deixa o runtime e o domínio de cada repositório fora de decisão. A API
Nest precisa ser acessível pelo Frontend para o fluxo de empréstimos.

## Decisões

1. A API Nest será implantada no mesmo projeto Vercel do Frontend, atendendo
   requisições REST sob o prefixo `/api`.
2. O Frontend chama a API pela origem atual usando caminhos `/api`; não será
   introduzida uma variável de ambiente para a URL-base da API.
3. Supabase permanece host de Postgres, Auth, RLS e Storage. O pooler do runtime
   Vercel segue os ADRs-006 e -014; o Prisma CLI local continua no Session
   Pooler. Nenhuma credencial privilegiada pode contornar RLS.
4. A implementação deve validar que o build e o runtime Nest funcionam nesse
   projeto Vercel. Se a integração exigir mudar de host ou alterar o prefixo
   público, parar e solicitar novo ADR.

## Consequências

- Frontend e API compartilham deploy e origem pública; as chamadas da API
  usam `/api`.
- Variáveis do runtime, incluindo `DATABASE_URL`, continuam protegidas e
  configuradas pela usuária nos ambientes Vercel apropriados.
- A configuração do projeto e a compatibilidade efetiva do runtime devem ser
  verificadas antes de declarar o deploy funcional.

## Referências

- [ADR-006 — Vercel como plataforma de deploy e configuração](./006-vercel-deploy-configuration.md)
- [ADR-007 — Runtime do Frontend e login](./007-frontend-runtime-and-auth.md)
- [ADR-014 — Poolers do Prisma CLI e do runtime serverless](./014-session-pooler-runtime.md)
