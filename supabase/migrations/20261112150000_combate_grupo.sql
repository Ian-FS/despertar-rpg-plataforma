-- Fase 2: rastreador de combate e painel do grupo ao vivo.

-- ============================================================
-- Resumo público das fichas (nome, nível, PV, PM, condições), espelhado da tabela fichas.
-- Existe para o Realtime: o jogador não pode ler a ficha dos outros, mas pode ler este resumo.
-- ============================================================

create table public.fichas_publico (
  id uuid primary key references public.fichas (id) on delete cascade,
  mesa_id uuid not null references public.mesas (id) on delete cascade,
  dono_id uuid not null references public.perfis (id) on delete cascade,
  tipo public.tipo_ficha not null,
  ativa boolean not null,
  etapa text not null,
  resumo jsonb not null,
  atualizado_em timestamptz not null default now()
);

create index fichas_publico_mesa_idx on public.fichas_publico (mesa_id);

alter table public.fichas_publico enable row level security;

create policy "fichas_publico: membros veem as de jogador; mestre vê todas" on public.fichas_publico
  for select to authenticated
  using (public.eh_membro(mesa_id) and (tipo = 'jogador' or public.eh_mestre(mesa_id)));

grant select on public.fichas_publico to authenticated;
grant select, insert, update, delete on public.fichas_publico to service_role;

create function public.espelhar_ficha_publico()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.fichas_publico (id, mesa_id, dono_id, tipo, ativa, etapa, resumo, atualizado_em)
  values (new.id, new.mesa_id, new.dono_id, new.tipo, new.ativa, new.etapa, new.resumo, new.atualizado_em)
  on conflict (id) do update set
    ativa = excluded.ativa,
    etapa = excluded.etapa,
    resumo = excluded.resumo,
    atualizado_em = excluded.atualizado_em;
  return new;
end;
$$;

revoke execute on function public.espelhar_ficha_publico() from public, anon, authenticated;

create trigger fichas_espelhar_publico
  after insert or update on public.fichas
  for each row execute function public.espelhar_ficha_publico();

-- fichas que já existem
insert into public.fichas_publico (id, mesa_id, dono_id, tipo, ativa, etapa, resumo, atualizado_em)
select id, mesa_id, dono_id, tipo, ativa, etapa, resumo, atualizado_em from public.fichas
on conflict (id) do nothing;

-- ============================================================
-- Combate da mesa (um por mesa; o estado inteiro num jsonb, gravado só pelo servidor)
-- ============================================================

create table public.combates (
  mesa_id uuid primary key references public.mesas (id) on delete cascade,
  estado jsonb not null,
  -- sobe a cada gravação: evita que dois cliques em "Próximo" ao mesmo tempo pulem dois turnos
  versao integer not null default 0,
  atualizado_em timestamptz not null default now()
);

alter table public.combates enable row level security;

create policy "combates: membros veem" on public.combates
  for select to authenticated
  using (public.eh_membro(mesa_id));

grant select on public.combates to authenticated;
grant select, insert, update, delete on public.combates to service_role;

alter publication supabase_realtime add table public.fichas_publico, public.combates;
