'use client';

import { useState } from 'react';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import { useRolar } from '@/componentes/rolador';
import { ACESSORIOS, AFIXOS, ARMADURAS, ARMAS, CONSUMIVEIS, RANKS, RARIDADES, SELOS } from '@/regras/dados';
import { brItem } from '@/regras/ficha';
import { armaComum, armaduraComum, escudoComum, itemBase, type CategoriaItem, type Item } from '@/regras/personagem';
import { RANK_IDS, type Rank, type RaridadeItem, type TipoArmadura } from '@/regras/tipos';
import type { PropsAba } from './ficha-editor';

const LIMITE = 20;
const CATEGORIAS: { id: CategoriaItem; nome: string }[] = [
  { id: 'arma', nome: 'Arma' },
  { id: 'armadura', nome: 'Armadura' },
  { id: 'escudo', nome: 'Escudo' },
  { id: 'acessorio', nome: 'Acessório' },
  { id: 'consumivel', nome: 'Consumível' },
  { id: 'outro', nome: 'Outro' },
];
const corRaridade = (r: RaridadeItem) => RARIDADES.find((x) => x.n === r)?.cor ?? '#9aa5b1';
const catAfixo = (c: CategoriaItem) => (c === 'arma' ? 'arma' : c === 'armadura' || c === 'escudo' ? 'armadura' : c === 'acessorio' ? 'acessorio' : null);

export function AbaInventario(props: PropsAba) {
  const { p, alterar, podeEditar } = props;
  const mudarItem = (uid: string, fn: (it: Item) => void) =>
    alterar((r) => {
      const it = r.itens.find((i) => i.uid === uid);
      if (it) fn(it);
    });
  return (
    <div className="flex flex-col gap-4">
      <section className="janela flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <span className="rotulo">Inventário do Sistema</span>
          <p className={`text-2xl font-bold ${p.itens.length > LIMITE ? 'text-perigo' : ''}`}>
            {p.itens.length} / {LIMITE} itens
          </p>
        </div>
        <label className="flex items-center gap-2" htmlFor="ouro">
          <span className="rotulo">Ouro</span>
          <input
            id="ouro"
            type="number"
            min={0}
            className="campo w-32 text-right font-mono"
            value={p.ouro}
            disabled={!podeEditar}
            onChange={(e) => alterar((r) => void (r.ouro = Math.max(0, Math.trunc(Number(e.target.value) || 0))))}
          />
        </label>
      </section>
      <ul className="flex flex-col gap-2">
        {p.itens.map((it) => (
          <LinhaItem key={it.uid} it={it} {...props} mudar={(fn) => mudarItem(it.uid, fn)} />
        ))}
      </ul>
      {podeEditar && <NovoItem onAdicionar={(it) => alterar((r) => void r.itens.push(it))} />}
    </div>
  );
}

