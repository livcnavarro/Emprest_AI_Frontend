# ADR-016 — Identificador e timestamps do empréstimo

## Status

Aceito em 2026-11-17.

## Contexto

O ADR-013 definiu os campos mínimos do empréstimo e o tipo `DATE` de
`due_date`, mas não fechou o tipo do identificador nem dos timestamps. A
implementação precisa de uma representação consistente para as relações e
datas do registro.

## Decisões

1. `id` usa UUID no Postgres e o Prisma gera o valor com `@default(uuid())`.
2. `created_at` e `returned_at` usam `TIMESTAMPTZ`. `returned_at` permanece
   nulo enquanto o empréstimo está aberto.
3. `due_date` permanece `DATE`, conforme o ADR-013.

## Consequências

- Timestamps representam instantes; o cálculo e a apresentação da data
  prevista continuam usando `America/Sao_Paulo`.
- O modelo Prisma e sua migration devem preservar esses tipos.

## Referências

- [ADR-013 — Registro do empréstimo e cálculo do prazo](./013-loan-record-and-due-date.md)
