-- Fase 2: tempo real.
-- 1) A ficha aberta em outra tela se atualiza sozinha quando o Mestre (ou o servidor) muda algo.
-- 2) Registro de rolagens da mesa, que todos os membros veem ao vivo.
-- O Realtime respeita a RLS: cada um só recebe as linhas que já podia ler.

-- ============================================================
-- Fichas: quem fez a última alteração (para avisar "o Mestre alterou sua ficha")
-- ============================================================

alter table public.fichas
  add column alterado_por uuid references public.perfis (id) on delete set null;

-- ============================================================
-- Rolagens (feitas no servidor; o navegador só lê)
-- ============================================================

create table public.rolagens (
  id uuid primary key default gen_random_uuid(),
  mesa_id uuid not null references public.mesas (id) on delete cascade,
  ficha_id uuid references public.fichas (id) on delete set null,
  autor_id uuid not null references public.perfis (id) on delete cascade,
  -- nome mostrado no registro (personagem e/ou pessoa), gravado na hora da rolagem
  quem text not null,
  rotulo text not null,
  -- a rolagem completa: fórmula, dados, total e texto
  resultado jsonb not null,
  margem_critico smallint not null default 20,
  -- rolagem secreta: só o autor e o Mestre veem
  secreta boolean not null default false,
  criado_em timestamptz not null default now()
);

create index rolagens_mesa_idx on public.rolagens (mesa_id, criado_em desc);

alter table public.rolagens enable row level security;

create policy "rolagens: membros veem as públicas; secretas só autor e mestre" on public.rolagens
  for select to authenticated
  using (
    public.eh_membro(mesa_id)
    and (not secreta or autor_id = (select auth.uid()) or public.eh_mestre(mesa_id))
  );

grant select on public.rolagens to authenticated;
grant select, insert, update, delete on public.rolagens to service_role;

-- ============================================================
-- Liga o tempo real nas duas tabelas
-- ============================================================

alter publication supabase_realtime add table public.fichas, public.rolagens;