function LinhaItem({ it, p, f, alterar, podeEditar, mudar }: PropsAba & { it: Item; mudar: (fn: (it: Item) => void) => void }) {
  const rolar = useRolar();
  const efeitos = useEfeitos();

  /** usa o consumível: rola, aplica em PV ou PM e gasta uma unidade */
  const usar = () => {
    const r = rolar(it.nome, it.usoDado!);
    if (!r) return;
    const alvo = it.usoAlvo;
    if (!podeEditar || !alvo) return;
    const campo = alvo === 'pm' ? 'pmAtual' : 'pvAtual';
    const max = alvo === 'pm' ? f.pmMax : f.pvMax;
    const atual = p[campo] ?? max;
    const novo = Math.min(max, atual + r.total);
    alterar((x) => {
      x[campo] = novo;
      const item = x.itens.find((i) => i.uid === it.uid);
      if (item) {
        item.qtd = (item.qtd ?? 1) - 1;
        if (item.qtd <= 0) x.itens = x.itens.filter((i) => i.uid !== it.uid);
      }
    });
    efeitos.som('cura');
    efeitos.aviso(`[ SISTEMA ] ${it.nome}: +${novo - atual} ${alvo.toUpperCase()} (${atual} → ${novo})`, 'ok');
  };
  const [aberto, setAberto] = useState(false);
  const { br, rank, semReq } = brItem(it, p);
  const equipavel = ['arma', 'armadura', 'escudo', 'acessorio'].includes(it.cat);
  const cat = catAfixo(it.cat);

  const equipar = () => {
    efeitos.som('clique');
    alterar((r) => {
      const alvo = r.itens.find((i) => i.uid === it.uid)!;
      // só uma armadura e um escudo equipados por vez
      if (!alvo.equip && (alvo.cat === 'armadura' || alvo.cat === 'escudo'))
        r.itens.forEach((i) => i.cat === alvo.cat && (i.equip = false));
      alvo.equip = !alvo.equip;
    });
  };

  return (
    <li className="caixa flex flex-col" style={{ borderLeftColor: corRaridade(it.rar), borderLeftWidth: 3 }}>
      <div className="flex flex-wrap items-center gap-2 p-2">
        <button className="flex min-w-0 flex-1 flex-col text-left" onClick={() => setAberto(!aberto)}>
          <span className="truncate font-semibold">
            {it.nome}
            {it.qtd && it.qtd > 1 ? ` ×${it.qtd}` : ''}
            {it.refino ? ` +${it.refino}` : ''}
          </span>
          <span className="text-xs text-apagado">
            {it.rar} · Rank {rank}
            {equipavel && ` · BR ${br}`}
            {semReq && <span className="text-perigo"> · sem o atributo exigido (funciona como Rank E)</span>}
            {it.afixos.length > 0 && ` · ${it.afixos.map((a) => a.n).join(', ')}`}
          </span>
        </button>
        {it.usoDado && (
          <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={usar} title={it.usoAlvo ? `Rola ${it.usoDado}, recupera ${it.usoAlvo.toUpperCase()} e gasta 1 unidade` : undefined}>
            Usar · {it.usoDado}
          </button>
        )}
        {equipavel && (
          <button
            disabled={!podeEditar}
            onClick={equipar}
            className={`border px-2 py-0.5 text-xs ${it.equip ? 'border-ok bg-ok/15 text-ok' : 'border-linha text-apagado'}`}
          >
            {it.equip ? 'Equipado' : 'Equipar'}
          </button>
        )}
      </div>
      {aberto && (
        <div className="flex flex-col gap-3 border-t border-linha p-3 text-sm">
          {it.linhas.map((l) => (
            <p key={l} className="text-apagado">
              {l}
            </p>
          ))}
          {it.afixos.map((a) => (
            <p key={a.n}>
              <b>{a.n}</b>
              {a.sufixo ? ` / ${a.sufixo}` : ''}: {a.desc}
            </p>
          ))}
          {it.selos.length > 0 && (
            <p className="text-apagado">
              {it.selos.length} Selo(s) oculto(s) · Sincronia {it.sinc} (despertam com 3, 8 e 15)
            </p>
          )}
          {podeEditar && (
            <div className="flex flex-wrap items-end gap-3">
              <Campo id={`rk-${it.uid}`} rotulo="Rank">
                <select id={`rk-${it.uid}`} className="campo" value={it.rank} onChange={(e) => mudar((i) => ((i.rank = e.target.value as Rank), (i.X = 1 + RANKS[i.rank].br)))}>
                  {RANK_IDS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Campo>
              <Campo id={`rar-${it.uid}`} rotulo="Raridade">
                <select id={`rar-${it.uid}`} className="campo" value={it.rar} onChange={(e) => mudar((i) => ((i.rar = e.target.value as RaridadeItem), (i.cor = corRaridade(i.rar))))}>
                  {RARIDADES.map((r) => (
                    <option key={r.n}>{r.n}</option>
                  ))}
                </select>
              </Campo>
              {equipavel && it.cat !== 'acessorio' && (
                <Campo id={`ref-${it.uid}`} rotulo="Refino">
                  <input id={`ref-${it.uid}`} type="number" min={0} max={10} className="campo w-20" value={it.refino} onChange={(e) => mudar((i) => void (i.refino = Math.max(0, Math.min(10, Math.trunc(Number(e.target.value) || 0)))))} />
                </Campo>
              )}
              {(it.cat === 'consumivel' || it.cat === 'outro') && (
                <Campo id={`qtd-${it.uid}`} rotulo="Quantidade">
                  <input id={`qtd-${it.uid}`} type="number" min={1} className="campo w-20" value={it.qtd ?? 1} onChange={(e) => mudar((i) => void (i.qtd = Math.max(1, Math.trunc(Number(e.target.value) || 1))))} />
                </Campo>
              )}
              {it.selos.length > 0 && (
                <Campo id={`sinc-${it.uid}`} rotulo="Sincronia">
                  <input id={`sinc-${it.uid}`} type="number" min={0} className="campo w-20" value={it.sinc} onChange={(e) => mudar((i) => void (i.sinc = Math.max(0, Math.trunc(Number(e.target.value) || 0))))} />
                </Campo>
              )}
            </div>
          )}
          {podeEditar && cat && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor={`afx-${it.uid}`} className="text-xs text-apagado">
                Afixo (X = {it.X})
              </label>
              <select
                id={`afx-${it.uid}`}
                className="campo text-sm"
                value=""
                onChange={(e) => {
                  const a = AFIXOS[cat].find((x) => x.n === e.target.value);
                  if (a) mudar((i) => void i.afixos.push({ n: a.n, sufixo: a.sufixo, desc: a.desc.replace(/X/g, `X (${i.X})`) }));
                }}
              >
                <option value="">Adicionar afixo…</option>
                {AFIXOS[cat]
                  .filter((a) => !it.afixos.some((x) => x.n === a.n))
                  .map((a) => (
                    <option key={a.n} value={a.n}>
                      {a.n} / {a.sufixo}
                    </option>
                  ))}
              </select>
              {it.afixos.map((a) => (
                <button key={a.n} className="border border-linha px-2 py-0.5 text-xs text-apagado hover:text-perigo" onClick={() => mudar((i) => void (i.afixos = i.afixos.filter((x) => x.n !== a.n)))}>
                  {a.n} ✕
                </button>
              ))}
              {it.rar !== 'Comum' && it.rar !== 'Incomum' && (
                <select
                  aria-label="Adicionar Selo"
                  className="campo text-sm"
                  value=""
                  onChange={(e) => {
                    const s = SELOS.find((x) => x.n === e.target.value);
                    if (s) mudar((i) => void i.selos.push({ n: s.n, desc: s.desc }));
                  }}
                >
                  <option value="">Adicionar Selo…</option>
                  {SELOS.map((s) => (
                    <option key={s.n}>{s.n}</option>
                  ))}
                </select>
              )}
            </div>
          )}
          {podeEditar && (
            <button className="self-start text-xs text-perigo underline" onClick={() => alterar((r) => void (r.itens = r.itens.filter((i) => i.uid !== it.uid)))}>
              Descartar item
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function NovoItem({ onAdicionar }: { onAdicionar: (it: Item) => void }) {
  const [cat, setCat] = useState<CategoriaItem>('arma');
  const [base, setBase] = useState('');
  const [rank, setRank] = useState<Rank>('E');
  const [nome, setNome] = useState('');

  function criar(): Item | null {
    const nomeLivre = nome.trim();
    switch (cat) {
      case 'arma': {
        const it = armaComum(base || ARMAS[0].n, rank);
        if (nomeLivre) it.nome = nomeLivre;
        return it;
      }
      case 'armadura': {
        const it = armaduraComum((base || 'Leve') as TipoArmadura, rank);
        if (nomeLivre) it.nome = nomeLivre;
        return it;
      }
      case 'escudo':
        return Object.assign(escudoComum(rank), nomeLivre ? { nome: nomeLivre } : {});
      case 'acessorio':
        return itemBase('acessorio', nomeLivre || base || ACESSORIOS[0], { base: base || ACESSORIOS[0], rank, X: 1 + RANKS[rank].br });
      case 'consumivel': {
        const c = CONSUMIVEIS.find((x) => x.n === (base || CONSUMIVEIS[0].n))!;
        const br = RANKS[rank].br;
        const uso = c.n === 'Poção de Cura' ? `${2 + 2 * br}d8` : c.n === 'Poção de Mana' ? `${2 + 2 * br}d6` : undefined;
        const alvo = c.n === 'Poção de Cura' ? 'pv' : c.n === 'Poção de Mana' ? 'pm' : undefined;
        return itemBase('consumivel', `${nomeLivre || c.n} (Rank ${rank})`, { rank, qtd: 1, linhas: [c.desc], usoDado: uso, usoAlvo: alvo });
      }
      default:
        return nomeLivre ? itemBase('outro', nomeLivre, { qtd: 1 }) : null;
    }
  }

  const opcoesBase =
    cat === 'arma'
      ? ARMAS.map((a) => [a.n, `${a.n} · ${a.dano} · ${a.a}`])
      : cat === 'armadura'
        ? ARMADURAS.map((a) => [a.tipo, `${a.n} (${a.tipo})`])
        : cat === 'acessorio'
          ? ACESSORIOS.map((a) => [a, a])
          : cat === 'consumivel'
            ? CONSUMIVEIS.map((c) => [c.n, c.n])
            : [];

  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <h2 className="rotulo">Adicionar item</h2>
      <div className="flex flex-wrap items-end gap-3">
        <Campo id="ni-cat" rotulo="Tipo">
          <select id="ni-cat" className="campo" value={cat} onChange={(e) => (setCat(e.target.value as CategoriaItem), setBase(''))}>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Campo>
        {opcoesBase.length > 0 && (
          <Campo id="ni-base" rotulo="Base">
            <select id="ni-base" className="campo" value={base} onChange={(e) => setBase(e.target.value)}>
              {opcoesBase.map(([v, t]) => (
                <option key={v} value={v}>
                  {t}
                </option>
              ))}
            </select>
          </Campo>
        )}
        {cat !== 'outro' && (
          <Campo id="ni-rank" rotulo="Rank">
            <select id="ni-rank" className="campo" value={rank} onChange={(e) => setRank(e.target.value as Rank)}>
              {RANK_IDS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Campo>
        )}
        <Campo id="ni-nome" rotulo={cat === 'outro' ? 'Nome' : 'Nome (opcional)'}>
          <input id="ni-nome" className="campo" value={nome} maxLength={80} onChange={(e) => setNome(e.target.value)} />
        </Campo>
        <button
          className="botao"
          onClick={() => {
            const it = criar();
            if (it) {
              onAdicionar(it);
              setNome('');
            }
          }}
        >
          Adicionar
        </button>
      </div>
      <p className="text-xs text-apagado">Depois de adicionar, toque no item para ajustar raridade, Refino, afixos e Selos.</p>
    </section>
  );
}

function Campo({ id, rotulo, children }: { id: string; rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-apagado">
        {rotulo}
      </label>
      {children}
    </div>
  );
}
