'use client';
/* Central de efeitos: janelas do Sistema (em fila), avisos rápidos e sons.
   Fica no layout das páginas logadas, então as janelas sobrevivem à atualização da página. */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePreferencias, type Preferencias } from './preferencias';
import { JanelaAtributos, JanelaDespertar, JanelaNivel, JanelaNotificacao, type DadosNivel } from './revelacoes';
import { tocar, type Som } from './sons';
import type { SorteioAtributos } from '@/regras/criacao';

export type Tom = 'sys' | 'ok' | 'perigo' | 'ouro';

export type Janela =
  | { tipo: 'notificacao'; cabecalho: string; titulo: string; linhas?: string[]; tom?: Tom }
  | { tipo: 'atributos'; dados: SorteioAtributos }
  | { tipo: 'despertar'; d100: number[]; opcoes: string[] }
  | { tipo: 'nivel'; dados: DadosNivel };

interface Aviso {
  id: number;
  texto: string;
  tom: Tom;
}

interface Efeitos {
  prefs: Preferencias;
  som: (s: Som) => void;
  /** aviso curto no canto da tela (não bloqueia) */
  aviso: (texto: string, tom?: Tom) => void;
  /** janela do Sistema; resolve quando o usuário fecha */
  abrir: (j: Janela) => Promise<void>;
}

/** Sem provedor, os efeitos viram "nada acontece": nunca derrubam a página. */
const SEM_EFEITOS: Efeitos = {
  prefs: { rapido: true, som: false },
  som: () => {},
  aviso: () => {},
  abrir: () => Promise.resolve(),
};

const Ctx = createContext<Efeitos>(SEM_EFEITOS);

export function useEfeitos(): Efeitos {
  return useContext(Ctx);
}

let seq = 0;

export function ProvedorEfeitos({ children }: { children: React.ReactNode }) {
  const prefs = usePreferencias();
  const [fila, setFila] = useState<{ id: number; j: Janela; resolver: () => void }[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const som = useCallback(
    (s: Som) => {
      if (prefs.som) tocar(s);
    },
    [prefs.som],
  );

  const aviso = useCallback(
    (texto: string, tom: Tom = 'sys') => {
      const id = ++seq;
      setAvisos((l) => [...l.slice(-3), { id, texto, tom }]);
      setTimeout(() => setAvisos((l) => l.filter((a) => a.id !== id)), 3200);
    },
    [],
  );

  const abrir = useCallback(
    (j: Janela) => new Promise<void>((resolver) => setFila((f) => [...f, { id: ++seq, j, resolver }])),
    [],
  );

  const fechar = useCallback(() => {
    setFila((f) => {
      f[0]?.resolver();
      return f.slice(1);
    });
  }, []);

  const valor = useMemo(() => ({ prefs, som, aviso, abrir }), [prefs, som, aviso, abrir]);
  const atual = fila[0];

  return (
    <Ctx.Provider value={valor}>
      {children}

      {atual && (
        <div
          className="sobreposicao fixed inset-0 z-50 grid place-items-center bg-[#03060f]/75 backdrop-blur-[2px]"
          style={{
            padding:
              'max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) max(16px, env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px))',
          }}
        >
          {atual.j.tipo === 'notificacao' && <JanelaNotificacao key={atual.id} {...atual.j} onFechar={fechar} som={som} />}
          {atual.j.tipo === 'atributos' && <JanelaAtributos key={atual.id} dados={atual.j.dados} onFechar={fechar} som={som} />}
          {atual.j.tipo === 'despertar' && <JanelaDespertar key={atual.id} d100={atual.j.d100} opcoes={atual.j.opcoes} onFechar={fechar} som={som} />}
          {atual.j.tipo === 'nivel' && <JanelaNivel key={atual.id} dados={atual.j.dados} onFechar={fechar} som={som} />}
        </div>
      )}

      <div
        aria-live="polite"
        className="pointer-events-none fixed top-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2"
        style={{ paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))', paddingInline: 16 }}
      >
        {avisos.map((a) => (
          <div key={a.id} className={`aviso-sistema aviso-${a.tom} janela pointer-events-auto px-4 py-2 text-sm`}>
            {a.texto}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
