# ADR-009 — Session Pooler para Prisma CLI

## Status

Aceito em 2026-11-17.

## Contexto

O ADR-006 limita `DATABASE_URL` ao uso do Prisma CLI nesta entrega e deixa a
conexão do runtime fora de decisão. A conexão direta ao Postgres do Supabase
não está acessível na rede IPv4 atual. O Prisma CLI ainda precisa de uma
conexão com o banco para introspecção e geração de migrations.

## Decisões

1. `DATABASE_URL`, configurada localmente em `.env.local`, usa o Session Pooler
   compartilhado do Supabase para o Prisma CLI.
2. Esta entrega usa apenas `DATABASE_URL`; não cria `DIRECT_URL` nem usa o
   Transaction Pooler.
3. Esta decisão não define a conexão do runtime da aplicação. Quando o runtime
   precisar de conexão ao Postgres, a escolha exige outro ADR.
4. Gerar uma migration não autoriza aplicá-la ao banco. O agente deve parar
   antes de qualquer execução e aguardar confirmação explícita da usuária.
   Seed e outras escritas de produção também continuam sob execução manual da
   usuária.

## Alternativas consideradas

| Alternativa | Motivo para não adotar agora |
| --- | --- |
| Conexão direta ao Postgres | O endpoint direto não está acessível na rede IPv4 atual. |
| Transaction Pooler | Não é a conexão escolhida para o Prisma CLI nesta entrega. |
| `DIRECT_URL` separado | Não é necessário para o escopo atual de CLI; runtime ainda não foi iniciado. |

## Consequências

- O Prisma CLI usa a mesma `DATABASE_URL` configurada localmente, pelo Session
  Pooler.
- A conexão do runtime permanece não decidida e não deve ser inferida deste
  ADR.
- A geração local de migrations não executa nem autoriza sua aplicação no
  banco.

## Referências

- [ADR-006 — Vercel como plataforma de deploy e configuração](./006-vercel-deploy-configuration.md)
- [ADR-005 — Modelo inicial de catálogo e perfil](./005-initial-catalog-profile.md)
