'use client';

import { useState } from 'react';
import { CartaoDespertar, CartaoHabilidade, COR_RANK } from '@/componentes/cartoes';
import { ARVORES, DESP, HAB, HABILIDADES } from '@/regras/dados';
import {
  afinidades,
  checarRequisitos,
  custoAquisicao,
  niveisGratisDespertar,
  phDisponiveis,
  phGasto,
  phRecebidos,
  possui,
} from '@/regras/ficha';
import { RANK_IDS, type ArvoreId, type Habilidade } from '@/regras/tipos';
import type { PropsAba } from './ficha-editor';

export function AbaHabilidades(props: PropsAba) {
  const { p } = props;
  const ph = phDisponiveis(p);
  return (
    <div className="flex flex-col gap-4">
      <section className="janela flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <span className="rotulo">Pontos de Habilidade</span>
          <p className="text-3xl font-bold text-sys">{ph} PH livres</p>
        </div>
        <p className="text-sm text-apagado">
          Recebidos {phRecebidos(p)} · gastos {phGasto(p)} · adquirir custa 1–6 PH pelo Rank (−1 nas árvores afins); levar ao nível n
          custa n PH.
        </p>
      </section>
      <Despertar {...props} />
      <Minhas {...props} />
      <Arvores {...props} />
    </div>
  );
}

function Despertar({ p, alterar, podeEditar }: PropsAba) {
  const x = DESP[p.despertar.id];
  if (!x) return null;
  const nv = p.despertar.nv;
  const gratis = niveisGratisDespertar(p);
  const custo = nv + 1 <= 1 + gratis ? 0 : nv + 1;
  return (
    <CartaoDespertar
      x={x}
      rodape={
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-linha pt-3">
          <span className="font-semibold">Nível {nv} de 5</span>
          {gratis > 0 && <span className="text-xs text-apagado">({gratis} nível(is) grátis pelos novos Ranks)</span>}
          {podeEditar && nv < 5 && (
            <button className="botao px-3 py-1 text-sm" disabled={custo > phDisponiveis(p)} onClick={() => alterar((r) => void r.despertar.nv++)}>
              Evoluir para nv {nv + 1} · {custo ? `${custo} PH` : 'grátis'}
            </button>
          )}
          {podeEditar && nv > 1 && (
            <button className="botao botao-discreto px-3 py-1 text-sm" onClick={() => alterar((r) => void r.despertar.nv--)}>
              Desfazer nível
            </button>
          )}
        </div>
      }
    />
  );
}

