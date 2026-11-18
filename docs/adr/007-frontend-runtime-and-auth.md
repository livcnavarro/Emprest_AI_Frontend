# ADR-007 — Runtime do Frontend e login

## Status

Aceito em 2026-11-16.

## Contexto

O Frontend seguia como um HTML estático, embora o ADR-001 já determine
TypeScript e React. O ADR-001 deixa build e servidor de desenvolvimento em
aberto. O PRD exige login e que cada pessoa veja os próprios empréstimos. A
usuária escolheu Vite para executar o Frontend e autenticação por e-mail e
senha no Supabase Auth.

## Decisões

1. Vite será usado para o servidor de desenvolvimento e o build do Frontend,
   mantendo React e TypeScript conforme o ADR-001.
2. O login usará Supabase Auth com e-mail e senha por meio do cliente oficial
   `@supabase/supabase-js`.
3. O navegador receberá somente a URL do projeto e a chave pública (anon).
   Chave de serviço não será usada no Frontend; formatos de chave `secret` ou
   JWT com papel `service_role` são rejeitados pela inicialização do cliente.
4. A URL e a chave pública serão fornecidas por `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY`. Sem configuração válida, o login informa o erro e
   não simula autenticação.
5. Sessão, entrada e saída serão gerenciadas pelo Supabase Auth. A sessão
   autenticada libera a interface existente; a autenticação não substitui nem
   define policies de RLS.
6. O fluxo de Operações permanece indisponível até uma decisão específica de
   autorização por papel. A integração de dados reais de empréstimos também
   permanece fora deste ADR.

## Consequências

- O Frontend terá comandos locais `npm run dev` e `npm run build`.
- Valores reais de ambiente não serão incluídos no Git. A usuária configura a
  URL e a chave pública localmente e nos destinos Preview/Production da Vercel.
- O build pode ser executado sem credenciais, mas a autenticação real exige as
  duas variáveis configuradas.
- O catálogo e outros dados demonstrativos existentes não se tornam dados
  reais por causa do login.

## Fora de decisão

- Políticas exatas de RLS e autorização por papel.
- Fluxo de recuperação de senha, cadastro e autenticação institucional.
- Rotas e estratégia geral de navegação do Frontend.
- API e modelo de dados para empréstimos.
