import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Carregando } from '@/componentes/efeitos/carregando';
import { REGRAS_PADRAO } from '@/lib/fichas/regras-padrao';
import { clienteServidor, usuarioAtual } from '@/lib/supabase/servidor';
import type { Personagem } from '@/regras/personagem';
import { normalizarPersonagem } from '@/regras/validacao';
import { Criacao } from './criacao';
import { EscolhaAvaliacao } from './escolha-avaliacao';
import { FichaEditor } from './ficha-editor';
import { PainelMestreFicha } from './painel-mestre';
import { SorteiosLiberados } from './sorteios-liberados';

export default function PaginaFicha({ params }: PageProps<'/mesas/[id]/fichas/[fichaId]'>) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Suspense fallback={<Carregando texto="Abrindo a Janela de Status" />}>
        <Conteudo params={params} />
      </Suspense>
    </main>
  );
}

async function Conteudo({ params }: { params: Promise<{ id: string; fichaId: string }> }) {
  const { id, fichaId } = await params;
  const usuario = await usuarioAtual();
  if (!usuario) return null;
  const supabase = await clienteServidor();

  const [{ data: ficha }, { data: mesa }, { data: eu }, { data: sorteios }] = await Promise.all([
    supabase.from('fichas').select('*').eq('id', fichaId).eq('mesa_id', id).maybeSingle(),
    supabase.from('mesas').select('nome, regras').eq('id', id).maybeSingle(),
    supabase.from('membros').select('papel').eq('mesa_id', id).eq('usuario_id', usuario.id).maybeSingle(),
    supabase.from('sorteios').select('*').eq('ficha_id', fichaId).order('criado_em'),
  ]);
  // a RLS só devolve a ficha para o dono e para o Mestre
  if (!ficha || !mesa) notFound();

  const souMestre = eu?.papel === 'mestre';
  const regras = { ...REGRAS_PADRAO, ...(mesa.regras ?? {}) };
  const p: Personagem = normalizarPersonagem(ficha.dados);
  const lista = sorteios ?? [];
  const ultimo = (tipo: string) => [...lista].reverse().find((s) => s.tipo === tipo);
  const avaliacaoPendente = ultimo('avaliacao')?.resultado?.escolhida == null ? ultimo('avaliacao') : undefined;
  const despertarPendente = ultimo('despertar')?.resultado?.escolhida == null ? ultimo('despertar') : undefined;

  return (
    <>
      <Link href={`/mesas/${id}`} className="text-sm text-apagado hover:text-texto">
        ← {mesa.nome}
      </Link>

      {ficha.etapa !== 'pronta' ? (
        <Criacao
          fichaId={ficha.id}
          etapa={ficha.etapa}
          p={p}
          regras={regras}
          sorteios={lista}
          despertarPendente={despertarPendente?.resultado?.opcoes ?? null}
          avaliacaoPendente={avaliacaoPendente?.resultado?.opcoes ?? null}
          liberados={ficha.sorteios_liberados}
        />
      ) : (
        <>
          {ficha.dono_id === usuario.id && (
            <SorteiosLiberados
              fichaId={ficha.id}
              liberados={ficha.sorteios_liberados}
              despertarPendente={despertarPendente?.resultado?.opcoes ?? null}
              metodoPadrao={regras.metodoPadrao}
            />
          )}
          {avaliacaoPendente && (
            <EscolhaAvaliacao
              fichaId={ficha.id}
              rank={avaliacaoPendente.resultado.rank}
              opcoes={avaliacaoPendente.resultado.opcoes}
            />
          )}
          <FichaEditor
            // recria o editor quando o servidor muda a ficha (subir de nível, Avaliação, novo sorteio)
            key={ficha.atualizado_em}
            fichaId={ficha.id}
            mesaId={id}
            usuarioId={usuario.id}
            inicial={p}
            souMestre={souMestre}
            regras={regras}
            podeEditar={ficha.dono_id === usuario.id || souMestre}
          />
        </>
      )}

      {souMestre && (
        <PainelMestreFicha fichaId={ficha.id} liberados={ficha.sorteios_liberados} sorteios={lista} />
      )}
    </>
  );
}
