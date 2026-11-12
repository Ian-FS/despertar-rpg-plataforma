'use client';
/* Dados da mesa que mudam durante o jogo: o combate e o resumo das fichas (PV, PM, condições). */
import { useEffect, useState } from 'react';
import { assinar } from '@/lib/supabase/tempo-real';
import type { CombateLinha, FichaPublicoLinha } from '@/lib/supabase/tipos-banco';
import { COMBATE_VAZIO, type EstadoCombate } from '@/regras/combate';

/** Combate da mesa, ao vivo. */
export function useCombate(mesaId: string, inicial: EstadoCombate | null): EstadoCombate {
  const [estado, setEstado] = useState<EstadoCombate>(inicial ?? COMBATE_VAZIO);
  useEffect(
    () =>
      assinar(`combate:${mesaId}`, (c) =>
        c.on('postgres_changes', { event: '*', schema: 'public', table: 'combates', filter: `mesa_id=eq.${mesaId}` }, (payload) => {
          const linha = payload.new as Partial<CombateLinha>;
          if (linha?.estado) setEstado(linha.estado);
        }),
      ),
    [mesaId],
  );
  return estado;
}

/** Resumo das fichas da mesa (as que você pode ver), ao vivo. */
export function useGrupo(mesaId: string, inicial: FichaPublicoLinha[]): FichaPublicoLinha[] {
  const [lista, setLista] = useState(inicial);
  useEffect(
    () =>
      assinar(`grupo:${mesaId}`, (c) =>
        c.on('postgres_changes', { event: '*', schema: 'public', table: 'fichas_publico', filter: `mesa_id=eq.${mesaId}` }, (payload) => {
          const linha = payload.new as FichaPublicoLinha;
          if (!linha?.id) return;
          setLista((atual) => (atual.some((x) => x.id === linha.id) ? atual.map((x) => (x.id === linha.id ? linha : x)) : [...atual, linha]));
        }),
      ),
    [mesaId],
  );
  return lista;
}
