'use client';

import { useState, useTransition } from 'react';
import { d20, sinal, useRolar } from '@/componentes/rolador';
import { podeSubirNivel, xpParaSubir } from '@/regras/criacao';
import { ATRIBUTOS, CONDICOES, DESP, PERICIAS, RARIDADE_DESPERTAR, TITULOS, TIT } from '@/regras/dados';
import { phDisponiveis } from "@/regras/ficha";
import { ATRIBUTO_IDS } from '@/regras/tipos';
import { subirNivelAcao } from '../acoes';
import type { PropsAba } from './ficha-editor';

export function AbaFicha(props: PropsAba) {
  const { p, f } = props;
  return (
    <div className="flex flex-col gap-4">
      <Cabecalho {...props} />
      <Pendencias {...props} />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <VidaMana {...props} />
        <Atributos {...props} />
      </div>
      <Combate {...props} />
      <Pericias {...props} />
      {props.souMestre && <AjustesMestre {...props} />}
      <p className="text-xs text-apagado">
        {p.nome} · {f.rank} · Ações Principais {f.acoes} · Clique em qualquer valor azul para rolar.
      </p>
    </div>
  );
}

/* ---------------- cabeçalho: nome, nível, XP, Despertar ---------------- */

function Cabecalho({ p, f, alterar, podeEditar, regras, fichaId, souMestre }: PropsAba) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const desp = DESP[p.despertar.id];
  const xpMeta = xpParaSubir(p.nivel);
  const podeSubir = podeEditar && p.nivel < 30 && (souMestre || (!regras.marcos && podeSubirNivel(p, regras)));

  return (
    <section className="janela flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor="ficha-nome" className="sr-only">
            Nome
          </label>
          <input
            id="ficha-nome"
            value={p.nome}
            disabled={!podeEditar}
            onChange={(e) => alterar((r) => void (r.nome = e.target.value))}
            className="min-w-0 bg-transparent text-3xl font-bold outline-none focus:underline"
          />
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="border border-linha px-2 py-0.5">Nível {f.nivel}</span>
            <span className="border border-linha px-2 py-0.5">Rank {f.rank}</span>
            <span className="border border-linha px-2 py-0.5">Rank oficial {p.rankOficial}</span>
            {desp && (
              <span className="border px-2 py-0.5" style={{ borderColor: RARIDADE_DESPERTAR[desp.rar].cor, color: RARIDADE_DESPERTAR[desp.rar].cor }}>
                {desp.n} · {desp.rar} · nv {p.despertar.nv}
              </span>
            )}
            {p.titulo && TIT[p.titulo] && <span className="border border-ouro px-2 py-0.5 text-ouro">{TIT[p.titulo].n}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-mono text-sm">
            {regras.marcos ? 'Marcos (sem XP)' : `XP ${p.xp} / ${xpMeta}`}
          </span>
          {podeEditar && (
            <button
              className="botao"
              disabled={!podeSubir || pendente}
              title={podeSubir ? '' : regras.marcos ? 'Nesta mesa o Mestre decide quando o grupo sobe.' : `Faltam ${xpMeta - p.xp} XP.`}
              onClick={() =>
                iniciar(async () => {
                  const r = await subirNivelAcao(fichaId);
                  setErro(r.erro ?? null);
                })
              }
            >
              {pendente ? 'Subindo…' : '▲ Subir de nível'}
            </button>
          )}
        </div>
      </div>
      {erro && (
        <p role="alert" className="text-sm text-perigo">
          {erro}
        </p>
      )}
    </section>
  );
}

/* ---------------- o que falta distribuir ---------------- */

