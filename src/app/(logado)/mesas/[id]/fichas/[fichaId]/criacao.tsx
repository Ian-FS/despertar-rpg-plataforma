'use client';

import { useState, useTransition } from 'react';
import { CartaoDespertar } from '@/componentes/cartoes';
import type { EtapaFicha, RegrasMesa, SorteioLinha } from '@/lib/supabase/tipos-banco';
import { DISTRIBUICAO_PADRAO } from '@/regras/criacao';
import { ATRIBUTOS, DESP, HAB } from '@/regras/dados';
import type { Personagem } from '@/regras/personagem';
import { ATRIBUTO_IDS, type AtributoId } from '@/regras/tipos';
import {
  escolherDespertarAcao,
  metodoPadraoAcao,
  sortearAtributosAcao,
  sortearAvaliacaoAcao,
  sortearDespertarAcao,
  type Resultado,
} from '../acoes';
import { EscolhaAvaliacao } from './escolha-avaliacao';

const PASSOS: { etapa: EtapaFicha; titulo: string }[] = [
  { etapa: 'atributos', titulo: 'Potencial e Atributos' },
  { etapa: 'despertar', titulo: 'Despertar' },
  { etapa: 'avaliacao', titulo: 'Avaliação do Sistema' },
];

export function Criacao(props: {
  fichaId: string;
  etapa: EtapaFicha;
  p: Personagem;
  regras: RegrasMesa;
  sorteios: SorteioLinha[];
  despertarPendente: string[] | null;
  avaliacaoPendente: string[] | null;
  liberados: string[];
}) {
  const { fichaId, etapa, p, regras } = props;
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const executar = (fn: () => Promise<Resultado>) =>
    iniciar(async () => {
      setErro(null);
      const r = await fn();
      if (r.erro) setErro(r.erro);
    });
  const n = PASSOS.findIndex((x) => x.etapa === etapa);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="rotulo">
          Passo {n + 2} de 4 · {PASSOS[n]?.titulo}
        </span>
        <h1 className="text-3xl font-bold break-words">{p.nome}</h1>
        <ol className="flex flex-wrap gap-2 text-xs">
          {['Quem você era', ...PASSOS.map((x) => x.titulo)].map((t, i) => (
            <li
              key={t}
              className={`border px-2 py-1 ${i < n + 1 ? 'border-ok text-ok' : i === n + 1 ? 'border-sys text-sys' : 'border-linha text-apagado'}`}
            >
              {t}
            </li>
          ))}
        </ol>
      </div>

      {etapa === 'atributos' &&
        (regras.metodoPadrao ? (
          <MetodoPadrao enviar={(b) => executar(() => metodoPadraoAcao(fichaId, b))} ocupado={pendente} />
        ) : (
          <section className="janela flex flex-col gap-3 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ SISTEMA ] Medição de potencial</p>
            <p>
              O Sistema rola <b>1d6</b> para o seu Potencial e <b>2d6</b> para cada atributo, em ordem. Quem começa mais
              fraco recebe mais Pontos de Status e PH. O resultado fica registrado e não pode ser rolado de novo sem o
              Mestre.
            </p>
            <button className="botao self-start" disabled={pendente} onClick={() => executar(() => sortearAtributosAcao(fichaId))}>
              {pendente ? 'Rolando…' : '🎲 Sortear Potencial e Atributos'}
            </button>
          </section>
        ))}

      {etapa === 'despertar' &&
        (props.despertarPendente ? (
          <section className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ ESCOLHA GUIADA ] Fique com um</p>
            <div className="grid gap-3 md:grid-cols-2">
              {props.despertarPendente.map((id) => (
                <CartaoDespertar
                  key={id}
                  x={DESP[id]}
                  rodape={
                    <button className="botao mt-2 self-start" disabled={pendente} onClick={() => executar(() => escolherDespertarAcao(fichaId, id))}>
                      Escolher {DESP[id].n}
                    </button>
                  }
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="janela flex flex-col gap-3 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ SISTEMA ] Despertar</p>
            <p>
              O Sistema rola <b>1d100</b> na tabela de Despertares: sua Habilidade Única.
              {regras.escolhaGuiada && ' Nesta mesa, você rola duas vezes e escolhe.'} Comuns e Raros vêm com compensação.
            </p>
            <button className="botao self-start" disabled={pendente} onClick={() => executar(() => sortearDespertarAcao(fichaId))}>
              {pendente ? 'Rolando…' : '✦ Sortear Despertar'}
            </button>
          </section>
        ))}

      {etapa === 'avaliacao' &&
        (props.avaliacaoPendente ? (
          <EscolhaAvaliacao fichaId={fichaId} rank="E" opcoes={props.avaliacaoPendente} inicial />
        ) : (
          <section className="janela flex flex-col gap-3 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ SISTEMA ] Avaliação inicial</p>
            <p>
              O Sistema sorteia <b>3 habilidades de Rank E</b> de quaisquer árvores. Você escolhe uma e a recebe de graça,
              mesmo sem cumprir o requisito de atributo.
            </p>
            <button className="botao self-start" disabled={pendente} onClick={() => executar(() => sortearAvaliacaoAcao(fichaId))}>
              {pendente ? 'Avaliando…' : '◈ Iniciar Avaliação'}
            </button>
          </section>
        ))}

      {erro && (
        <p role="alert" className="text-sm text-perigo">
          {erro}
        </p>
      )}

      <RegistroSorteios sorteios={props.sorteios} />
    </div>
  );
}

function MetodoPadrao({ enviar, ocupado }: { enviar: (b: Record<AtributoId, number>) => void; ocupado: boolean }) {
  const [valores, setValores] = useState<Record<AtributoId, number | ''>>({ FOR: '', AGI: '', VIT: '', INT: '', PER: '', PRE: '' });
  const usados = ATRIBUTO_IDS.map((a) => valores[a]).filter((v) => v !== '') as number[];
  const restantes = [...DISTRIBUICAO_PADRAO];
  for (const v of usados) restantes.splice(restantes.indexOf(v), 1);
  const completo = usados.length === 6;

  return (
    <section className="janela flex flex-col gap-4 p-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ MÉTODO PADRÃO ]</p>
      <p>
        Todos começam com 8. Distribua os valores <b>7, 7, 6, 6, 5 e 4</b>, um em cada atributo. Sem compensação.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ATRIBUTOS.map((a) => (
          <label key={a.id} className="flex flex-col gap-1">
            <span className="text-sm font-semibold">
              {a.nome} ({a.id})
            </span>
            <select
              id={`mp-${a.id}`}
              className="campo"
              value={valores[a.id]}
              onChange={(e) => setValores({ ...valores, [a.id]: e.target.value === '' ? '' : Number(e.target.value) })}
            >
              <option value="">—</option>
              {Array.from(new Set([...(valores[a.id] !== '' ? [valores[a.id] as number] : []), ...restantes]))
                .sort((x, y) => y - x)
                .map((v) => (
                  <option key={v} value={v}>
                    +{v} → {8 + v}
                  </option>
                ))}
            </select>
          </label>
        ))}
      </div>
      <button className="botao self-start" disabled={!completo || ocupado} onClick={() => enviar(valores as Record<AtributoId, number>)}>
        Confirmar atributos
      </button>
    </section>
  );
}

