'use client';
/* Janelas do Sistema: notificação, revelação dos atributos, do Despertar e da subida de nível. */
import { useEffect, useRef, useState } from 'react';
import type { SorteioAtributos } from '@/regras/criacao';
import { ATRIBUTOS, DESP, RARIDADE_DESPERTAR } from '@/regras/dados';
import { NumeroGirando } from './numero-girando';
import { useAnimar } from './preferencias';
import type { Som } from './sons';

interface Base {
  onFechar: () => void;
  som: (s: Som) => void;
}

/* ---------------- moldura comum ---------------- */

function Moldura({
  cabecalho,
  tom = 'sys',
  pronto,
  onFechar,
  onPular,
  children,
  rotuloBotao = '[ CONFIRMAR ]',
}: {
  cabecalho: string;
  tom?: 'sys' | 'ok' | 'perigo' | 'ouro';
  pronto: boolean;
  onFechar: () => void;
  onPular?: () => void;
  children: React.ReactNode;
  rotuloBotao?: string;
}) {
  const botao = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (pronto) botao.current?.focus();
  }, [pronto]);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' && e.key !== 'Enter') return;
      if (pronto) onFechar();
      else onPular?.();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [pronto, onFechar, onPular]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={cabecalho}
      className={`janela-sistema janela-${tom} relative flex max-h-full w-full max-w-lg flex-col gap-4 overflow-y-auto p-6 text-center`}
      onClick={() => !pronto && onPular?.()}
    >
      <span className="linhas-varredura" aria-hidden />
      <p className="cabecalho-sistema font-mono text-xs tracking-[0.3em]">{cabecalho}</p>
      {children}
      <button
        ref={botao}
        className={`botao self-center ${pronto ? '' : 'invisible'}`}
        onClick={(e) => (e.stopPropagation(), onFechar())}
      >
        {rotuloBotao}
      </button>
      {!pronto && <span className="text-xs text-apagado">toque para pular</span>}
    </div>
  );
}

/** Texto que aparece letra por letra. */
function TextoDigitado({ texto, instantaneo, onFim }: { texto: string; instantaneo: boolean; onFim?: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (instantaneo) {
      onFim?.();
      return;
    }
    const t = setInterval(() => {
      setN((x) => {
        if (x + 1 >= texto.length) {
          clearInterval(t);
          setTimeout(() => onFim?.(), 0);
        }
        return x + 1;
      });
    }, 28);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, instantaneo]);
  return (
    <span>
      {instantaneo ? texto : texto.slice(0, n)}
      {!instantaneo && n < texto.length && <span className="cursor-digitando">▌</span>}
    </span>
  );
}

/** Espera `ms` (ou nada, se as animações estão desligadas) e marca como pronto. */
function usePronto(ms: number, pular: boolean): boolean {
  const animar = useAnimar();
  const [passou, setPassou] = useState(false);
  useEffect(() => {
    if (!animar) return;
    const t = setTimeout(() => setPassou(true), ms);
    return () => clearTimeout(t);
  }, [ms, animar]);
  return !animar || pular || passou;
}

/* ---------------- notificação genérica ---------------- */

export function JanelaNotificacao({
  cabecalho,
  titulo,
  linhas = [],
  tom = 'sys',
  onFechar,
  som,
}: Base & { cabecalho: string; titulo: string; linhas?: string[]; tom?: 'sys' | 'ok' | 'perigo' | 'ouro' }) {
  const animar = useAnimar();
  const [pular, setPular] = useState(false);
  const [digitado, setDigitado] = useState(false);
  const pronto = !animar || pular || digitado;
  useEffect(() => som(tom === 'ouro' ? 'raro' : 'sistema'), [som, tom]);

  return (
    <Moldura cabecalho={cabecalho} tom={tom} pronto={pronto} onFechar={onFechar} onPular={() => setPular(true)}>
      <p className="titulo-sistema text-2xl font-bold">
        <TextoDigitado texto={titulo} instantaneo={!animar || pular} onFim={() => setDigitado(true)} />
      </p>
      {pronto && linhas.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {linhas.map((l, i) => (
            <li key={l} className={animar && !pular ? 'aparecer' : ''} style={{ animationDelay: `${i * 90}ms` }}>
              {l}
            </li>
          ))}
        </ul>
      )}
    </Moldura>
  );
}

/* ---------------- atributos ---------------- */

