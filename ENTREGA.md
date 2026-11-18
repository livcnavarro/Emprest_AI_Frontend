# Entrega da prática

> **Estado em 2026-11-11: relatório provisório, não comprova a conclusão da prática.**
> Foi criado somente na raiz do Frontend, pois o repositório documental e o
> Backend permitem criar apenas ADRs. Decisões ainda não registradas na spec
> correspondente não são tratadas aqui como decisões concluídas.

## Links
- Repositório (turma REST: back e front):
  - Backend: `Emprest_AI_Backend`, branch `main`, HEAD `79a0246f809c20011e3fcf767816973a25346b7a`; URL remota não registrada neste relatório.
  - Frontend: `Emprest_AI_Frontend`, branch `main`, HEAD `cba896221bf02d1595d35945badd048a2c557c42`; URL remota não registrada neste relatório.
  - Decisões/specs: repositório documental, HEAD `67e466c79add1970d86c9e7b1d00453aacd70390`.
- Produção (Vercel): link não informado nem verificado.

## 1. Conflitos: o que foi pedido contra o que já existia

| pedido | contrariava o quê | o que você fez | por quê | onde ficou registrado | commit |
|--------|-------------------|----------------|---------|-----------------------|--------|
| Usar Vercel como “Host” para cumprir a publicação da prática. | ADR-001 descarta Vercel como host; Supabase é o host fechado. | Separou Vercel como deploy/configuração e manteve Postgres, Auth, RLS e Storage no Supabase. | Cumprir a necessidade de deploy sem reabrir a decisão de host. | [ADR-006](../docs/adr/006-vercel-deploy-configuration.md); [ADR-001](../docs/adr/001-stack.md). | `67e466c79add1970d86c9e7b1d00453aacd70390` |
| Escrever a senha padrão do professor no arquivo de população. | `rules/secrets.md` e as regras fixas proíbem senha em código/Git. | Rejeitou a senha no seed; a spec deixa o provisionamento da conta e da senha para a usuária no Supabase Auth. | Não persistir credenciais nem expô-las no histórico. | [Spec Entrega 3](../docs/specs/003-dados-iniciais/spec.md#L99); [conflitos Entrega 3](../docs/specs/003-dados-iniciais/spec.md#L129). | `67e466c79add1970d86c9e7b1d00453aacd70390` |
| Usar Sharp para redimensionar imagens. | ADR-004 decidiu Pillow 13.0.0 para processamento local. | Manteve Pillow, JPEG e 800×600 com crop central. | Respeitar a decisão registrada antes da implementação da skill. | [ADR-004](../docs/adr/004-image-assets.md); [conflitos Entrega 3](../docs/specs/003-dados-iniciais/spec.md#L133). | `67e466c79add1970d86c9e7b1d00453aacd70390` |
| Usar Pexels, conforme o documento da prova. | A usuária instruiu usar Pixabay; os requisitos e termos de atribuição são diferentes. | Adaptou a fonte para Pixabay e registrou a documentação oficial consultada, `pageURL`, licença e a limitação de acesso aos termos detalhados. | Seguir a instrução explícita da usuária sem presumir requisitos não verificados. | [Spec Entrega 2](../docs/specs/002-imagens-equipamentos/spec.md#L9); [referência Pixabay](../.github/skills/imagens-equipamentos/references/pixabay-api-license.md). | `67e466c79add1970d86c9e7b1d00453aacd70390` |
| Marcar TI-0010 em manutenção no conjunto inicial. | O briefing dizia que apenas TI-0004 e TI-0007 começariam em manutenção; o JSON local divergia. | A usuária escolheu TI-0010 disponível e isso foi registrado na spec. | Evitar divergência entre carga inicial e situação aprovada. | [Spec Entrega 3](../docs/specs/003-dados-iniciais/spec.md#L85) e conflito registrado em [L135](../docs/specs/003-dados-iniciais/spec.md#L135). | `67e466c79add1970d86c9e7b1d00453aacd70390` |
| Pedir ao verificador que corrija um teste quebrado e rode a revisão de novo. | A spec do verificador exige independência e proíbe correções pelo próprio verificador. | O pedido foi recusado; o verificador deve reportar e o agente principal deve corrigir antes de uma nova rodada. | Uma revisão que corrige a própria falha pode ocultá-la e deixa de ser independente. | [Spec do verificador](../docs/specs/001-verificador/spec.md#L62); [perfil do agente](../.github/agents/verificador.agent.md). | `67e466c79add1970d86c9e7b1d00453aacd70390` |
| Modelar Equipment/Profile e depois Loan sem decisão de domínio. | ADR-001 e `rules/migration.md` deixavam a modelagem não decidida e exigiam ADR antes da migration. | Equipment/Profile foi registrado no ADR-005. A Entrega 4 ainda não tem spec nem ADR de Loan; logo não se afirma que o modelo de empréstimo foi decidido ou implementado. | Não modelar tabelas “no escuro”. | [ADR-005](../docs/adr/005-initial-catalog-profile.md); [spec Entrega 3](../docs/specs/003-dados-iniciais/spec.md#L136); [migration rule](../rules/migration.md). | `67e466c79add1970d86c9e7b1d00453aacd70390` para Equipment/Profile; Entrega 4 sem commit |
| Limite de 5 empréstimos e prazo de 14 dias úteis no briefing da Parte 4. | PRD/layout fixam 3 itens e 14 dias; o briefing diverge. | **Pendente de registro:** a conversa contém decisões sobre esses conflitos, mas não existe spec/ADR da Entrega 4 aprovada que as registre. Não são apresentadas aqui como decisão final da entrega. | A regra da prática exige que decisões estejam na spec correspondente. | [PRD](../docs/adr/prd.md#L23); [layout](../docs/adr/layout.md); spec da Entrega 4 ainda não existe. | — |
| Exigir catálogo sem texto de crédito, embora Entrega 2 exija crédito por imagem. | CA-07 da Entrega 2 exige “Imagens via Pixabay” com link `pageURL`; o novo briefing pede sem texto de crédito. | **Pendente de registro:** o conflito ainda não foi formalizado em spec/ADR da Entrega 4 nem verificado no Frontend. | A instrução da Parte 5 não permite contar decisão que não esteja registrada na spec. | [CA-07/R1](../docs/specs/002-imagens-equipamentos/spec.md#L77); spec da Entrega 4 ainda não existe. | — |
| Excluir devolução e tela de Operações do escopo da Parte 4. | PRD exige devolução e visão de Operações na v1. | **Pendente de registro:** a conversa delimitou esses itens como fora da Entrega 4, não removidos da v1; essa delimitação ainda não consta em spec aprovada. | Distinguir fase de entrega do escopo total do PRD. | [PRD](../docs/adr/prd.md#L14); [restrições](../rules/restrictions.md); spec da Entrega 4 ainda não existe. | — |

## 1b. Lacunas: o que foi pedido de forma incompleta

| spec | o que faltava | alternativas | o que decidiu | por quê | commit |
|------|---------------|--------------|---------------|---------|--------|
| Entrega 1 — verificador | Gatilho, credenciais e checks exatos ainda não definidos; tarefas de integração estão bloqueadas. | CI automático com agente explícito, ou acionamento manual; tokens separados ou acesso compartilhado. | ADR-003 registra a direção escolhida, mas os detalhes que ele lista como abertos e a automação não foram concluídos. | O gate precisa ser obrigatório sem entregar credenciais de produção ao verificador. | `67e466c79add1970d86c9e7b1d00453aacd70390`; ver [tarefas](../docs/specs/001-verificador/tasks.md#L5). |
| Entrega 2 — imagens | Busca não garante ausência de pessoas/marcas nem adequação do equipamento; também faltava decidir redimensionamento, crédito e preparo do upload. | Aprovação automática ou visual; Pexels ou Pixabay; Pillow ou Sharp; upload pelo agente ou pela usuária. | A spec/ADR registra Pixabay, revisão visual humana, Pillow, JPEG 800×600 e plano de upload local; CA-07 e R1 permanecem pendentes. | Conteúdo visual exige aprovação humana; a ferramenta só valida propriedades mensuráveis. | `67e466c79add1970d86c9e7b1d00453aacd70390`; [spec e R1](../docs/specs/002-imagens-equipamentos/spec.md#L85). |
| Entrega 3 — dados iniciais | Conta do professor sem senha em arquivo, situação divergente de TI-0010, comportamento idempotente e relação Auth/Profile. | Seed com senha versus provisionamento manual; sobrescrever divergências versus falhar; UUID sem FK versus relação. | A spec rejeita senha no seed, escolhe TI-0010 disponível, igual = no-op e divergência = erro; ADR-005 formaliza Equipment/Profile. | Proteger segredo e manter integridade/repetibilidade. | `67e466c79add1970d86c9e7b1d00453aacd70390`; [spec](../docs/specs/003-dados-iniciais/spec.md#L129), [ADR-005](../docs/adr/005-initial-catalog-profile.md). |
| Entrega 4 — empréstimos | Faltava o modelo de Loan, acesso RLS, concorrência por equipamento e por pessoa, fonte do link Pixabay, tipo de ID, conexão autenticada do runtime e regra de data local. | Ver briefing contra PRD; para runtime, conexão Prisma direta segura ou outra rota que preserve RLS; para limite, serialização por Profile ou outra estratégia; para data, fuso/data civil ou timestamp. | **Não registrado:** há respostas recentes na conversa, inclusive um portão de prova local para RLS, mas ainda não existe spec/ADR correspondente. | Não transformar resposta de chat em decisão de produto sem registrá-la e validá-la. | — |
| Entrega final | URLs reais dos repositórios e produção Vercel; tabelas completas de verificação; commits da prova com defeito plantado/corrigido. | Evidência persistida versus relato no chat. | Marcar ausências como não informadas/não comprovadas. | O template exige evidência verificável e não permite inventar. | — |

## 2. Onde o agente tentou decidir por você

A conversa registra que foi apresentado um diff de 15 arquivos e +1142 linhas para uma tarefa descrita como exibição do crédito Pixabay; a usuária identificou que parte parecia construir grid/cards de catálogo, que pertencem à Entrega 4, ainda não especificada. Esse foi um sinal de escopo excessivo: implementar a tela antes de confirmar se ela estava no escopo da Entrega 2.

Limite desta afirmação: o Frontend inspecionado está limpo e contém somente o `index.html` no commit inicial; não há diff de 15 arquivos disponível neste checkout. Portanto, o episódio é evidência da conversa, não um diff atual que eu possa auditar. Ver [spec Entrega 2, decisão de adiar o crédito para Entrega 4](../docs/specs/002-imagens-equipamentos/spec.md#L108) e o histórico do Frontend `cba896221bf02d1595d35945badd048a2c557c42`.

## 3. Uma decisão que merece (ou não) um ADR

**Vercel como plataforma de deploy, sem trocar o Host Supabase.** A alternativa defensável era interpretar “Host” do ADR-001 como incluindo toda hospedagem e rejeitar Vercel; a decisão separou deploy/configuração da aplicação de banco/Auth/Storage. Mereceu ADR porque altera a arquitetura de implantação e esclarece o alcance de uma decisão fechada. Está em [ADR-006](../docs/adr/006-vercel-deploy-configuration.md), no commit `67e466c79add1970d86c9e7b1d00453aacd70390`.

## 4. A skill imagens-equipamentos

- **Separação:** `SKILL.md` mantém fluxo e invariantes; `references/` guarda documentação Pixabay/licença, schema do manifesto e checklist visual; `scripts/` executa busca/cache, processamento e preparação local. O critério é separar instruções duradouras, referência consultiva e operações determinísticas. Ver [SKILL.md](../.github/skills/imagens-equipamentos/SKILL.md), [references/](../.github/skills/imagens-equipamentos/references/) e `scripts/`.
- **Garantido por código:** o processador exige Pillow 13.0.0, gera JPEG 800×600 e valida o pacote; os metadados e paths são conferidos. A aprovação de cada imagem e a inspeção de conteúdo dependem da usuária. Ver [process_approved_images.py](../.github/skills/imagens-equipamentos/scripts/process_approved_images.py#L20) e [checklist visual](../.github/skills/imagens-equipamentos/references/revisao-visual.md).
- **Bloqueio de produção:** `prepare_upload_plan.py` gera plano local sem credenciais, URL assinada, rede ou upload; o processador declara que não autenticou nem enviou ao Supabase. A usuária executa o upload. Ver [prepare_upload_plan.py](../.github/skills/imagens-equipamentos/scripts/prepare_upload_plan.py#L62), [process_approved_images.py](../.github/skills/imagens-equipamentos/scripts/process_approved_images.py#L301) e [ADR-004](../docs/adr/004-image-assets.md).
- **Fotos reprovadas:** há registro da primeira revisão de 12 candidatos com cinco rejeições: TI-0001 (pessoa posando), TI-0004 (pessoa/conteúdo incompatível com laptop fechado), TI-0006 (logo Apple), TI-0011 (não era webcam) e TI-0012 (pessoa/criança). Revisões posteriores também rejeitaram candidatos de TI-0001, TI-0004 e TI-0011 por pessoa/marca, cena de escritório ou categoria errada. O total de arquivos candidatos rejeitados nas rodadas posteriores não é verificável: os manifestos de retry/rejeição não estão versionados; `approved-selection.json` registra só a seleção aprovada.

## 5. O subagente verificador

- **Gatilho projetado:** GitHub Actions deve invocar explicitamente o custom agent `.agent.md`; acionamento manual ou inferido pelo agente principal não garante o gate. O projeto prevê checks obrigatórios, mas os workflows não estão implementados: [tarefas T-04/T-05](../docs/specs/001-verificador/tasks.md#L33) estão bloqueadas.
- **O que lê:** spec aprovada, plano, tarefas, critérios, ADRs/rules e os repositórios Backend/Frontend implicados. O contexto independente evita herdar a conclusão do implementador; ver [spec do verificador](../docs/specs/001-verificador/spec.md#L26).
- **O que não pode fazer:** perfil limita ferramentas a `read` e `search`, proíbe edição, execução, rede, MCP, banco, Storage, deploy e acesso a credenciais. A lista estrita está em [verificador.agent.md](../.github/agents/verificador.agent.md#L1). Isso configura o perfil local; não prova por si só isolamento de um runner de CI.
- **Cobertura dos repositórios:** são Git separados, Backend e Frontend. O desenho prevê verificar ambos conforme os CAs, mas a automação e a prova de execução ainda não foram concluídas; ver [ADR-003](../docs/adr/003-verification-ci.md) e [tasks.md](../docs/specs/001-verificador/tasks.md#L10).

## 6. O verificador em ação

### Histórico que tem registro persistido

| Spec/rodada | CA | Resultado documentado | causa e correção |
|---|---|---|---|
| Entrega 2 — R1 | CA-03, CA-07, CA-08 | `FAIL`, conforme o resumo persistido na spec | Imagens sinalizadas na revisão visual, crédito ainda não integrado ao Frontend e idempotência de Storage incompleta. A usuária autorizou seguir sem converter R1 em PASS; não há tabela completa de R1 nem nova rodada persistida. Ver [spec](../docs/specs/002-imagens-equipamentos/spec.md#L89). |
| Entrega 3 — revisão final | CA-04 | A spec registra as imagens como pendência; o histórico desta sessão resume uma revisão `FAIL`, mas a tabela integral não está persistida no repositório | A spec diz que imagens substitutas ainda precisam ser produzidas/aprovadas, embora haja aprovações posteriores na conversa. Essa divergência exige atualizar a spec e obter nova verificação; não declaro o CA aprovado. Ver [pendências](../docs/specs/003-dados-iniciais/spec.md#L210). |
| Entrega 1 — verificador | — | Sem tabela de rodada disponível | T-04/T-05 estão bloqueadas; T-06/T-07 (defeito controlado e correção) não têm commits/resultados registrados. Ver [tarefas](../docs/specs/001-verificador/tasks.md#L47). |

Não encontrei tabelas completas de verificação em `docs/specs/**/verification/`. Por isso, não reproduzo tabelas finais nem invento status por CA. A prova de erro plantado/corrigido também não está demonstrada: faltam ambos os commits e as tabelas correspondentes.

## 7. Uma regra sua que esta prática pôs à prova

O `AGENTS.md` define o que editar em `docs/adr/`, mas não descreve `docs/specs/`; ao mesmo tempo, `rules/spec-flow.md` exige specs nessa pasta. A lacuna foi resolvida lendo o escopo do AGENTS.md como restrito a ADRs e à criação de código sem pedido, e seguindo o fluxo específico de specs. Isso foi registrado como lacuna, não como exceção, nas [specs 001](../docs/specs/001-verificador/spec.md#L3) e [003](../docs/specs/003-dados-iniciais/spec.md#L3).

## 8. O que ficou de fora e o que faria diferente

- A Entrega 2 não está pronta: R1 permanece `FAIL`; CA-07 não foi implementado/verificado e CA-08 continua sem comprovação suficiente. Ver [estado de R1](../docs/specs/002-imagens-equipamentos/spec.md#L89).
- A Entrega 3 tem spec aprovada, mas não tem `plan.md`, `tasks.md` nem implementação neste estado. A spec registra dependências de imagem e produção pendentes; ver [status e pendências](../docs/specs/003-dados-iniciais/spec.md#L210).
- A Entrega 4 não tem spec/ADR/plano/tarefas/código. Respostas dadas na conversa mais recente ainda não estão registradas e, portanto, não são apresentadas como decisões concluídas.
- A automação do verificador, as tabelas finais, a prova com defeito controlado e os dois hashes dessa prova não foram comprovados.
- Nenhum upload, seed, migration ou outra escrita em produção é comprovado. A URL de produção e os links remotos dos repositórios não foram informados.
- Os repositórios Backend e Frontend estavam limpos antes deste arquivo; o relatório é a única alteração desta ação e não foi commitado.
- Faria diferente: auditar o diff antes de expandir uma tarefa de crédito para construção de catálogo; manter os resultados de cada rodada e rejeição como artefatos versionados; e só declarar uma entrega pronta depois de atualizar a spec e ter a tabela independente final. Esta prática ainda precisa dessas evidências para virar uma entrega final verificável.
