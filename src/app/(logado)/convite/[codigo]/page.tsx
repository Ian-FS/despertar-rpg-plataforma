import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { clienteServidor } from '@/lib/supabase/servidor';
import { BotaoAceitar } from './botao-aceitar';

export const metadata: Metadata = { title: 'Convite · DESPERTAR' };

export default function PaginaConvite({ params }: PageProps<'/convite/[codigo]'>) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <Suspense fallback={<p className="text-apagado">Carregando convite…</p>}>
        <Convite params={params} />
      </Suspense>
    </main>
  );
}

async function Convite({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const supabase = await clienteServidor();
  const { data } = await supabase.rpc('ver_convite', { p_codigo: codigo });
  const convite = data?.[0];

  if (!convite)
    return (
      <div className="caixa flex flex-col gap-3 p-6 text-center">
        <h1 className="text-2xl font-bold">Convite inválido</h1>
        <p className="text-apagado">Este link não vale mais. Peça um link novo ao Mestre da mesa.</p>
        <Link href="/mesas" className="botao botao-discreto">
          Ver suas mesas
        </Link>
      </div>
    );

  return (
    <div className="janela flex flex-col gap-4 p-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ CONVITE ]</p>
      <h1 className="text-2xl font-bold break-words">{convite.nome}</h1>
      {convite.ja_sou_membro ? (
        <>
          <p className="text-apagado">Você já faz parte desta mesa.</p>
          <Link href={`/mesas/${convite.mesa_id}`} className="botao">
            Abrir a mesa
          </Link>
        </>
      ) : (
        <>
          <p className="text-apagado">Você foi convidado para esta mesa como Jogador.</p>
          <BotaoAceitar codigo={codigo} />
        </>
      )}
    </div>
  );
}