/** Histórico de tudo que o Sistema sorteou para esta ficha. */
export function RegistroSorteios({ sorteios }: { sorteios: SorteioLinha[] }) {
  if (!sorteios.length) return null;
  return (
    <section className="caixa flex flex-col gap-2 p-4">
      <h2 className="rotulo">Registro do Sistema</h2>
      <ul className="flex flex-col gap-2 text-sm">
        {sorteios.map((s) => (
          <li key={s.id} className="border-l-2 border-linha pl-3">
            <span className="font-mono text-xs text-apagado">
              {new Date(s.criado_em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </span>{' '}
            {descreverSorteio(s)}
          </li>
        ))}
      </ul>
    </section>
  );
}

function descreverSorteio(s: SorteioLinha): string {
  const r = s.resultado;
  switch (s.tipo) {
    case 'atributos':
      if (r.metodoPadrao) return `Atributos pelo Método Padrão: ${ATRIBUTO_IDS.map((a) => `${a} ${8 + r.bonus[a]}`).join(', ')}.`;
      return (
        `Potencial: d6 = ${r.d6} → ${r.potencial.n} (base ${r.potencial.base}, +${r.potencial.st} Status, +${r.potencial.ph} PH). ` +
        ATRIBUTO_IDS.map((a) => `${a} ${r.potencial.base}+[${r.rolagens[a].join('+')}] = ${r.atr[a]}`).join(' · ')
      );
    case 'despertar':
      return `Despertar: d100 = ${r.d100.join(' e ')} → ${r.opcoes.map((id: string) => `${DESP[id].n} (${DESP[id].rar})`).join(' / ')}${
        r.escolhida && r.opcoes.length > 1 ? `. Escolhido: ${DESP[r.escolhida].n}.` : '.'
      }`;
    case 'avaliacao':
      return `Avaliação do Sistema (Rank ${r.rank}): ${r.opcoes.map((id: string) => HAB[id].n).join(', ')}${
        r.escolhida ? `. Escolhida: ${HAB[r.escolhida].n}.` : '. Aguardando escolha.'
      }`;
    case 'nivel':
      return `Nível ${r.novoNivel}: Status 1d6 = ${r.status.rolagens.join(' → ')} (+${r.status.valor}), PH 1d6 = ${r.ph.rolagens.join(' → ')} (+${r.ph.valor})${
        r.novoRank ? `. Novo Rank ${r.novoRank}!` : '.'
      }`;
    default:
      return s.tipo;
  }
}
