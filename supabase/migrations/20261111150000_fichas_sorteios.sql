-- Fase 1: regras opcionais da mesa, fichas e registro de sorteios.
-- Escrita em fichas e sorteios acontece só pelo servidor (chave secreta), que valida as regras.
-- O navegador só lê: dono e Mestre veem a ficha completa; os demais membros veem o resumo.

-- ============================================================
-- Regras opcionais da mesa (o Mestre liga e desliga)
-- ============================================================

alter table public.mesas
  add column regras jsonb not null
  default '{"metodoPadrao": false, "escolhaGuiada": false, "marcos": false, "provacao": false}'::jsonb;

grant update (regras) on public.mesas to authenticated;

-- ============================================================
-- Fichas
-- ============================================================

create type public.tipo_ficha as enum ('jogador', 'npc');

create table public.fichas (
  id uuid primary key default gen_random_uuid(),
  mesa_id uuid not null references public.mesas (id) on delete cascade,
  dono_id uuid not null references public.perfis (id) on delete cascade,
  tipo public.tipo_ficha not null default 'jogador',
  -- só uma ficha de jogador ativa por pessoa em cada mesa
  ativa boolean not null default true,
  -- etapa da criação: conceito → atributos → despertar → avaliacao → pronta
  etapa text not null default 'conceito'
    check (etapa in ('conceito', 'atributos', 'despertar', 'avaliacao', 'pronta')),
  -- o personagem (escolhas do jogador); valores derivados são recalculados pelo motor de regras
  dados jsonb not null,
  -- resumo calculado pelo servidor a cada gravação: nome, nível, PV, PM, condições
  resumo jsonb not null default '{}'::jsonb,
  -- sorteios que o Mestre liberou para serem refeitos (ex.: {'atributos'})
  sorteios_liberados text[] not null default '{}',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index fichas_mesa_idx on public.fichas (mesa_id);
create unique index fichas_uma_ativa_por_jogador on public.fichas (mesa_id, dono_id)
  where ativa and tipo = 'jogador';

alter table public.fichas enable row level security;

create policy "fichas: dono e mestre veem a ficha completa" on public.fichas
  for select to authenticated
  using (dono_id = (select auth.uid()) or public.eh_mestre(mesa_id));

grant select on public.fichas to authenticated;

-- resumo das fichas de jogador da mesa para todos os membros (nome, nível, PV, PM, condições)
create function public.resumo_fichas(p_mesa uuid)
returns table (id uuid, dono_id uuid, ativa boolean, etapa text, resumo jsonb)
language sql stable security definer set search_path = ''
as $$
  select f.id, f.dono_id, f.ativa, f.etapa, f.resumo
  from public.fichas f
  where f.mesa_id = p_mesa
    and f.tipo = 'jogador'
    and public.eh_membro(p_mesa)
  order by f.criado_em;
$$;

-- ============================================================
-- Sorteios (registro imutável de toda rolagem da criação e das subidas de nível)
-- ============================================================

create table public.sorteios (
  id uuid primary key default gen_random_uuid(),
  ficha_id uuid not null references public.fichas (id) on delete cascade,
  mesa_id uuid not null references public.mesas (id) on delete cascade,
  autor_id uuid not null references public.perfis (id) on delete cascade,
  tipo text not null,
  resultado jsonb not null,
  criado_em timestamptz not null default now()
);

create index sorteios_ficha_idx on public.sorteios (ficha_id, criado_em);

alter table public.sorteios enable row level security;

create policy "sorteios: dono da ficha e mestre veem" on public.sorteios
  for select to authenticated
  using (
    public.eh_mestre(mesa_id)
    or exists (select 1 from public.fichas f where f.id = ficha_id and f.dono_id = (select auth.uid()))
  );

grant select on public.sorteios to authenticated;

-- ============================================================
-- Permissões das funções
-- ============================================================

revoke execute on function public.resumo_fichas(uuid) from public, anon;
grant execute on function public.resumo_fichas(uuid) to authenticated;