export function JanelaAtributos({ dados, onFechar, som }: Base & { dados: SorteioAtributos }) {
  const animar = useAnimar();
  const [pular, setPular] = useState(false);
  const instantaneo = !animar || pular;
  const ATRASO = 700;
  const PASSO = 280;
  const GIRO = 520;
  const total = ATRASO + PASSO * 5 + GIRO + 150;
  const pronto = usePronto(total, pular);
  useEffect(() => {
    som('dado');
    if (!animar) return;
    const ts = [ATRASO, ATRASO + PASSO * 2, ATRASO + PASSO * 4].map((t) => setTimeout(() => som('dado'), t));
    const fim = setTimeout(() => som('sistema'), total);
    return () => [...ts, fim].forEach(clearTimeout);
  }, [som, animar, total]);

  const { potencial } = dados;
  return (
    <Moldura cabecalho="[ SISTEMA ] MEDIÇÃO DE POTENCIAL" pronto={pronto} onFechar={onFechar} onPular={() => setPular(true)}>
      <div className="flex flex-col items-center gap-1">
        <span className="rotulo">Potencial · 1d6</span>
        <span className="text-4xl font-bold text-sys">
          <NumeroGirando final={dados.d6} faces={6} duracao={ATRASO - 100} instantaneo={instantaneo} />
        </span>
        <span className={`text-lg font-semibold ${instantaneo ? '' : 'aparecer'}`} style={{ animationDelay: `${ATRASO - 100}ms` }}>
          {potencial.n} · base {potencial.base}
          {potencial.st > 0 && ` · +${potencial.st} Status, +${potencial.ph} PH`}
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-1.5 text-left sm:grid-cols-2">
        {ATRIBUTOS.map((a, i) => {
          const atraso = ATRASO + PASSO * i;
          const [d1, d2] = dados.rolagens[a.id];
          return (
            <li key={a.id} className="flex items-center gap-2 border border-linha bg-painel/70 px-3 py-1.5 font-mono">
              <span className="w-9 text-apagado">{a.id}</span>
              <span className="text-apagado">{potencial.base} +</span>
              <span className="dado-mini">
                <NumeroGirando final={d1} faces={6} atraso={atraso} duracao={GIRO} instantaneo={instantaneo} />
              </span>
              <span className="dado-mini">
                <NumeroGirando final={d2} faces={6} atraso={atraso + 60} duracao={GIRO} instantaneo={instantaneo} />
              </span>
              <span className={`ml-auto text-xl font-bold text-texto ${instantaneo ? '' : 'aparecer'}`} style={{ animationDelay: `${atraso + GIRO + 80}ms` }}>
                {dados.atr[a.id]}
              </span>
            </li>
          );
        })}
      </ul>
    </Moldura>
  );
}

/* ---------------- Despertar ---------------- */

const CLASSE_RARIDADE: Record<string, string> = {
  Comum: 'rar-comum',
  Raro: 'rar-raro',
  Épico: 'rar-epico',
  Lendário: 'rar-lendario',
  Anomalia: 'rar-anomalia',
};

