/* Cliente do Supabase com a chave secreta: ignora a RLS. Só no servidor, e só depois de
   conferir a permissão de quem está pedindo (ver src/lib/fichas/). Nunca importe em 'use client'. */
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from './config';
import type { Database } from './tipos-banco';

export function clienteAdmin() {
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (!chave) throw new Error('SUPABASE_SECRET_KEY não configurada (.env.local e variáveis da Vercel).');
  return createClient<Database>(SUPABASE_URL, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
