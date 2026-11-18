# ADR-011 — Versionamento de policies RLS com Supabase CLI

## Status

Aceito em 2026-11-17.

## Contexto

O fluxo de empréstimo precisa de policies e funções RLS. Prisma não representa
esses objetos no schema. A usuária autorizou SQL versionado somente para RLS,
mantendo o Prisma como responsável pelas tabelas.

## Decisões

1. Tabelas, enums, relações e demais objetos de domínio continuam versionados
   pelas migrations do Prisma em `prisma/migrations/`.
2. Policies e funções RLS serão versionadas em `supabase/migrations/` e
   gerenciadas pelo Supabase CLI.
3. Migrations do Supabase CLI não podem criar ou alterar tabelas, enums,
   relações ou outros objetos de domínio que pertencem ao Prisma.
4. A migration do Prisma que cria ou altera um objeto deve preceder qualquer
   migration RLS que o referencie.
5. Nenhuma migration será aplicada ao banco de produção pelo agente. A usuária
   revisa e executa separadamente as operações de produção.

## Consequências

- Há dois históricos versionados com propriedade separada: Prisma para o
  schema de domínio e Supabase CLI para policies/funções RLS.
- Mudanças RLS precisam ser testadas no Supabase local e permanecer isoladas
  dos objetos de domínio.

## Referências

- [ADR-001 — Stack](./001-stack.md)
- [ADR-005 — Modelo inicial de catálogo e perfil](./005-initial-catalog-profile.md)
- [ADR-010 — Empréstimo imediato pelo colaborador](./010-immediate-loans.md)
