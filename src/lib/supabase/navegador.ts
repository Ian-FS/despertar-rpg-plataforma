/* Cliente do Supabase para componentes que rodam no navegador ('use client'). */
import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from './config';
import type { Database } from './tipos-banco';

export function clienteNavegador() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_CHAVE_PUBLICA);
}