function Minhas({ p, alterar, podeEditar }: PropsAba) {
  const [aberta, setAberta] = useState<string | null>(null);
  if (!p.habs.length)
    return <p className="text-sm text-apagado">Nenhuma habilidade ainda. Escolha nas árvores abaixo.</p>;
  const ph = phDisponiveis(p);
  return (
    <section className="caixa flex flex-col gap-2 p-4">
      <h2 className="rotulo">Suas habilidades</h2>
      <ul className="flex flex-col gap-2">
        {p.habs.map((x) => {
          const h = HAB[x.id];
          const arv = ARVORES.find((a) => a.id === h.t)!;
          return (
            <li key={x.id} className="border border-linha bg-painel-2">
              <div className="flex flex-wrap items-center gap-2 p-2">
                <button className="flex min-w-0 flex-1 items-baseline gap-2 text-left" onClick={() => setAberta(aberta === x.id ? null : x.id)}>
                  <span className="font-mono font-bold" style={{ color: COR_RANK[h.r] }}>
                    {h.r}
                  </span>
                  <span className="truncate font-semibold">{h.n}</span>
                  <span className="text-xs text-apagado">
                    {arv.icone} {h.tipo}
                    {h.pm ? ` · ${h.pm} PM` : ''}
                    {x.gratis ? ' · grátis' : ''}
                  </span>
                </button>
                <span className="font-mono text-sm">nv {x.nv}</span>
                {podeEditar && x.nv < 5 && (
                  <button
                    className="botao px-2 py-0.5 text-xs"
                    disabled={x.nv + 1 > ph}
                    onClick={() => alterar((r) => void r.habs.find((y) => y.id === x.id)!.nv++)}
                  >
                    nv {x.nv + 1} · {x.nv + 1} PH
                  </button>
                )}
                {podeEditar && x.nv > 1 && (
                  <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={() => alterar((r) => void r.habs.find((y) => y.id === x.id)!.nv--)}>
                    −nv
                  </button>
                )}
                {podeEditar && !x.gratis && x.nv === 1 && (
                  <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={() => alterar((r) => void (r.habs = r.habs.filter((y) => y.id !== x.id)))}>
                    Remover
                  </button>
                )}
              </div>
              {aberta === x.id && (
                <div className="border-t border-linha p-2">
                  <CartaoHabilidade h={h} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Arvores({ p, alterar, podeEditar }: PropsAba) {
  const afins = afinidades(p);
  const [arvore, setArvore] = useState<ArvoreId>(afins[0] ?? 'lamina');
  const [sel, setSel] = useState<string | null>(null);
  const a = ARVORES.find((x) => x.id === arvore)!;
  const habs = HABILIDADES.filter((h) => h.t === arvore);
  const ph = phDisponiveis(p);
  const h = sel ? HAB[sel] : null;

  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <h2 className="rotulo">Árvores de habilidade</h2>
      <div className="flex flex-wrap gap-1.5">
        {ARVORES.map((x) => (
          <button
            key={x.id}
            onClick={() => (setArvore(x.id), setSel(null))}
            className={`border px-2 py-1 text-sm ${arvore === x.id ? 'border-sys bg-sys/10 text-sys' : 'border-linha text-apagado hover:text-texto'}`}
          >
            {x.icone} {x.nome}
            {afins.includes(x.id) && <span className="ml-1 text-xs text-ouro">afim</span>}
          </button>
        ))}
      </div>
      <p className="text-sm text-apagado">
        {a.icone} <b className="text-texto">{a.nome}</b> ({a.atr}) · {a.desc}
      </p>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ol className="flex flex-col gap-2">
          {RANK_IDS.map((rk) => (
            <li key={rk} className="flex gap-2">
              <span className="w-5 pt-2 font-mono font-bold" style={{ color: COR_RANK[rk] }}>
                {rk}
              </span>
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                {habs
                  .filter((x) => x.r === rk)
                  .map((x) => (
                    <No key={x.id} h={x} p={p} ph={ph} selecionado={sel === x.id} onClick={() => setSel(x.id)} />
                  ))}
              </div>
            </li>
          ))}
        </ol>
        <div className="min-w-0">
          {h ? (
            <CartaoHabilidade
              h={h}
              rodape={
                <Comprar
                  h={h}
                  {...{ p, ph, podeEditar }}
                  onComprar={() => alterar((r) => void r.habs.push({ id: h.id, nv: 1, gratis: false }))}
                />
              }
            />
          ) : (
            <p className="text-sm text-apagado">Toque numa habilidade para ver os detalhes e adquirir.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function No({ h, p, ph, selecionado, onClick }: { h: Habilidade; p: PropsAba['p']; ph: number; selecionado: boolean; onClick: () => void }) {
  const tem = possui(p, h.id);
  const ok = checarRequisitos(h, p).every((r) => r.ok);
  const custo = custoAquisicao(h, p);
  const estado = tem ? 'tem' : ok && custo <= ph ? 'pode' : ok ? 'sem-ph' : 'bloqueada';
  const estilo = {
    tem: 'border-ok bg-ok/10',
    pode: 'border-sys border-dashed',
    'sem-ph': 'border-linha',
    bloqueada: 'border-linha opacity-55',
  }[estado];
  return (
    <button onClick={onClick} className={`flex flex-col border p-2 text-left ${estilo} ${selecionado ? 'ring-2 ring-sys' : ''}`}>
      <span className="font-semibold leading-tight">{h.n}</span>
      <span className="text-xs text-apagado">
        {tem ? `nv ${tem.nv}` : estado === 'bloqueada' ? 'bloqueada' : `${custo} PH`} · {h.tipo}
      </span>
    </button>
  );
}

function Comprar({ h, p, ph, podeEditar, onComprar }: { h: Habilidade; p: PropsAba['p']; ph: number; podeEditar: boolean; onComprar: () => void }) {
  const tem = possui(p, h.id);
  const reqs = checarRequisitos(h, p);
  const custo = custoAquisicao(h, p);
  return (
    <div className="mt-2 flex flex-col gap-2 border-t border-linha pt-3">
      <ul className="flex flex-wrap gap-1.5 text-xs">
        {reqs.map((r) => (
          <li key={r.txt} className={`border px-2 py-0.5 ${r.ok ? 'border-ok text-ok' : 'border-perigo text-perigo'}`}>
            {r.ok ? '✓' : '✗'} {r.txt}
          </li>
        ))}
      </ul>
      {tem ? (
        <span className="text-sm text-ok">Você tem esta habilidade no nível {tem.nv}.</span>
      ) : (
        podeEditar && (
          <button className="botao self-start" disabled={!reqs.every((r) => r.ok) || custo > ph} onClick={onComprar}>
            Adquirir · {custo} PH
          </button>
        )
      )}
    </div>
  );
}
