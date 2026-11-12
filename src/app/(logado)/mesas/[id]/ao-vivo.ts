'use client';
/* Dados da mesa que mudam durante o jogo: o combate e o resumo das fichas (PV, PM, condições). */
import { useCallback, useEffect, useState } from 'react';
import { clienteNavegador } from '@/lib/supabase/navegador';
import { assinar } from '@/lib/supabase/tempo-real';
import type { CombateLinha, FichaPublicoLinha } from '@/lib/supabase/tipos-banco';
import { COMBATE_VAZIO, type EstadoCombate } from '@/regras/combate';

/** Combate da mesa, ao vivo. `recarregar` relê do banco (ex.: o servidor disse que o combate acabou). */
export function useCombate(mesaId: string, inicial: EstadoCombate | null): { estado: EstadoCombate; recarregar: () => void } {
  const [estado, setEstado] = useState<EstadoCombate>(inicial ?? COMBATE_VAZIO);
  const recarregar = useCallback(() => {
    clienteNavegador()
      .from('combates')
      .select('estado')
      .eq('mesa_id', mesaId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setEstado(data?.estado ?? COMBATE_VAZIO);
      });
  }, [mesaId]);
  useEffect(
    () =>
      assinar(
        `combate:${mesaId}`,
        (c) =>
          c.on('postgres_changes', { event: '*', schema: 'public', table: 'combates', filter: `mesa_id=eq.${mesaId}` }, (payload) => {
            const linha = payload.new as Partial<CombateLinha>;
            if (linha?.estado) setEstado(linha.estado);
          }),
        { sincronizar: recarregar },
      ),
    [mesaId, recarregar],
  );
  return { estado, recarregar };
}

/** Resumo das fichas da mesa (as que você pode ver), ao vivo. */
export function useGrupo(mesaId: string, inicial: FichaPublicoLinha[]): FichaPublicoLinha[] {
  const [lista, setLista] = useState(inicial);
  const recarregar = useCallback(() => {
    clienteNavegador()
      .from('fichas_publico')
      .select('*')
      .eq('mesa_id', mesaId)
      .order('atualizado_em')
      .then(({ data, error }) => {
        if (!error && data) setLista(data);
      });
  }, [mesaId]);
  useEffect(
    () =>
      assinar(
        `grupo:${mesaId}`,
        (c) =>
          c.on('postgres_changes', { event: '*', schema: 'public', table: 'fichas_publico', filter: `mesa_id=eq.${mesaId}` }, (payload) => {
            const linha = payload.new as FichaPublicoLinha;
            if (!linha?.id) return;
            setLista((atual) => (atual.some((x) => x.id === linha.id) ? atual.map((x) => (x.id === linha.id ? linha : x)) : [...atual, linha]));
          }),
        { sincronizar: recarregar },
      ),
    [mesaId, recarregar],
  );
  return lista;
}
