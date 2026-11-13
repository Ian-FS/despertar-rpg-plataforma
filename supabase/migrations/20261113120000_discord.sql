-- Fase 2: webhook do Discord por mesa.
-- A URL do webhook dá a quem a tiver o poder de postar no canal, então fica numa tabela que
-- nenhum usuário lê: só o servidor (chave secreta) grava e lê. A RLS fica ligada e sem nenhuma
-- política para "authenticated", ou seja, ninguém pelo navegador enxerga nada aqui.

create table public.mesas_segredos (
  mesa_id uuid primary key references public.mesas (id) on delete cascade,
  discord_webhook text,
  atualizado_em timestamptz not null default now()
);

alter table public.mesas_segredos enable row level security;

revoke all on public.mesas_segredos from anon, authenticated;
grant select, insert, update, delete on public.mesas_segredos to service_role;
