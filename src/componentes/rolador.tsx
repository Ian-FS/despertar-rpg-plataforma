'use client';
/* Rolagens rápidas da ficha. Por enquanto locais (só você vê); na Fase 2 vão para o histórico da mesa. */
import { createContext, useCallback, useContext, useState } from 'react';
import { d20Natural, ehCritico, rolar, type Rolagem } from '@/regras/rolagem';

interface Entrada {
  id: number;
  rotulo: string;
  r: Rolagem;
  margemCritico: number;
}

type Rolar = (rotulo: string, formula: string, opcoes?: { margemCritico?: number }) => void;

const Ctx = createContext<Rolar>(() => {});
export const useRolar = () => useContext(Ctx);

let seq = 0;

export function Rolador({ children }: { children: React.ReactNode }) {
  const [lista, setLista] = useState<Entrada[]>([]);
  const rolarFn = useCallback<Rolar>((rotulo, formula, opcoes) => {
    const r = rolar(formula);
    if (!r) return;
    setLista((l) => [{ id: ++seq, rotulo, r, margemCritico: opcoes?.margemCritico ?? 20 }, ...l].slice(0, 4));
  }, []);

  return (
    <Ctx.Provider value={rolarFn}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-0 bottom-0 z-40 flex w-full max-w-xs flex-col gap-2"
        style={{
          paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {lista.map((e, i) => {
          const nat = d20Natural(e.r);
          const crit = ehCritico(e.r, e.margemCritico);
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => setLista((l) => l.filter((x) => x.id !== e.id))}
              className={`janela pointer-events-auto flex flex-col p-3 text-left ${i > 0 ? 'opacity-70' : ''}`}
              title="Fechar"
            >
              <span className="rotulo">{e.rotulo}</span>
              <span className={`text-3xl font-bold ${crit ? 'text-ouro' : nat === 1 ? 'text-perigo' : 'text-sys'}`}>{e.r.total}</span>
              <span className="font-mono text-xs text-apagado">
                {e.r.texto}
                {crit ? (nat === 20 ? ' · 20 natural!' : ` · crítico (${e.margemCritico}+)`) : nat === 1 ? ' · 1 natural' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

/** Formata bônus: 3 → "+3", −2 → "−2". */
export const sinal = (n: number) => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);

/** Fórmula de d20 + bônus. */
export const d20 = (bonus: number) => (bonus >= 0 ? `1d20+${bonus}` : `1d20-${Math.abs(bonus)}`);
