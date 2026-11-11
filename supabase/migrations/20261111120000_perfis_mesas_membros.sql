-- Fase 0: perfis, mesas e membros.
-- Princípio: tudo nasce fechado (RLS ligado, sem acesso para "anon"); liberamos só o necessário.

-- ============================================================
-- Tabelas
-- ============================================================

create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  avatar_url text,
  criado_em timestamptz not null default now()
);

create table public.mesas (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(trim(nome)) between 1 and 80),
  -- código do link de convite (12 caracteres aleatórios)
  codigo_convite text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12),
  criado_por uuid not null references public.perfis (id),
  criado_em timestamptz not null default now()
);

create type public.papel_mesa as enum ('mestre', 'jogador');

create table public.membros (
  mesa_id uuid not null references public.mesas (id) on delete cascade,
  usuario_id uuid not null references public.perfis (id) on delete cascade,
  papel public.papel_mesa not null default 'jogador',
  entrou_em timestamptz not null default now(),
  primary key (mesa_id, usuario_id)
);

create index membros_usuario_idx on public.membros (usuario_id);

alter table public.perfis enable row level security;
alter table public.mesas enable row level security;
alter table public.membros enable row level security;

-- ============================================================
-- Funções auxiliares das regras de acesso
-- (security definer para consultar "membros" sem cair na própria RLS)
-- ============================================================

create function public.eh_membro(p_mesa uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.membros m
    where m.mesa_id = p_mesa and m.usuario_id = (select auth.uid())
  );
$$;

create function public.eh_mestre(p_mesa uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.membros m
    where m.mesa_id = p_mesa and m.usuario_id = (select auth.uid()) and m.papel = 'mestre'
  );
$$;

-- o usuário atual divide alguma mesa com p_usuario?
create function public.divide_mesa_com(p_usuario uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.membros eu
    join public.membros outro on outro.mesa_id = eu.mesa_id
    where eu.usuario_id = (select auth.uid()) and outro.usuario_id = p_usuario
  );
$$;

-- ============================================================
-- Regras de acesso (RLS)
-- ============================================================

-- perfis: cada um vê o próprio e o de quem está nas mesmas mesas; edita só o próprio
create policy "perfis: ver o próprio e dos colegas de mesa" on public.perfis
  for select to authenticated
  using (id = (select auth.uid()) or public.divide_mesa_com(id));

create policy "perfis: editar o próprio" on public.perfis
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- mesas: membros veem; o Mestre edita e apaga. Criar é pela função criar_mesa().
create policy "mesas: membros veem" on public.mesas
  for select to authenticated
  using (public.eh_membro(id));

create policy "mesas: mestre edita" on public.mesas
  for update to authenticated
  using (public.eh_mestre(id))
  with check (public.eh_mestre(id));

create policy "mesas: mestre apaga" on public.mesas
  for delete to authenticated
  using (public.eh_mestre(id));

-- membros: membros veem a lista; o Mestre muda papéis; cada um sai sozinho ou o Mestre remove.
-- Entrar é pela função entrar_na_mesa().
create policy "membros: membros veem" on public.membros
  for select to authenticated
  using (public.eh_membro(mesa_id));

create policy "membros: mestre muda papel" on public.membros
  for update to authenticated
  using (public.eh_mestre(mesa_id))
  with check (public.eh_mestre(mesa_id));

create policy "membros: sair ou ser removido pelo mestre" on public.membros
  for delete to authenticated
  using (usuario_id = (select auth.uid()) or public.eh_mestre(mesa_id));

-- ============================================================
-- Ações (funções chamadas pelo site)
-- ============================================================

-- cria a mesa e coloca quem criou como Mestre, numa operação só
create function public.criar_mesa(p_nome text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_mesa uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'É preciso entrar para criar uma mesa.';
  end if;
  insert into public.mesas (nome, criado_por) values (trim(p_nome), (select auth.uid())) returning id into v_mesa;
  insert into public.membros (mesa_id, usuario_id, papel) values (v_mesa, (select auth.uid()), 'mestre');
  return v_mesa;
end;
$$;

-- entra na mesa pelo código do convite (se já for membro, só devolve a mesa)
create function public.entrar_na_mesa(p_codigo text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_mesa uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'É preciso entrar para aceitar o convite.';
  end if;
  select id into v_mesa from public.mesas where codigo_convite = p_codigo;
  if v_mesa is null then
    raise exception 'Convite inválido ou expirado.';
  end if;
  insert into public.membros (mesa_id, usuario_id) values (v_mesa, (select auth.uid()))
    on conflict (mesa_id, usuario_id) do nothing;
  return v_mesa;
end;
$$;

-- mostra o nome da mesa de um convite (para a tela "Você foi convidado"), sem precisar ser membro
create function public.ver_convite(p_codigo text)
returns table (mesa_id uuid, nome text, ja_sou_membro boolean)
language sql stable security definer set search_path = ''
as $$
  select m.id, m.nome, public.eh_membro(m.id)
  from public.mesas m
  where m.codigo_convite = p_codigo;
$$;

-- gera um código de convite novo (invalida o antigo); só o Mestre
create function public.novo_convite(p_mesa uuid)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_codigo text := substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
begin
  if not public.eh_mestre(p_mesa) then
    raise exception 'Só o Mestre pode gerar um novo convite.';
  end if;
  update public.mesas set codigo_convite = v_codigo where id = p_mesa;
  return v_codigo;
end;
$$;

-- cria o perfil quando alguém entra pela primeira vez (nome e foto vêm do Google)
create function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.perfis (id, nome, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- ============================================================
-- Permissões (as tabelas não são expostas automaticamente)
-- ============================================================

revoke all on public.perfis, public.mesas, public.membros from anon, authenticated;
grant select on public.perfis, public.mesas, public.membros to authenticated;
grant update (nome, avatar_url) on public.perfis to authenticated;
grant update (nome) on public.mesas to authenticated;
grant update (papel) on public.membros to authenticated;
grant delete on public.mesas, public.membros to authenticated;

revoke execute on function
  public.eh_membro(uuid), public.eh_mestre(uuid), public.divide_mesa_com(uuid),
  public.criar_mesa(text), public.entrar_na_mesa(text), public.novo_convite(uuid), public.ver_convite(text),
  public.criar_perfil_novo_usuario()
from public, anon;

grant execute on function
  public.eh_membro(uuid), public.eh_mestre(uuid), public.divide_mesa_com(uuid),
  public.criar_mesa(text), public.entrar_na_mesa(text), public.novo_convite(uuid), public.ver_convite(text)
to authenticated;
