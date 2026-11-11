/* Preferências de efeitos do usuário, guardadas no navegador.
   - rapido: pula as animações longas (útil no meio do combate)
   - som: sons curtos gerados pelo navegador (desligado por padrão)
   Quem pediu "reduzir movimento" no sistema operacional também não vê animações. */
import { useSyncExternalStore } from 'react';

export interface Preferencias {
  rapido: boolean;
  som: boolean;
}

const CHAVE = 'despertar:efeitos';
const PADRAO: Preferencias = { rapido: false, som: false };
const ouvintes = new Set<() => void>();
let cache: Preferencias | null = null;

function ler(): Preferencias {
  if (cache) return cache;
  try {
    cache = { ...PADRAO, ...JSON.parse(localStorage.getItem(CHAVE) ?? '{}') };
  } catch {
    cache = { ...PADRAO };
  }
  return cache!;
}

export function mudarPreferencias(parcial: Partial<Preferencias>) {
  cache = { ...ler(), ...parcial };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(cache));
  } catch {
    // navegador sem armazenamento: vale só nesta visita
  }
  ouvintes.forEach((f) => f());
}

const inscrever = (f: () => void) => {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
};

export function usePreferencias(): Preferencias {
  return useSyncExternalStore(inscrever, ler, () => PADRAO);
}

/* "reduzir movimento" do sistema operacional */
const consultaMovimento = () => (typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)'));

export function useMovimentoReduzido(): boolean {
  return useSyncExternalStore(
    (f) => {
      const q = consultaMovimento();
      q?.addEventListener('change', f);
      return () => q?.removeEventListener('change', f);
    },
    () => !!consultaMovimento()?.matches,
    () => false,
  );
}

/** Animações longas ligadas? (não quando o usuário pediu rápido ou menos movimento) */
export function useAnimar(): boolean {
  const { rapido } = usePreferencias();
  const reduzido = useMovimentoReduzido();
  return !rapido && !reduzido;
}
