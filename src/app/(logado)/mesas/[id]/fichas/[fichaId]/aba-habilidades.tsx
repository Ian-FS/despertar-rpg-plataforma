'use client';

import { useState, useTransition } from 'react';
import { CartaoDespertar, CartaoHabilidade, COR_RANK } from '@/componentes/cartoes';
import { useEfeitos } from '@/componentes/efeitos/provedor';
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
import { RANK_IDS, type ArvoreId, type Habilidade, type Rank } from '@/regras/tipos';
import { custoUso, PAGA_PM_COM_PV, usosDoDespertar } from '@/regras/despertar-usos';
import {
  chavesDespertar,
  chavesHabilidade,
  efeitoDespertar,
  efeitoHabilidade,
  previaPoder,
  type PreviaPoder,
  type ResultadoPoder,
} from '@/regras/poderes';
import { limiteDespertar, limiteHabilidade, type Limite as LimiteUso } from '@/regras/gatilhos';
import { d20Natural, ehCritico } from '@/regras/rolagem';
import { usarDespertar, usarHabilidade, type ResultadoUso } from '../acoes';
import type { PropsAba } from './ficha-editor';
import { useSincronizar } from './ficha-editor';

/** Aviso do Sistema ao evoluir: mostra o marco dos níveis 3 e 5. */
function anunciarNivel(efeitos: ReturnType<typeof useEfeitos>, nome: string, nv: number, m3: string, m5: string) {
  efeitos.som(nv === 3 || nv === 5 ? 'raro' : 'sistema');
  const marco = nv === 3 ? ` · ${m3}` : nv === 5 ? ` · ${m5}` : '';
  efeitos.aviso(`[ SISTEMA ] ${nome} subiu para o nível ${nv}${marco}`, nv === 5 ? 'ouro' : 'sys');
}

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

function Despertar({ p, salvo, alterar, aplicarMudanca, podeEditar, souMestre, fichaId }: PropsAba) {
  const efeitos = useEfeitos();
  const x = DESP[p.despertar.id];
  if (!x) return null;
  const nv = p.despertar.nv;
  const gratis = niveisGratisDespertar(p);
  const custo = nv + 1 <= 1 + gratis ? 0 : nv + 1;
  return (
    <CartaoDespertar
      x={x}
      rodape={
        <>
        <UsosDespertar p={p} salvo={salvo} podeEditar={podeEditar} fichaId={fichaId} aplicarMudanca={aplicarMudanca} />
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-linha pt-3">
          <span className="font-semibold">Nível {nv} de 5</span>
          {gratis > 0 && <span className="text-xs text-apagado">({gratis} nível(is) grátis pelos novos Ranks)</span>}
          {podeEditar && nv < 5 && (
            <button className="botao px-3 py-1 text-sm" disabled={custo > phDisponiveis(p)} onClick={() => (alterar((r) => void r.despertar.nv++), anunciarNivel(efeitos, x.n, nv + 1, x.m3, x.m5))}>
              Evoluir para nv {nv + 1} · {custo ? `${custo} PH` : 'grátis'}
            </button>
          )}
          {podeEditar && nv > (souMestre ? 1 : salvo.despertar.nv) && (
            <button className="botao botao-discreto px-3 py-1 text-sm" onClick={() => alterar((r) => void r.despertar.nv--)}>
              Desfazer nível
            </button>
          )}
        </div>
        </>
      }
    />
  );
}

