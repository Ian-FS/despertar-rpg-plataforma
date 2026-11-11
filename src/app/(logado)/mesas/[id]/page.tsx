import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { clienteServidor, usuarioAtual } from '@/lib/supabase/servidor';
import { BotaoSair, PainelConvite } from './controles';

export default function PaginaMesa({ params }: PageProps<'/mesas/[id]'>) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <Link href="/mesas" className="text-sm text-apagado hover:text-texto">
        ← Suas mesas
      </Link>
      <Suspense fallback={<p className="text-apagado">Carregando…</p>}>
        <DetalheMesa params={params} />
      </Suspense>
    </main>
  );
}

async function DetalheMesa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await usuarioAtual();
  if (!usuario) return null;
  const supabase = await clienteServidor();

  const [{ data: mesa }, { data: membros }] = await Promise.all([
    supabase.from('mesas').select('id, nome, codigo_convite').eq('id', id).maybeSingle(),
    supabase
      .from('membros')
      .select('usuario_id, papel, perfis(nome, avatar_url)')
      .eq('mesa_id', id)
      .order('entrou_em'),
  ]);
  // sem acesso (não é membro) ou inexistente: a RLS devolve vazio
  if (!mesa) notFound();

  const eu = membros?.find((m) => m.usuario_id === usuario.id);
  const souMestre = eu?.papel === 'mestre';

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className={`rotulo ${souMestre ? 'text-ouro' : ''}`}>Você é {souMestre ? 'o Mestre' : 'Jogador'}</span>
        <h1 className="text-3xl font-bold break-words">{mesa.nome}</h1>
      </div>

      {souMestre && <PainelConvite mesaId={mesa.id} codigo={mesa.codigo_convite} />}

      <section className="caixa flex flex-col gap-3 p-4">
        <h2 className="rotulo">Membros · {membros?.length ?? 0}</h2>
        <ul className="flex flex-col gap-2">
          {membros?.map((m) => (
            <li key={m.usuario_id} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                {m.perfis?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.perfis.avatar_url} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="h-8 w-8 rounded-full bg-linha" aria-hidden />
                )}
                <span className="truncate">{m.perfis?.nome || 'Sem nome'}</span>
              </span>
              <span className={`rotulo shrink-0 ${m.papel === 'mestre' ? 'text-ouro' : ''}`}>{m.papel}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="caixa flex flex-col gap-2 p-4">
        <h2 className="rotulo">Em breve</h2>
        <p className="text-sm text-apagado">
          Fichas, dados, combate e mapa desta mesa chegam nas próximas fases.
        </p>
      </section>

      {!souMestre && <BotaoSair mesaId={mesa.id} />}
    </>
  );
}
