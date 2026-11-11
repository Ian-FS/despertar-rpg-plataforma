/* Roda antes de cada página: renova a sessão do Supabase (cookies) e manda para o login
   quem tenta abrir uma área restrita sem estar logado. */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from '@/lib/supabase/config';

const AREAS_RESTRITAS = ['/mesas', '/convite'];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(lista, headers) {
        for (const { name, value } of lista) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of lista) response.cookies.set(name, value, options);
        for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
      },
    },
  });

  // Não coloque código entre a criação do cliente e getClaims(): é aqui que a sessão é renovada.
  const { data } = await supabase.auth.getClaims();
  const logado = !!data?.claims?.sub;

  const { pathname, search } = request.nextUrl;
  if (!logado && AREAS_RESTRITAS.some((a) => pathname === a || pathname.startsWith(a + '/'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/entrar';
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