function Pendencias({ p, f }: PropsAba) {
  const ph = phDisponiveis(p);
  const pericias = f.periciaTotal - Object.values(p.pericias).reduce((t, v) => t + v, 0);
  const itens = [
    p.statusPend > 0 && `${p.statusPend} Pontos de Status para distribuir nos atributos`,
    ph > 0 && `${ph} PH para gastar em habilidades (aba Habilidades)`,
    pericias > 0 && `${pericias} pontos de perícia para distribuir`,
  ].filter(Boolean) as string[];
  if (!itens.length) return null;
  return (
    <section className="caixa border-sys/60 p-3 text-sm">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ SISTEMA ] Pontos disponíveis</p>
      <ul className="mt-1 list-disc pl-5">
        {itens.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- PV, PM, condições, descanso ---------------- */

function VidaMana({ p, f, alterar, podeEditar }: PropsAba) {
  const pv = p.pvAtual ?? f.pvMax;
  const pm = p.pmAtual ?? f.pmMax;
  const condicoes = p.condicoes ? p.condicoes.split(',').map((c) => c.trim()).filter(Boolean) : [];
  const ajustar = (campo: 'pvAtual' | 'pmAtual', atual: number, delta: number, max: number) =>
    alterar((r) => {
      const v = atual + delta;
      r[campo] = campo === 'pmAtual' ? Math.max(0, Math.min(max, v)) : Math.min(max, v);
    });
  const descansoCurto = () =>
    alterar((r) => {
      r.pvAtual = Math.min(f.pvMax, pv + Math.floor(f.pvMax / 4));
      r.pmAtual = Math.min(f.pmMax, pm + Math.floor(f.pmMax / 4));
    });
  const descansoLongo = () =>
    alterar((r) => {
      r.pvAtual = f.pvMax;
      r.pmAtual = f.pmMax;
      r.condicoes = condicoes.filter((c) => c !== 'Exausto').join(', ');
    });
  const alternarCondicao = (c: string) =>
    alterar((r) => {
      r.condicoes = (condicoes.includes(c) ? condicoes.filter((x) => x !== c) : [...condicoes, c]).join(', ');
    });

  return (
    <section className="caixa flex flex-col gap-4 p-4">
      <Barra rotulo="PV" atual={pv} max={f.pvMax} cor="bg-ok" alerta={pv <= 0 ? (pv <= -f.pvMax ? 'Morto' : 'Incapacitado') : null} />
      {podeEditar && <Ajustes onAjuste={(d) => ajustar('pvAtual', pv, d, f.pvMax)} />}
      <Barra rotulo="PM" atual={pm} max={f.pmMax} cor="bg-sys" alerta={null} />
      {podeEditar && <Ajustes onAjuste={(d) => ajustar('pmAtual', pm, d, f.pmMax)} />}
      {podeEditar && (
        <div className="flex flex-wrap gap-2">
          <button className="botao botao-discreto text-sm" onClick={descansoCurto} title="1 hora, até 2 por dia: recupera 1/4 dos PV e PM">
            Descanso curto
          </button>
          <button className="botao botao-discreto text-sm" onClick={descansoLongo} title="8 horas: recupera tudo e remove Exausto">
            Descanso longo
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <span className="rotulo">Condições</span>
        <div className="flex flex-wrap gap-1.5">
          {CONDICOES.map((c) => {
            const ativa = condicoes.includes(c.n);
            return (
              <button
                key={c.n}
                title={c.desc}
                disabled={!podeEditar}
                onClick={() => alternarCondicao(c.n)}
                className={`border px-2 py-0.5 text-xs ${ativa ? 'border-perigo bg-perigo/15 text-perigo' : 'border-linha text-apagado hover:text-texto'}`}
              >
                {c.n}
              </button>
            );
          })}
        </div>
        {condicoes.length > 0 && (
          <ul className="text-xs text-apagado">
            {CONDICOES.filter((c) => condicoes.includes(c.n)).map((c) => (
              <li key={c.n}>
                <b className="text-perigo">{c.n}:</b> {c.desc}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Barra({ rotulo, atual, max, cor, alerta }: { rotulo: string; atual: number; max: number; cor: string; alerta: string | null }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (atual / max) * 100)) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between font-mono text-sm">
        <span>{rotulo}</span>
        <span>
          {alerta && <span className="mr-2 text-perigo">{alerta}</span>}
          {atual} / {max}
        </span>
      </div>
      <div className="h-2 bg-linha">
        <div className={`h-full ${atual <= 0 ? 'bg-perigo' : cor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Ajustes({ onAjuste }: { onAjuste: (delta: number) => void }) {
  const [valor, setValor] = useState('');
  const n = Math.abs(Math.trunc(Number(valor))) || 0;
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      {[-5, -1, 1, 5].map((d) => (
        <button key={d} className="botao botao-discreto px-2 py-0.5" onClick={() => onAjuste(d)}>
          {sinal(d)}
        </button>
      ))}
      <input
        aria-label="Valor"
        inputMode="numeric"
        className="campo w-16 px-2 py-0.5"
        value={valor}
        onChange={(e) => setValor(e.target.value.replace(/[^0-9]/g, ''))}
        placeholder="n"
      />
      <button className="botao botao-discreto px-2 py-0.5" disabled={!n} onClick={() => (onAjuste(-n), setValor(''))}>
        Perder
      </button>
      <button className="botao botao-discreto px-2 py-0.5" disabled={!n} onClick={() => (onAjuste(n), setValor(''))}>
        Recuperar
      </button>
    </div>
  );
}

/* ---------------- atributos ---------------- */

function Atributos({ p, f, alterar, podeEditar }: PropsAba) {
  const rolar = useRolar();
  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="rotulo">Atributos</h2>
        {p.statusPend > 0 && <span className="text-xs text-sys">{p.statusPend} Pontos de Status livres</span>}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ATRIBUTOS.map((a) => {
          const extra = f.atr[a.id] - p.atr[a.id];
          return (
            <div key={a.id} className="flex flex-col border border-linha bg-painel-2">
              <button
                className="flex flex-col p-2 text-left hover:bg-sys/10"
                onClick={() => rolar(`Teste de ${a.nome}`, d20(f.m[a.id]))}
                title={`${a.desc} Clique para rolar 1d20${sinal(f.m[a.id])}.`}
              >
                <span className="font-mono text-xs text-apagado">{a.id}</span>
                <span className="text-2xl font-bold leading-tight">
                  {f.atr[a.id]}
                  {extra !== 0 && <span className="ml-1 text-xs text-ouro">({sinal(extra)} itens)</span>}
                </span>
                <span className="font-mono text-sm text-sys">{sinal(f.m[a.id])}</span>
              </button>
              {podeEditar && (p.statusPend > 0 || p.atr[a.id] > p.atrBase[a.id]) && (
                <div className="flex border-t border-linha text-sm">
                  <button
                    className="flex-1 py-0.5 hover:bg-white/5 disabled:opacity-30"
                    disabled={p.atr[a.id] <= p.atrBase[a.id]}
                    onClick={() => alterar((r) => (r.atr[a.id]--, r.statusPend++))}
                    aria-label={`Tirar ponto de ${a.nome}`}
                  >
                    −
                  </button>
                  <button
                    className="flex-1 py-0.5 hover:bg-white/5 disabled:opacity-30"
                    disabled={p.statusPend <= 0}
                    onClick={() => alterar((r) => (r.atr[a.id]++, r.statusPend--))}
                    aria-label={`Pôr ponto em ${a.nome}`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- combate ---------------- */

function Valor({ rotulo, valor, sub, onRolar, titulo }: { rotulo: string; valor: string; sub?: string; onRolar?: () => void; titulo?: string }) {
  const corpo = (
    <>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-apagado">{rotulo}</span>
      <span className={`text-xl font-bold ${onRolar ? 'text-sys' : ''}`}>{valor}</span>
      {sub && <span className="text-xs text-apagado">{sub}</span>}
    </>
  );
  return onRolar ? (
    <button className="flex flex-col border border-linha bg-painel-2 p-2 text-left hover:border-sys" onClick={onRolar} title={titulo}>
      {corpo}
    </button>
  ) : (
    <div className="flex flex-col border border-linha bg-painel-2 p-2" title={titulo}>
      {corpo}
    </div>
  );
}

function Combate({ f }: PropsAba) {
  const rolar = useRolar();
  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <h2 className="rotulo">Combate</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Valor rotulo="Defender" valor={sinal(f.def)} sub="Nível + FOR + armadura + escudo" onRolar={() => rolar('Reação: Defender', d20(f.def))} />
        <Valor rotulo="Esquivar" valor={sinal(f.esq)} sub="Nível + AGI − penalidade" onRolar={() => rolar('Reação: Esquivar', d20(f.esq))} />
        <Valor rotulo="Iniciativa" valor={sinal(f.ini)} onRolar={() => rolar('Iniciativa', d20(f.ini))} />
        <Valor rotulo="Defesa Passiva" valor={String(f.defPassiva)} sub="quando não percebe o ataque" />
        <Valor rotulo="RD" valor={String(f.rd)} sub={f.rdFisico ? `+${f.rdFisico} só contra físico` : 'reduz cada acerto'} />
        <Valor rotulo="Deslocamento" valor={`${String(f.desl).replace('.', ',')} m`} sub={`Corrida ${String(f.desl * 4).replace('.', ',')} m`} />
        <Valor rotulo="Ações Principais" valor={String(f.acoes)} sub="1 + Nível ÷ 5" />
        <Valor rotulo="Desarmado" valor={sinal(f.ataques[0].atk)} sub={`${f.ataques[0].dado}${sinal(f.ataques[0].bonus)}`} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="rotulo">Ataques</span>
        {f.ataques.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-2 border border-linha bg-painel-2 p-2">
            <span className="min-w-32 flex-1 font-semibold">
              {a.nome}
              {a.dist && <span className="ml-2 text-xs text-apagado">distância</span>}
              {a.critico < 20 && <span className="ml-2 text-xs text-ouro">crítico {a.critico}–20</span>}
            </span>
            <button className="botao px-3 py-1 text-sm" onClick={() => rolar(`Ataque · ${a.nome}`, d20(a.atk), { margemCritico: a.critico })}>
              Ataque {sinal(a.atk)}
            </button>
            <button className="botao botao-discreto px-3 py-1 text-sm" onClick={() => rolar(`Dano · ${a.nome}`, `${a.dado}${sinal(a.bonus).replace('−', '-')}`)}>
              Dano {a.dado}
              {sinal(a.bonus)}
              {a.extra && ` ${a.extra}`}
            </button>
            <button
              className="botao botao-discreto px-3 py-1 text-sm"
              title="Crítico: os dados dobram, os modificadores não"
              onClick={() => rolar(`Dano crítico · ${a.nome}`, `${dobrarDados(a.dado)}${sinal(a.bonus).replace('−', '-')}`)}
            >
              Crítico
            </button>
          </div>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="rotulo">Resistências · 1d20 + Nível + mod</span>
          <div className="grid grid-cols-3 gap-1.5">
            {ATRIBUTO_IDS.map((a) => (
              <button key={a} className="border border-linha bg-painel-2 px-2 py-1 text-left hover:border-sys" onClick={() => rolar(`Resistência (${a})`, d20(f.res[a]))}>
                <span className="font-mono text-xs text-apagado">{a} </span>
                <span className="font-bold text-sys">{sinal(f.res[a])}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="rotulo">CD dos seus poderes · 10 + Nível + mod</span>
          <div className="grid grid-cols-3 gap-1.5">
            {ATRIBUTO_IDS.map((a) => (
              <div key={a} className="border border-linha bg-painel-2 px-2 py-1">
                <span className="font-mono text-xs text-apagado">{a} </span>
                <span className="font-bold">{f.cd[a]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** "1d8+1d4" → "2d8+2d4" (crítico: todos os dados rolam duas vezes). */
const dobrarDados = (dado: string) => dado.replace(/(\d*)d(\d+)/g, (_, q, fc) => `${(Number(q) || 1) * 2}d${fc}`);

/* ---------------- perícias ---------------- */

function Pericias({ p, f, alterar, podeEditar }: PropsAba) {
  const rolar = useRolar();
  const usados = Object.values(p.pericias).reduce((t, v) => t + v, 0);
  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="rotulo">Perícias · 1d20 + mod + grau</h2>
        <span className="text-xs text-apagado">
          {usados}/{f.periciaTotal} pontos · grau máximo {f.periciaMax}
        </span>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {PERICIAS.map((pc) => {
          const grau = p.pericias[pc.n] ?? 0;
          const total = f.per[pc.n];
          const visual = pc.n === 'Percepção' && f.perVisual !== total;
          return (
            <li key={pc.n} className="flex items-center gap-2 border border-linha bg-painel-2 px-2 py-1">
              <button className="flex min-w-0 flex-1 items-baseline gap-2 text-left" onClick={() => rolar(pc.n, d20(total))}>
                <span className="truncate">{pc.n}</span>
                <span className="font-mono text-xs text-apagado">{pc.a}</span>
                <span className="ml-auto font-bold text-sys">{sinal(total)}</span>
              </button>
              {visual && (
                <button className="text-xs text-ouro" title="Bônus que vale só para a visão (Olho de Falcão)" onClick={() => rolar('Percepção (visão)', d20(f.perVisual))}>
                  visão {sinal(f.perVisual)}
                </button>
              )}
              {podeEditar && (
                <span className="flex items-center gap-1 font-mono text-xs">
                  <button className="px-1 disabled:opacity-30" disabled={grau <= 0} onClick={() => alterar((r) => void (r.pericias[pc.n] = grau - 1))} aria-label={`Diminuir ${pc.n}`}>
                    −
                  </button>
                  <span className="w-3 text-center">{grau}</span>
                  <button
                    className="px-1 disabled:opacity-30"
                    disabled={grau >= f.periciaMax || usados >= f.periciaTotal}
                    onClick={() => alterar((r) => void (r.pericias[pc.n] = grau + 1))}
                    aria-label={`Aumentar ${pc.n}`}
                  >
                    +
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------- ajustes do Mestre ---------------- */

function AjustesMestre({ p, alterar }: PropsAba) {
  const numero = (rotulo: string, valor: number, set: (v: number) => void, id: string) => (
    <label key={id} className="flex flex-col gap-1 text-sm" htmlFor={id}>
      {rotulo}
      <input id={id} type="number" className="campo" value={valor} onChange={(e) => set(Math.trunc(Number(e.target.value) || 0))} />
    </label>
  );
  return (
    <details className="caixa border-ouro/50 p-4">
      <summary className="rotulo cursor-pointer text-ouro">Ajustes do Mestre</summary>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {numero('Nível', p.nivel, (v) => alterar((r) => void (r.nivel = Math.max(1, Math.min(30, v)))), 'm-nivel')}
        {numero('XP', p.xp, (v) => alterar((r) => void (r.xp = Math.max(0, v))), 'm-xp')}
        {numero('PH extras', p.phExtra, (v) => alterar((r) => void (r.phExtra = v)), 'm-ph')}
        {numero('Pontos de Status livres', p.statusPend, (v) => alterar((r) => void (r.statusPend = Math.max(0, v))), 'm-st')}
        {ATRIBUTO_IDS.map((a) => numero(`${a} sorteado`, p.atrBase[a], (v) => alterar((r) => void ((r.atrBase[a] = v), (r.atr[a] = Math.max(r.atr[a], v)))), `m-base-${a}`))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <span className="rotulo">Títulos conquistados</span>
        <div className="flex flex-wrap gap-1.5">
          {TITULOS.map((t) => {
            const tem = p.titulosObtidos.includes(t.id);
            return (
              <button
                key={t.id}
                title={`${t.cond} ${t.txt}`}
                className={`border px-2 py-0.5 text-xs ${tem ? 'border-ouro bg-ouro/15 text-ouro' : 'border-linha text-apagado'}`}
                onClick={() =>
                  alterar((r) => {
                    r.titulosObtidos = tem ? r.titulosObtidos.filter((x) => x !== t.id) : [...r.titulosObtidos, t.id];
                    if (tem && r.titulo === t.id) r.titulo = '';
                  })
                }
              >
                {t.n}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {(['pv', 'pm', 'def', 'esq', 'atk', 'dano', 'rd', 'desl', 'ini'] as const).map((k) =>
          numero(`Bônus ${k.toUpperCase()}`, p.bonus[k], (v) => alterar((r) => void (r.bonus[k] = v)), `m-bonus-${k}`),
        )}
      </div>
    </details>
  );
}

