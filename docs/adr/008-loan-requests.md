# ADR-008 — Solicitações de empréstimo

## Status

Aceito em 2026-11-16 para o fluxo de solicitação, reserva e decisão por
Operações. A implementação depende das pendências listadas ao final.

## Contexto

O PRD exige empréstimos com limite de três itens por pessoa, prazo padrão de
14 dias, bloqueio por atraso e visibilidade operacional dos pedidos abertos.
O ADR-005 decidiu apenas o catálogo inicial e o perfil; não definiu o modelo
nem as policies de RLS para empréstimos. O ADR-007 definiu o login, mas deixou
os dados reais de empréstimo fora de escopo. A usuária solicitou um fluxo
persistido no Supabase, sem dados fictícios e preservando o design e o login
existentes.

## Decisões

1. A API será Nest REST com Prisma. O Frontend encaminha a sessão autenticada
   para o Backend; o acesso ao banco deve preservar RLS e a identidade do
   usuário. Chaves privilegiadas não serão enviadas ao navegador nem usadas
   para contornar RLS.
2. O catálogo desta funcionalidade terá ao menos três acessórios reais,
   disponíveis para empréstimo, cada um com nome, imagem, descrição e status.
   Dados de demonstração existentes no Frontend não são fonte de inventário.
3. Equipment recebe uma descrição. Uma solicitação referencia o usuário
   autenticado e o equipamento, e guarda a data de retirada, a data prevista
   para devolução e seu status.
4. Uma solicitação nova começa como **Pendente** e reserva o equipamento,
   impedindo solicitações concorrentes para o mesmo item enquanto aguarda
   decisão de Operações.
5. Operações pode aprovar ou rejeitar uma solicitação pendente. Aprovar muda o
   equipamento para **Emprestado**; rejeitar libera o equipamento como
   **Disponível**. Devolução não faz parte desta entrega.
6. Usuários autenticados podem criar e consultar somente suas solicitações.
   Operações pode consultar todos os pedidos abertos e decidir solicitações
   pendentes. As policies devem ser aplicadas no banco.
7. As datas são valores sem horário. A retirada não pode ser anterior ao dia
   atual. A devolução inicia 14 dias corridos após a retirada, pode ser editada
   e não pode anteceder a retirada.
8. A interface de solicitação e “Meus empréstimos” preservará o fluxo de login
   e o design existentes. Não será implementada persistência somente no
   Frontend.
9. A usuária configura `DATABASE_URL` localmente e autoriza separadamente
   qualquer inspeção ou operação. O agente não executa escrita em produção.
10. Solicitações **Pendentes** não contam para o limite de três itens. Pedidos
    aprovados/itens emprestados contam; o bloqueio do PRD por atraso impede
    novas solicitações.

## Pendências antes da implementação

- Inspecionar, em modo somente leitura, o Supabase local após a usuária
  configurar `DATABASE_URL`. Os três acessórios e suas imagens devem vir de
  registros e assets reais; se não existirem, pedir a lista e as imagens
  aprovadas em vez de inventá-las.
- Definir uma forma versionada e compatível com as regras do projeto para
  criar as policies RLS. O Prisma Schema não representa policies RLS, e o
  ADR-001 descarta migrations SQL manuais; não contornar essa restrição.
- Confirmar, por migration gerada pelo Prisma contra a estrutura local
  existente, que nenhuma migration cria ou altera objetos de `auth`.

## Consequências

- Uma solicitação pendente bloqueia o item até a decisão de Operações.
- A aplicação precisa validar disponibilidade no banco e impedir duas
  reservas para o mesmo equipamento, não apenas desabilitar um botão.
- O estado atual do catálogo mock não satisfaz esta decisão e não será
  convertido em dados reais sem validação.
- Os limites e regras de atraso do PRD continuam válidos; solicitações
  pendentes ficam fora do limite de três.

## Fora de escopo

- Devolução e encerramento de empréstimos.
- Cadastro livre de novos equipamentos pela interface.
- Alterar o fluxo de autenticação definido pelo ADR-007.
- Upload de imagens ou escrita em Storage pelo agente.
