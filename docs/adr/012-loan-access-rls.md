# ADR-012 — Acesso a empréstimos por RLS

## Status

Aceito em 2026-11-17 para o recorte de empréstimo imediato.

## Contexto

O PRD permite que cada colaborador veja seus próprios empréstimos e exige
visibilidade operacional de todos os empréstimos em aberto. A tela de
Operações foi adiada para um recorte posterior da v1, mas a consulta de
Operações não será removida do produto.

## Decisões

1. Um colaborador autenticado pode consultar somente os próprios empréstimos.
2. Operações pode consultar todos os empréstimos em aberto, sem ações de
   aprovação, devolução ou alteração neste recorte.
3. Equipamentos do catálogo podem ser lidos por usuários autenticados.
4. Policies e funções RLS são versionadas conforme o ADR-011. O mecanismo de
   criação atômica ainda precisa impedir que usuários alterem livremente a
   situação dos equipamentos ou criem empréstimos em nome de outra pessoa.

## Fora de escopo

- Aprovar ou rejeitar empréstimos.
- Registrar devoluções ou encerrar empréstimos.
- Interface de Operações.
