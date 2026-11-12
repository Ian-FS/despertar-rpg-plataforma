'use client';

import { useState, useTransition } from 'react';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import { ACESSORIOS, AFIXOS, ARMADURAS, ARMAS, RANKS } from '@/regras/dados';
import { rankDoNivel } from '@/regras/ficha';
import {
  afixosNecessarios,
  categoriaAfixo,
  CONSUMIVEIS_LOJA,
  LIMITE_INVENTARIO,
  precoPedido,
  precoVenda,
  ranksDaLoja,
  textoAfixo,
  validarPedido,
  type CategoriaLoja,
  type Pedido,
} from '@/regras/loja';
import type { Item } from '@/regras/personagem';
import type { AtributoId, Rank } from '@/regras/tipos';
import { comprarNaLoja, venderNaLoja, type ResultadoUso } from '../acoes';
import type { PropsAba } from './ficha-editor';
import { useSincronizar } from './ficha-editor';

const CATEGORIAS: { id: CategoriaLoja; nome: string }[] = [
  { id: 'consumivel', nome: 'Consumíveis' },
  { id: 'arma', nome: 'Armas' },
  { id: 'armadura', nome: 'Armaduras' },
  { id: 'escudo', nome: 'Escudo' },
  { id: 'acessorio', nome: 'Acessórios' },
];

const basesDe = (cat: CategoriaLoja): [string, string][] =>
  cat === 'arma'
    ? ARMAS.map((a) => [a.n, `${a.n} · ${a.dano} · ${a.a}${a.tags ? ' · ' + a.tags : ''}`])
    : cat === 'armadura'
      ? ARMADURAS.map((a) => [a.tipo, `${a.n} (${a.tipo}) · Defender +${a.def}${a.esq ? ` · Esquivar ${a.esq}` : ''}`])
      : cat === 'escudo'
        ? [['Escudo', 'Escudo · Defender +2']]
        : cat === 'acessorio'
          ? ACESSORIOS.map((a) => [a, a])
          : CONSUMIVEIS_LOJA.map((c) => [c.n, c.n]);

/** Atributo exigido para o Bônus de Rank valer (10 + 4 × BR). */
function requisito(cat: CategoriaLoja, base: string, rank: Rank): { atr: AtributoId; valor: number } | null {
  const br = RANKS[rank].br;
  if (!br) return null;
  if (cat === 'arma') return { atr: ARMAS.find((a) => a.n === base)?.a ?? 'FOR', valor: 10 + 4 * br };
  if (cat === 'escudo' || (cat === 'armadura' && base !== 'Leve')) return { atr: 'FOR', valor: 10 + 4 * br };
  return null;
}

export function AbaLoja(props: PropsAba) {
  const { p, podeEditar } = props;
  return (
    <div className="flex flex-col gap-4">
      <section className="janela flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-sys">[ LOJA DO SISTEMA ]</p>
          <p className="text-sm text-apagado">
            Consumíveis e itens Comuns e Incomuns até o seu Rank ({rankDoNivel(p.nivel)}). Compra o que você vender por metade do preço.
          </p>
        </div>
        <div className="flex gap-4 font-mono text-sm">
          <span>
            Ouro <b className="text-ouro">{p.ouro.toLocaleString('pt-BR')}</b>
          </span>
          <span>
            Inventário {p.itens.length}/{LIMITE_INVENTARIO}
          </span>
        </div>
      </section>
      {podeEditar ? (
        <>
          <Comprar {...props} />
          <Vender {...props} />
        </>
      ) : (
        <p className="text-sm text-apagado">Só o dono da ficha e o Mestre usam a Loja.</p>
      )}
    </div>
  );
}

function useAcaoLoja(aplicarMudanca: PropsAba['aplicarMudanca']) {
  const efeitos = useEfeitos();
  const [pendente, iniciar] = useTransition();
  const sincronizar = useSincronizar();
  const executar = (fn: () => Promise<ResultadoUso>) =>
    iniciar(async () => {
      if (!(await sincronizar())) return;
      const r = await fn();
      if (r.erro) {
        efeitos.som('falha');
        efeitos.aviso(r.erro, 'perigo');
        return;
      }
      if (r.mudanca) aplicarMudanca(r.mudanca);
      efeitos.som('sistema');
      efeitos.aviso(`[ LOJA DO SISTEMA ] ${r.mensagem}`, 'ouro');
    });
  return { pendente, executar };
}

