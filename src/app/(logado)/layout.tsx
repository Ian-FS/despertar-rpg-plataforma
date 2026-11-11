import Link from 'next/link';
import { Suspense } from 'react';
import { ControlesEfeitos } from '@/componentes/efeitos/controles';
import { ProvedorEfeitos } from '@/componentes/efeitos/provedor';
import { clienteServidor, usuarioAtual } from '@/lib/supabase/servidor';

/* Moldura das páginas que exigem login: barra no topo com o nome de quem está logado. */
export default function LayoutLogado({ children }: { children: React.ReactNode }) {
  return (
    <ProvedorEfeitos>
      <header className="border-b border-linha">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/mesas" className="font-mono text-sm font-semibold tracking-[0.2em] text-sys">
            DESPERTAR
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <ControlesEfeitos />
            <Suspense fallback={null}>
              <Usuario />
            </Suspense>
          </div>
        </div>
      </header>
      {children}
    </ProvedorEfeitos>
  );
}

async function Usuario() {
  const usuario = await usuarioAtual();
  if (!usuario) return null;
  const supabase = await clienteServidor();
  const { data: perfil } = await supabase.from('perfis').select('nome').eq('id', usuario.id).maybeSingle();
  return (
    <div className="flex min-w-0 items-center gap-3 text-sm">
      <span className="truncate text-apagado">{perfil?.nome || usuario.email}</span>
      <form action="/sair" method="post">
        <button className="botao botao-discreto px-3 py-1 text-sm">Sair</button>
      </form>
    </div>
  );
}
