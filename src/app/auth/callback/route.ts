/* Volta do login do Google: troca o código pela sessão e segue para a página pedida. */
import { NextResponse, type NextRequest } from 'next/server';
import { destinoSeguro } from '@/lib/destino-seguro';
import { clienteServidor } from '@/lib/supabase/servidor';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = destinoSeguro(searchParams.get('next'));

  if (code) {
    const supabase = await clienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  const erro = encodeURIComponent('O login não foi concluído. Tente de novo.');
  return NextResponse.redirect(`${origin}/entrar?next=${encodeURIComponent(next)}&erro=${erro}`);
}
