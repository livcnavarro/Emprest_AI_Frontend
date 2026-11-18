# ADR-010 — Empréstimo imediato pelo colaborador

## Status

Aceito em 2026-11-17 para o recorte de solicitação pelo colaborador.

## Contexto

O ADR-008 definiu solicitações pendentes e decisão por Operações. O briefing
posterior substitui esse fluxo por criação imediata do empréstimo, mantendo
devolução e a tela de Operações para um recorte posterior da v1. O PRD limita
cada pessoa a três itens em aberto; o briefing inicial propôs cinco, e a
usuária confirmou manter o limite do PRD.

## Decisões

1. Ao solicitar, o empréstimo é criado imediatamente como aberto. Não há
   aprovação de Operações nem fila de espera.
2. Só equipamentos **Disponíveis** podem ser solicitados. Equipamentos
   **Emprestados** ou **Em manutenção** não podem ser solicitados.
3. A criação do empréstimo e a indisponibilização do equipamento são uma
   operação atômica. Solicitações concorrentes para o mesmo equipamento
   resultam em no máximo um empréstimo criado.
4. O prazo previsto é de 14 dias corridos após o pedido.
   Nota de correção: O texto original do ADR seguiu literalmente o briefing,
   mas uma decisão anterior da usuária, já registrada em conversa, tinha
   prioridade.
5. O limite é de três empréstimos em aberto por pessoa, conforme o PRD.
   Empréstimos em atraso impedem uma nova solicitação.
6. O colaborador vê o catálogo com imagem, nome, categoria e situação, e seus
   próprios empréstimos em aberto com a data prevista para devolução.
7. Devolução e tela de Operações ficam fora deste recorte, mas continuam no
   escopo da v1 do PRD. Até que o fluxo de devolução seja entregue, empréstimos
   permanecem abertos e os respectivos equipamentos indisponíveis.
8. Reserva futura, notificações por e-mail e renovação ficam fora deste recorte.
9. A apresentação do catálogo mostra “Imagens via Pixabay” com link discreto
   junto a cada imagem.
   Nota de correção: O texto original do ADR seguiu literalmente o briefing,
   mas uma decisão anterior da usuária, já registrada em conversa, tinha
   prioridade.

## Pendências técnicas

- Definir o modelo persistido do empréstimo e as policies RLS.
- Definir como versionar policies RLS sem violar a propriedade de migrations
  determinada pelo ADR-001.
- Validar os equipamentos e as imagens reais do catálogo antes de exibi-los.

## Consequências

- Este ADR substitui as decisões de fluxo pendente, aprovação por Operações e
  datas editáveis do ADR-008 para o recorte atual.
- O limite de três e o bloqueio por atraso permanecem alinhados ao PRD.
- A ausência de devolução neste recorte implica que a disponibilidade não pode
  ser restaurada pela interface até a entrega futura desse fluxo.
