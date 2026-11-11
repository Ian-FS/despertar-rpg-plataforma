-- O servidor (chave secreta = papel service_role) ignora a RLS, mas ainda precisa de permissão
-- nas tabelas, porque o projeto não expõe tabelas novas automaticamente.

grant select, insert, update, delete on
  public.perfis, public.mesas, public.membros, public.fichas, public.sorteios
to service_role;

-- tabelas criadas daqui em diante já nascem liberadas para o servidor
alter default privileges in schema public grant select, insert, update, delete on tables to service_role;
