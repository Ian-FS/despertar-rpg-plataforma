import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Carregando } from '@/componentes/efeitos/carregando';
import { clienteServidor, usuarioAtual } from '@/lib/supabase/servidor';
import type { EtapaFicha, RegrasMesa, ResumoFicha } from '@/lib/supabase/tipos-banco';
import { REGRAS_PADRAO } from '@/lib/fichas/regras-padrao';
import { DESP } from '@/regras/dados';
import { BotaoSair, PainelConvite } from './controles';
import { PainelRegras } from './painel-regras';

export default function PaginaMesa({ params }: PageProps<'/mesas/[id]'>) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <Link href="/mesas" className="text-sm text-apagado hover:text-texto">
        ← Suas mesas
      </Link>
      <Suspense fallback={<Carregando texto="Sincronizando com o Sistema" />}>
        <DetalheMesa params={params} />
      </Suspense>
    </main>
  );
}

const ETAPA_TXT: Record<EtapaFicha, string> = {
  conceito: 'em criação',
  atributos: 'em criação: atributos',
  despertar: 'em criação: Despertar',
  avaliacao: 'em criação: Avaliação',
  pronta: '',
};

async function DetalheMesa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await usuarioAtual();
  if (!usuario) return null;
  const supabase = await clienteServidor();

  const [{ data: mesa }, { data: membros }, { data: fichas }, { data: grupo }] = await Promise.all([
    supabase.from('mesas').select('id, nome, codigo_convite, regras').eq('id', id).maybeSingle(),
    supabase.from('membros').select('usuario_id, papel, perfis(nome, avatar_url)').eq('mesa_id', id).order('entrou_em'),
    supabase.from('fichas').select('id, dono_id, tipo, ativa, etapa, resumo').eq('mesa_id', id).order('criado_em'),
    supabase.rpc('resumo_fichas', { p_mesa: id }),
  ]);
  // sem acesso (não é membro) ou inexistente: a RLS devolve vazio
  if (!mesa) notFound();

  const eu = membros?.find((m) => m.usuario_id === usuario.id);
  const souMestre = eu?.papel === 'mestre';
  const nomeDe = (uid: string) => membros?.find((m) => m.usuario_id === uid)?.perfis?.nome || 'Sem nome';
  const minhas = (fichas ?? []).filter((f) => f.dono_id === usuario.id);
  const doGrupo = (grupo ?? []).filter((f) => f.ativa && f.dono_id !== usuario.id);
  const regras: RegrasMesa = { ...REGRAS_PADRAO, ...(mesa.regras ?? {}) };

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className={`rotulo ${souMestre ? 'text-ouro' : ''}`}>Você é {souMestre ? 'o Mestre' : 'Jogador'}</span>
        <h1 className="text-3xl font-bold break-words">{mesa.nome}</h1>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="rotulo">Seus personagens</h2>
          <Link href={`/mesas/${id}/fichas/nova`} className="botao">
            Criar personagem
          </Link>
        </div>
        {minhas.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {minhas.map((f) => (
              <li key={f.id}>
                <CartaoFicha
                  href={`/mesas/${id}/fichas/${f.id}`}
                  resumo={f.resumo as ResumoFicha}
                  etapa={f.etapa}
                  marca={f.ativa ? 'ativa' : 'guardada'}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-apagado">Você ainda não tem personagem nesta mesa.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="rotulo">{souMestre ? 'Fichas dos jogadores' : 'Grupo'}</h2>
        {doGrupo.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {doGrupo.map((f) => (
              <li key={f.id}>
                <CartaoFicha
                  href={souMestre ? `/mesas/${id}/fichas/${f.id}` : null}
                  resumo={f.resumo}
                  etapa={f.etapa}
                  marca={nomeDe(f.dono_id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-apagado">Ninguém mais tem personagem ativo nesta mesa ainda.</p>
        )}
      </section>

      {souMestre && <PainelConvite mesaId={mesa.id} codigo={mesa.codigo_convite} />}
      {souMestre && <PainelRegras mesaId={mesa.id} regras={regras} />}

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

      {!souMestre && <BotaoSair mesaId={mesa.id} />}
    </>
  );
}

function CartaoFicha({
  href,
  resumo,
  etapa,
  marca,
}: {
  href: string | null;
  resumo: Partial<ResumoFicha>;
  etapa: EtapaFicha;
  marca: string;
}) {
  const pv = resumo.pvMax ? Math.max(0, Math.min(100, ((resumo.pvAtual ?? 0) / resumo.pvMax) * 100)) : 0;
  const conteudo = (
    <div className={`caixa flex flex-col gap-2 p-4 ${href ? 'hover:border-sys' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-lg font-semibold">{resumo.nome || 'Sem nome'}</span>
        <span className="rotulo shrink-0">{marca}</span>
      </div>
      {etapa !== 'pronta' ? (
        <span className="text-sm text-ouro">{ETAPA_TXT[etapa]}</span>
      ) : (
        <>
          <span className="text-sm text-apagado">
            Nível {resumo.nivel} · Rank {resumo.rank}
            {resumo.despertar && DESP[resumo.despertar] ? ` · ${DESP[resumo.despertar].n}` : ''}
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-24 shrink-0">
              PV {resumo.pvAtual}/{resumo.pvMax}
            </span>
            <span className="h-1.5 flex-1 bg-linha">
              <span className="block h-full bg-ok" style={{ width: `${pv}%` }} />
            </span>
          </div>
          {resumo.condicoes && <span className="text-xs text-perigo">{resumo.condicoes}</span>}
        </>
      )}
    </div>
  );
  return href ? <Link href={href}>{conteudo}</Link> : conteudo;
}
