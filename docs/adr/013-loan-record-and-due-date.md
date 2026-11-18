# ADR-013 — Registro do empréstimo e cálculo do prazo

## Status

Aceito em 2026-11-17.

## Contexto

O fluxo de empréstimo imediato precisa persistir a pessoa, o equipamento, a
data do pedido e o prazo de devolução. O pedido não passa por estado Pendente.

## Decisões

1. O registro mínimo do empréstimo contém `id`, `auth_user_id`,
   `equipment_patrimony`, `created_at`, `due_date` e `returned_at`.
2. `auth_user_id` referencia a identidade autenticada; `equipment_patrimony`
   referencia o patrimônio do equipamento.
3. `due_date` é uma data civil (`DATE`). `returned_at` nulo representa
   empréstimo em aberto; não há estado Pendente.
4. Os 14 dias corridos são contados após o pedido. O cálculo usa o fuso
   `America/Sao_Paulo`.
   Nota de correção: O texto original do ADR seguiu literalmente o briefing,
   mas uma decisão anterior da usuária, já registrada em conversa, tinha
   prioridade.

## Consequências

- Limite de empréstimos em aberto e bloqueio por atraso usam a mesma data civil
  e o mesmo fuso.
- `returned_at` permite registrar uma devolução em uma entrega futura, embora
  a interface de devolução esteja fora do recorte atual.

## Referências

- [ADR-010 — Empréstimo imediato pelo colaborador](./010-immediate-loans.md)
- [ADR-012 — Acesso a empréstimos por RLS](./012-loan-access-rls.md)
