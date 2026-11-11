/* Cliente do Supabase para o servidor (componentes de servidor, ações e rotas).
   Crie um cliente novo a cada requisição; nunca reaproveite entre requisições. */
import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from './config';
import type { Database } from './tipos-banco';

export async function clienteServidor() {
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(lista) {
        try {
          for (const { name, value, options } of lista) cookieStore.set(name, value, options);
        } catch {
          // Componentes de servidor não podem gravar cookies; o proxy renova a sessão nesses casos.
        }
      },
    },
  });
}

export interface UsuarioAtual {
  id: string;
  email: string | null;
}

/** Usuário logado, com o token verificado. null se não houver sessão. */
export async function usuarioAtual(): Promise<UsuarioAtual | null> {
  const supabase = await clienteServidor();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: typeof claims.email === 'string' ? claims.email : null };
}