export function JanelaDespertar({ d100, opcoes, onFechar, som }: Base & { d100: number[]; opcoes: string[] }) {
  const animar = useAnimar();
  const [pular, setPular] = useState(false);
  const instantaneo = !animar || pular;
  const ESCANEAR = 1300;
  const GIRO = 900;
  const pronto = usePronto(ESCANEAR + GIRO + 300, pular);
  const melhor = opcoes.map((id) => DESP[id]).sort((a, b) => b.d[0] - a.d[0])[0];

  useEffect(() => {
    if (!animar) return;
    const t1 = setTimeout(() => som('dado'), ESCANEAR);
    const t2 = setTimeout(() => som(['Épico', 'Lendário', 'Anomalia'].includes(melhor.rar) ? 'raro' : 'sistema'), ESCANEAR + GIRO);
    return () => (clearTimeout(t1), clearTimeout(t2));
  }, [som, animar, melhor]);

  return (
    <Moldura cabecalho="[ SISTEMA ] DESPERTAR" pronto={pronto} onFechar={onFechar} onPular={() => setPular(true)}>
      {!instantaneo && (
        <div className="aparecer-sumir flex flex-col items-center gap-2" style={{ animationDuration: `${ESCANEAR}ms` }}>
          <span className="text-sm text-apagado">Escaneando mana…</span>
          <span className="barra-escaneando h-1 w-48 bg-linha" />
        </div>
      )}
      <div className={`grid gap-3 ${opcoes.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {opcoes.map((id, i) => {
          const x = DESP[id];
          const r = RARIDADE_DESPERTAR[x.rar];
          return (
            <div key={id + i} className="flex flex-col items-center gap-1">
              <span className="rotulo">d100</span>
              <span className="text-4xl font-bold text-sys">
                <NumeroGirando final={d100[i]} faces={100} atraso={ESCANEAR} duracao={GIRO} instantaneo={instantaneo} />
              </span>
              <div
                className={`revelacao ${CLASSE_RARIDADE[x.rar]} ${instantaneo ? '' : 'aparecer'} flex flex-col items-center gap-1 border px-4 py-3`}
                style={{ animationDelay: `${ESCANEAR + GIRO}ms`, borderColor: r.cor }}
              >
                <span className="text-2xl font-bold" style={{ color: r.cor }} data-texto={x.n}>
                  {x.n}
                </span>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: r.cor }}>
                  {x.rar}
                </span>
                <span className="text-sm italic text-apagado">{x.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
      {pronto && <p className="text-sm text-apagado">{opcoes.length > 1 ? 'Escolha um dos dois na ficha.' : 'Você despertou.'}</p>}
    </Moldura>
  );
}

/* ---------------- subida de nível ---------------- */

export interface DadosNivel {
  nivelAntes: number;
  nivelDepois: number;
  status: { rolagens: number[]; valor: number };
  ph: { rolagens: number[]; valor: number };
  novoRank: string | null;
  pv: [number, number];
  pm: [number, number];
  acoes: [number, number];
}

/* partículas em posições fixas (não aleatórias, para o desenho ser estável) */
const PARTICULAS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  delay: `${(i * 137) % 900}ms`,
  dur: `${1400 + ((i * 89) % 900)}ms`,
  size: 3 + (i % 3),
}));

export function JanelaNivel({ dados, onFechar, som }: Base & { dados: DadosNivel }) {
  const animar = useAnimar();
  const [pular, setPular] = useState(false);
  const instantaneo = !animar || pular;
  const pronto = usePronto(1600, pular);
  useEffect(() => som('nivel'), [som]);

  const bencao = (r: { rolagens: number[] }) => (r.rolagens.length > 1 ? ` (1d6: 1 → ${r.rolagens[1]}, Bênção do Sistema)` : ` (1d6: ${r.rolagens[0]})`);
  const linhas = [
    `Pontos de Status +${dados.status.valor}${bencao(dados.status)}`,
    `Pontos de Habilidade +${dados.ph.valor}${bencao(dados.ph)}`,
    `PV máximos ${dados.pv[0]} → ${dados.pv[1]}`,
    `PM máximos ${dados.pm[0]} → ${dados.pm[1]}`,
    '+2 pontos de perícia · Ataque, Reações, Resistências e CDs +1',
    ...(dados.acoes[1] > dados.acoes[0] ? [`Ações Principais ${dados.acoes[0]} → ${dados.acoes[1]}`] : []),
  ];

  return (
    <Moldura cabecalho="[ NOTIFICAÇÃO ]" tom="ouro" pronto={pronto} onFechar={onFechar} onPular={() => setPular(true)}>
      {animar && (
        <span className="particulas" aria-hidden>
          {PARTICULAS.map((p, i) => (
            <i key={i} style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, width: p.size, height: p.size }} />
          ))}
        </span>
      )}
      <p className="titulo-nivel text-4xl font-bold">Nível aumentado!</p>
      <p className="font-mono text-lg">
        Nível {dados.nivelAntes} → <span className="text-ouro">{dados.nivelDepois}</span>
      </p>
      <ul className="flex flex-col gap-1 text-sm">
        {linhas.map((l, i) => (
          <li key={l} className={instantaneo ? '' : 'aparecer'} style={{ animationDelay: `${400 + i * 150}ms` }}>
            {l}
          </li>
        ))}
      </ul>
      {dados.novoRank && (
        <div className={`border border-ouro bg-ouro/10 p-3 text-sm ${instantaneo ? '' : 'aparecer'}`} style={{ animationDelay: '1300ms' }}>
          <p className="font-bold text-ouro">Rank {dados.novoRank} liberado!</p>
          <p>Habilidades do novo Rank · +1 nível grátis no Despertar · Avaliação do Sistema disponível na ficha.</p>
        </div>
      )}
    </Moldura>
  );
}
