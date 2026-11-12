'use client';
/* Faixa do combate na ficha: rodada, de quem é a vez e o botão de encerrar o turno. */
import Link from 'next/link';
import { useTransition } from 'react';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import type { EstadoCombate } from '@/regras/combate';
import { naVez, pressao } from '@/regras/combate';
import { useCombate } from '../ao-vivo';
import { proximaVezAcao } from './acoes';
import { FilaTurnos, useAvisoDaVez } from './painel-combate';

export function BarraCombate({
  mesaId,
  fichaId,
  inicial,
  usuarioId,
  souMestre,
}: {
  mesaId: string;
  fichaId: string;
  inicial: EstadoCombate | null;
  usuarioId: string;
  souMestre: boolean;
}) {
  const { estado, recarregar } = useCombate(mesaId, inicial);
  useAvisoDaVez(estado, usuarioId);
  const efeitos = useEfeitos();
  const [ocupado, iniciar] = useTransition();
  if (!estado.ativo) return null;
  const atual = naVez(estado);
  const eu = estado.combatentes.find((c) => c.fichaId === fichaId);
  const minhaVez = !!atual && atual.fichaId === fichaId;
  const podePassar = souMestre || (minhaVez && atual!.donoId === usuarioId);
  const passar = () =>
    iniciar(async () => {
      const r = await proximaVezAcao(mesaId, estado.vez);
      if (r.erro) {
        efeitos.som('falha');
        efeitos.aviso(r.erro, 'perigo');
        recarregar(); // a tela pode estar atrasada (ex.: o combate já acabou)
      } else if (r.linhas?.length) efeitos.aviso(`[ COMBATE ] ${r.linhas.join(' ')}`, 'sys');
    });
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 border px-3 py-2 text-sm ${minhaVez ? 'border-ouro bg-ouro/10' : 'border-perigo/60 bg-painel-2'}`}>
      <span className="font-mono text-xs tracking-[0.15em] text-perigo">⚔ RODADA {estado.rodada}</span>
      <span className="min-w-0 flex-1">
        {minhaVez ? (
          <b className="text-ouro">Sua vez{estado.vez!.passada > 1 ? ` (${estado.vez!.passada}ª ação)` : ''}!</b>
        ) : (
          <>
            Vez de <b>{atual?.nome ?? '—'}</b>
          </>
        )}
        {eu && eu.reacoes > 0 && <span className="ml-2 text-xs text-perigo">Pressão na próxima Reação: {pressao(eu)}</span>}
      </span>
      {podePassar && (
        <button className="botao px-3 py-1 text-sm" disabled={ocupado} onClick={passar}>
          {minhaVez && !souMestre ? 'Encerrar meu turno' : 'Próximo ▶'}
        </button>
      )}
      <Link href={`/mesas/${mesaId}`} className="text-xs text-sys hover:underline">
        Ver combate
      </Link>
      <div className="w-full">
        <FilaTurnos estado={estado} usuarioId={usuarioId} max={8} />
      </div>
    </div>
  );
}
