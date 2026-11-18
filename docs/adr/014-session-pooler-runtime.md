# ADR-014 — Poolers do Prisma CLI e do runtime serverless

## Status

Aceito em 2026-11-17 e atualizado em 2026-11-17 após a decisão explícita de
separar a conexão do Prisma CLI da conexão do runtime serverless.

## Contexto

O ADR-009 escolheu o Session Pooler para o Prisma CLI. A API Nest roda como
Vercel Function e precisa de uma conexão que suporte o padrão serverless de
instâncias curtas e escaláveis. A recomendação do Supabase é usar Transaction
Pooler nesse runtime.

## Decisões

1. O Prisma CLI local continua usando o Session Pooler por `DATABASE_URL`,
   conforme o ADR-009.
2. O Prisma Client no runtime Vercel usa o Transaction Pooler compartilhado do
   Supabase por `DATABASE_URL`, na porta `6543`, com `pgbouncer=true` e
   `connection_limit=1`.
3. `DATABASE_URL` mantém o mesmo nome, mas seu valor é específico do ambiente:
   Session Pooler no ambiente local do CLI e Transaction Pooler no runtime
   Vercel. Valores reais são configurados pela usuária, nunca gravados no
   repositório.
4. O build Vercel não executa migrations. Não usar a URL Transaction Pooler
   para comandos Prisma CLI que dependam de comportamento de sessão.
5. O uso de RLS e a identidade do colaborador permanecem obrigatórios. A
   implementação não pode usar uma credencial privilegiada para contornar as
   policies; o contexto autenticado deve ser definido dentro da transação de
   cada operação.

## Consequências

- O runtime serverless reduz conexões por instância e desativa prepared
  statements para compatibilidade com o Transaction Pooler compartilhado.
- O Prisma CLI local e o runtime Vercel usam valores protegidos distintos de
  `DATABASE_URL`; o modo apropriado depende do tipo de execução.
- A implementação deve estabelecer o contexto autenticado dentro de cada
  transação, sem vazar identidade entre conexões reutilizadas pelo pool.
- Uma mudança futura no modo de conexão do Prisma CLI exige outro ADR.

## Referências

- [ADR-006 — Vercel como plataforma de deploy e configuração](./006-vercel-deploy-configuration.md)
- [ADR-009 — Session Pooler para Prisma CLI](./009-prisma-cli-session-pooler.md)
- [ADR-010 — Empréstimo imediato pelo colaborador](./010-immediate-loans.md)