function Comprar({ p, f, fichaId, aplicarMudanca }: PropsAba) {
  const [cat, setCat] = useState<CategoriaLoja>('consumivel');
  const [base, setBase] = useState(basesDe('consumivel')[0][0]);
  const [rank, setRank] = useState<Rank>('E');
  const [rar, setRar] = useState<Pedido['rar']>('Comum');
  const [afixos, setAfixos] = useState<string[]>([]);
  const [qtd, setQtd] = useState(1);
  const { pendente, executar } = useAcaoLoja(aplicarMudanca);

  const trocarCat = (c: CategoriaLoja) => {
    setCat(c);
    setBase(basesDe(c)[0][0]);
    setRar('Comum');
    setAfixos([]);
    setQtd(1);
  };
  const nAfixos = afixosNecessarios(cat, rar);
  const pedido: Pedido = { cat, base, rank, rar: cat === 'consumivel' ? 'Comum' : rar, afixos: afixos.slice(0, nAfixos), qtd: cat === 'consumivel' ? qtd : undefined };
  const erro = validarPedido(p, pedido);
  const req = requisito(cat, base, rank);
  const catAfx = categoriaAfixo(cat);
  const X = 1 + RANKS[rank].br;
  const consumivel = CONSUMIVEIS_LOJA.find((c) => c.n === base);

  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <h2 className="rotulo">Comprar</h2>
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            onClick={() => trocarCat(c.id)}
            className={`border px-2 py-1 text-sm ${cat === c.id ? 'border-sys bg-sys/10 text-sys' : 'border-linha text-apagado hover:text-texto'}`}
          >
            {c.nome}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <Campo id="lj-base" rotulo="Item">
          <select id="lj-base" className="campo" value={base} onChange={(e) => setBase(e.target.value)}>
            {basesDe(cat).map(([v, t]) => (
              <option key={v} value={v}>
                {t}
              </option>
            ))}
          </select>
        </Campo>
        <Campo id="lj-rank" rotulo="Rank">
          <select id="lj-rank" className="campo" value={rank} onChange={(e) => setRank(e.target.value as Rank)}>
            {ranksDaLoja(p).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Campo>
        {cat !== 'consumivel' && (
          <Campo id="lj-rar" rotulo="Raridade">
            <select id="lj-rar" className="campo" value={rar} onChange={(e) => (setRar(e.target.value as Pedido['rar']), setAfixos([]))}>
              <option>Comum</option>
              <option>Incomum</option>
            </select>
          </Campo>
        )}
        {cat === 'consumivel' && (
          <Campo id="lj-qtd" rotulo="Quantidade">
            <input id="lj-qtd" type="number" min={1} max={99} className="campo w-20" value={qtd} onChange={(e) => setQtd(Math.max(1, Math.min(99, Math.trunc(Number(e.target.value) || 1))))} />
          </Campo>
        )}
        {catAfx &&
          Array.from({ length: nAfixos }, (_, i) => (
            <Campo key={i} id={`lj-afx-${i}`} rotulo={`Afixo ${i + 1} (X = ${X})`}>
              <select
                id={`lj-afx-${i}`}
                className="campo"
                value={afixos[i] ?? ''}
                onChange={(e) => {
                  const novo = [...afixos];
                  novo[i] = e.target.value;
                  setAfixos(novo);
                }}
              >
                <option value="">Escolha…</option>
                {AFIXOS[catAfx]
                  .filter((a) => a.n === afixos[i] || !afixos.includes(a.n))
                  .map((a) => (
                    <option key={a.n} value={a.n}>
                      {a.n} · {textoAfixo(a.desc, X)}
                    </option>
                  ))}
              </select>
            </Campo>
          ))}
      </div>
      {consumivel && <p className="text-sm text-apagado">{consumivel.desc}</p>}
      {req && (
        <p className={`text-xs ${f.atr[req.atr] >= req.valor ? 'text-apagado' : 'text-perigo'}`}>
          Requisito: {req.atr} {req.valor}. {f.atr[req.atr] >= req.valor ? '' : 'Sem ele, o item funciona como Rank E.'}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-lg">
          <span className="text-ouro">{precoPedido(pedido).toLocaleString('pt-BR')}</span> Ouro
        </span>
        <button className="botao" disabled={!!erro || pendente} onClick={() => executar(() => comprarNaLoja(fichaId, pedido))}>
          {pendente ? 'Comprando…' : 'Comprar'}
        </button>
        {erro && <span className="text-xs text-apagado">{erro}</span>}
      </div>
    </section>
  );
}

function Vender({ p, fichaId, aplicarMudanca }: PropsAba) {
  const { pendente, executar } = useAcaoLoja(aplicarMudanca);
  const [confirmar, setConfirmar] = useState<string | null>(null);
  if (!p.itens.length) return null;
  const vender = (it: Item) => {
    setConfirmar(null);
    executar(() => venderNaLoja(fichaId, it.uid, 1));
  };
  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <h2 className="rotulo">Vender (metade do preço)</h2>
      <ul className="flex flex-col gap-1.5">
        {p.itens.map((it) => (
          <li key={it.uid} className="flex flex-wrap items-center gap-2 border border-linha bg-painel-2 px-2 py-1.5 text-sm">
            <span className="min-w-0 flex-1 truncate">
              {it.nome}
              {it.qtd && it.qtd > 1 ? ` ×${it.qtd}` : ''}
              <span className="ml-2 text-xs text-apagado">
                {it.rar} · Rank {it.rank}
                {it.equip ? ' · equipado' : ''}
              </span>
            </span>
            <span className="font-mono text-ouro">{precoVenda(it).toLocaleString('pt-BR')}</span>
            {confirmar === it.uid ? (
              <>
                <button className="botao border-ouro bg-transparent px-2 py-0.5 text-xs text-ouro" disabled={pendente} onClick={() => vender(it)}>
                  Confirmar venda
                </button>
                <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={() => setConfirmar(null)}>
                  Cancelar
                </button>
              </>
            ) : (
              <button
                className="botao botao-discreto px-2 py-0.5 text-xs"
                disabled={pendente}
                onClick={() => (it.cat === 'consumivel' ? vender(it) : setConfirmar(it.uid))}
              >
                {it.cat === 'consumivel' && (it.qtd ?? 1) > 1 ? 'Vender 1' : 'Vender'}
              </button>
            )}
          </li>
        ))}
      </ul>
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