function UsosDespertar({
  p,
  salvo,
  podeEditar,
  fichaId,
  aplicarMudanca,
}: Pick<PropsAba, 'p' | 'salvo' | 'podeEditar' | 'fichaId' | 'aplicarMudanca'>) {
  const [rank, setRank] = useState<Rank>('E');
  // usa o nível já confirmado do Despertar (o rascunho ainda não vale)
  const usos = usosDoDespertar(salvo);
  if (!usos.length) return null;
  return (
    <div className="mt-2 flex flex-col gap-2 border-t border-linha pt-3">
      <span className="rotulo">Poderes ativos</span>
      {usos.map((u) => (
        <div key={u.id} className={`flex flex-wrap items-center gap-2 ${u.liberado ? '' : 'opacity-50'}`}>
          <span className="min-w-0 flex-1">
            <b>{u.nome}</b> <span className="text-xs text-apagado">· {u.acao}{u.freq ? ` · ${u.freq}` : ''}{u.forma ? ' · Forma Evoluída' : ''}</span>
            <span className="block text-xs text-apagado">{u.liberado ? u.desc : `Bloqueado: ${u.motivo}.`}</span>
            {u.liberado && <LinhaPrevia previa={previaDesp(salvo, u.id)} />}
          </span>
          {u.porRank && u.liberado && (
            <select aria-label="Rank da Sombra" className="campo px-2 py-0.5 text-xs" value={rank} onChange={(e) => setRank(e.target.value as Rank)}>
              {RANK_IDS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          )}
          {podeEditar && u.liberado && (
            <BotaoUsar
              limite={limiteDe(salvo, limiteDespertar(salvo.despertar.id, u))}
              pm={custoUso(salvo, u, rank)}
              executar={(comPV) => usarDespertar(fichaId, u.id, rank, comPV)}
              aplicarMudanca={aplicarMudanca}
              hemomancia={PAGA_PM_COM_PV.has(p.despertar.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Minhas({ p, salvo, alterar, aplicarMudanca, podeEditar, souMestre, fichaId }: PropsAba) {
  const [aberta, setAberta] = useState<string | null>(null);
  const efeitos = useEfeitos();
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
                {podeEditar && h.tipo === 'Ativa' && h.pm > 0 && salvo.habs.some((y) => y.id === x.id) && (
                  <BotaoUsar
                    limite={limiteDe(salvo, limiteHabilidade(x.id, salvo.habs.find((y) => y.id === x.id)!.nv))}
                    pm={h.pm}
                    executar={(comPV) => usarHabilidade(fichaId, x.id, comPV)}
                    aplicarMudanca={aplicarMudanca}
                    hemomancia={PAGA_PM_COM_PV.has(p.despertar.id)}
                  />
                )}
                {podeEditar && x.nv < 5 && (
                  <button
                    className="botao px-2 py-0.5 text-xs"
                    disabled={x.nv + 1 > ph}
                    onClick={() => (alterar((r) => void r.habs.find((y) => y.id === x.id)!.nv++), anunciarNivel(efeitos, h.n, x.nv + 1, h.m3, h.m5))}
                  >
                    nv {x.nv + 1} · {x.nv + 1} PH
                  </button>
                )}
                {podeEditar && x.nv > (souMestre ? 1 : (salvo.habs.find((y) => y.id === x.id)?.nv ?? 1)) && (
                  <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={() => alterar((r) => void r.habs.find((y) => y.id === x.id)!.nv--)}>
                    −nv
                  </button>
                )}
                {podeEditar && !x.gratis && x.nv === 1 && (souMestre || !salvo.habs.some((y) => y.id === x.id)) && (
                  <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={() => alterar((r) => void (r.habs = r.habs.filter((y) => y.id !== x.id)))}>
                    Remover
                  </button>
                )}
              </div>
              {h.tipo === 'Ativa' && salvo.habs.some((y) => y.id === x.id) && (
                <div className="px-2 pb-2">
                  <LinhaPrevia previa={previaHab(salvo, x.id)} />
                </div>
              )}
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
  const efeitos = useEfeitos();
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
                  onComprar={() => {
                    alterar((r) => void r.habs.push({ id: h.id, nv: 1, gratis: false }));
                    efeitos.som('sistema');
                    efeitos.aviso(`[ SISTEMA ] Habilidade adquirida: ${h.n}`);
                  }}
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

/** Botão "Usar": o servidor desconta o PM. Sem PM, oferece a Exaustão de Mana (ou a Hemomancia). */
interface Limite {
  texto: string;
  max: number;
  usados: number;
}
const limiteDe = (p: PropsAba['p'], l: LimiteUso | null): Limite | null => (l ? { texto: l.texto, max: l.max, usados: p.usos[l.chave] ?? 0 } : null);

const previaHab = (p: PropsAba['p'], id: string) => {
  const ef = efeitoHabilidade(p, id);
  return ef ? previaPoder(p, ef, chavesHabilidade(id)) : undefined;
};
const previaDesp = (p: PropsAba['p'], usoId: string) => {
  const ef = efeitoDespertar(p, usoId);
  return ef ? previaPoder(p, ef, chavesDespertar(p.despertar.id)) : undefined;
};

/** Ataque, dano e CD do poder, antes de usar. */
function LinhaPrevia({ previa }: { previa?: PreviaPoder }) {
  if (!previa) return null;
  const partes = [previa.teste, previa.ataque, previa.dano, previa.proprio].filter(Boolean);
  if (!partes.length && !previa.resistencia && !previa.ativo) return null;
  return (
    <span className="block font-mono text-xs text-sys">
      {partes.join(' · ')}
      {previa.resistencia && <span className="block text-ouro">{previa.resistencia}</span>}
      {previa.ativo && <span className="block text-ok">Ativa: {previa.ativo}</span>}
    </span>
  );
}

/** Resultado de um poder usado: rolagens (com crítico) e a CD para o alvo. */
function PainelPoder({ titulo, res, onFechar }: { titulo: string; res: ResultadoPoder; onFechar: () => void }) {
  return (
    <div className="janela aparecer basis-full p-3 text-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-xs tracking-[0.2em] text-sys">[ {titulo} ]</span>
        <button className="text-xs text-apagado hover:text-texto" onClick={onFechar} aria-label="Fechar resultado">
          ✕
        </button>
      </div>
      {res.rolagens.length > 0 && (
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {res.rolagens.map((x, i) => {
            const nat = d20Natural(x.r);
            const crit = x.tipo === 'ataque' && ehCritico(x.r, x.critico ?? 20);
            const falha = x.tipo !== 'dano' && x.tipo !== 'cura' && nat === 1;
            const cor = crit || x.dobrado ? 'text-ouro' : falha || x.tipo === 'proprio' ? 'text-perigo' : x.tipo === 'cura' ? 'text-ok' : 'text-sys';
            return (
              <li key={i} className={`flex items-baseline gap-2 border border-linha bg-painel-2 px-2 py-1 ${crit ? 'rolagem-critico' : ''}`}>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-apagado">{x.rotulo}</span>
                  <span className="font-mono text-xs text-apagado">
                    {x.r.texto}
                    {crit ? (nat === 20 ? ' · 20 natural!' : ` · crítico (${x.critico}+)`) : falha ? ' · 1 natural' : ''}
                  </span>
                </span>
                <span className={`text-2xl font-bold ${cor}`}>{x.r.total}</span>
              </li>
            );
          })}
        </ul>
      )}
      {res.resistencia && <p className="mt-2 font-mono text-xs text-ouro">{res.resistencia}</p>}
      {res.nota && <p className="mt-1 text-xs text-apagado">{res.nota}</p>}
      {res.danoProprio ? <p className="mt-1 text-xs text-perigo">Você sofreu {res.danoProprio} de dano (já descontado dos PV).</p> : null}
    </div>
  );
}

function BotaoUsar({
  pm,
  executar,
  aplicarMudanca,
  hemomancia,
  rotulo,
  limite,
}: {
  /** "1× por combate" etc. e quantos usos restam */
  limite?: Limite | null;
  pm: number;
  executar: (comPV: boolean) => Promise<ResultadoUso>;
  aplicarMudanca: PropsAba['aplicarMudanca'];
  hemomancia?: boolean;
  rotulo?: string;
}) {
  const efeitos = useEfeitos();
  const [pendente, iniciar] = useTransition();
  const [semPM, setSemPM] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ titulo: string; res: ResultadoPoder } | null>(null);
  const restam = limite ? limite.max - limite.usados : null;
  const sincronizar = useSincronizar();
  const usar = (comPV: boolean) =>
    iniciar(async () => {
      if (!(await sincronizar())) return;
      const r = await executar(comPV);
      if (r.erro) {
        efeitos.som('falha');
        if (/PM insuficiente/.test(r.erro)) setSemPM(r.erro);
        else efeitos.aviso(r.erro, 'perigo');
        return;
      }
      setSemPM(null);
      if (r.mudanca) aplicarMudanca(r.mudanca);
      efeitos.som(comPV ? 'dano' : 'sistema');
      efeitos.aviso(`[ SISTEMA ] ${r.mensagem}`, comPV ? 'perigo' : 'sys');
      if (r.poder && (r.poder.rolagens.length || r.poder.resistencia || r.poder.nota)) {
        setResultado({ titulo: (r.mensagem ?? '').split(':')[0].toUpperCase(), res: r.poder });
        const crit = r.poder.rolagens.some((x) => x.tipo === 'ataque' && ehCritico(x.r, x.critico ?? 20));
        if (r.poder.rolagens.length) setTimeout(() => efeitos.som(crit ? 'critico' : 'dado'), 250);
      }
    });

  if (semPM)
    return (
      <span className="flex w-full flex-wrap items-center gap-2 border border-perigo/60 bg-perigo/10 px-2 py-1 text-xs text-perigo">
        {semPM} {hemomancia ? `Hemomancia: pagar ${pm} PV?` : `Exaustão de Mana: pagar ${2 * pm} PV e ficar Exausto?`}
        <button className="botao border-perigo bg-transparent px-2 py-0.5 text-xs text-perigo" disabled={pendente} onClick={() => usar(true)}>
          Pagar com PV
        </button>
        <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={() => setSemPM(null)}>
          Cancelar
        </button>
      </span>
    );
  return (
    <>
      {limite && (
        <span className={`font-mono text-xs ${restam! > 0 ? 'text-apagado' : 'text-perigo'}`} title="Zera no fim do combate (ou no descanso longo, se for por dia)">
          {limite.texto} · {restam! > 0 ? `resta ${restam}` : 'usado'}
        </span>
      )}
      <button className="botao px-2 py-0.5 text-xs" disabled={pendente || restam === 0} onClick={() => usar(false)} title="Desconta o PM e rola o poder">
        {rotulo ?? 'Usar'} · {pm ? `${pm} PM` : 'sem custo'}
      </button>
      {resultado && <PainelPoder titulo={resultado.titulo} res={resultado.res} onFechar={() => setResultado(null)} />}
    </>
  );
}
