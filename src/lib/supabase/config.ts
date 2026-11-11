/* Endereço e chave pública do Supabase, lidos de .env.local (ou das variáveis da Vercel). */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_CHAVE_PUBLICA = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_CHAVE_PUBLICA) {
  console.warn(
    'Supabase não configurado: crie o arquivo .env.local a partir de .env.example ' +
      '(NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).',
  );
}
