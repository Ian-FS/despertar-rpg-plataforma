import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { clienteServidor, usuarioAtual } from '@/lib/supabase/servidor';
import { FormNovaMesa } from './form-nova-mesa';

export const metadata: Metadata = { title: 'Mesas · DESPERTAR' };

export default function Mesas() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <h1 className="text-3xl font-bold">Suas mesas</h1>
      <Suspense fallback={<p className="text-apagado">Carregando…</p>}>
        <ListaMesas />
      </Suspense>
      <section className="caixa flex flex-col gap-3 p-4">
        <h2 className="rotulo">Criar mesa nova</h2>
        <p className="text-sm text-apagado">Quem cria a mesa é o Mestre e convida os jogadores por link.</p>
        <FormNovaMesa />
      </section>
    </main>
  );
}

async function ListaMesas() {
  const usuario = await usuarioAtual();
  if (!usuario) return null;
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from('membros')
    .select('papel, mesas(id, nome)')
    .eq('usuario_id', usuario.id)
    .order('entrou_em', { ascending: false });

  if (error) return <p className="text-perigo">Não foi possível carregar suas mesas. Recarregue a página.</p>;
  const mesas = (data ?? []).filter((m) => m.mesas);
  if (!mesas.length)
    return (
      <p className="text-apagado">
        Você ainda não está em nenhuma mesa. Crie uma abaixo ou abra o link de convite que o Mestre mandou.
      </p>
    );

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {mesas.map(({ papel, mesas: mesa }) => (
        <li key={mesa!.id}>
          <Link href={`/mesas/${mesa!.id}`} className="caixa flex items-center justify-between gap-3 p-4 hover:border-sys">
            <span className="truncate text-lg font-semibold">{mesa!.nome}</span>
            <span className={`rotulo shrink-0 ${papel === 'mestre' ? 'text-ouro' : ''}`}>{papel}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
