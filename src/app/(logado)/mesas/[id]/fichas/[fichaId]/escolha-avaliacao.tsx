'use client';

import { useState, useTransition } from 'react';
import { CartaoHabilidade } from '@/componentes/cartoes';
import { HAB } from '@/regras/dados';
import { escolherAvaliacaoAcao } from '../acoes';

/** Escolha de 1 entre 3 habilidades da Avaliação do Sistema (na criação ou ao subir de Rank). */
export function EscolhaAvaliacao({ fichaId, rank, opcoes, inicial }: { fichaId: string; rank: string; opcoes: string[]; inicial?: boolean }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  return (
    <section className="janela flex flex-col gap-4 p-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ AVALIAÇÃO DO SISTEMA · RANK {rank} ]</p>
        <p className="mt-2">
          Escolha uma habilidade. Ela é sua de graça
          {inicial ? ', mesmo sem cumprir o requisito de atributo.' : '. Os requisitos de atributo e de pré-requisito são ignorados.'}
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {opcoes.map((id) => (
          <CartaoHabilidade
            key={id}
            h={HAB[id]}
            rodape={
              <button
                className="botao mt-2 self-start"
                disabled={pendente}
                onClick={() =>
                  iniciar(async () => {
                    const r = await escolherAvaliacaoAcao(fichaId, id);
                    setErro(r.erro ?? null);
                  })
                }
              >
                Escolher
              </button>
            }
          />
        ))}
      </div>
      {erro && (
        <p role="alert" className="text-sm text-perigo">
          {erro}
        </p>
      )}
    </section>
  );
}
