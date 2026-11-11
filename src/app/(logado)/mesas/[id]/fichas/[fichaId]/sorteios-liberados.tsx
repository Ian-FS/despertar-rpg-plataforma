'use client';

import { useState, useTransition } from 'react';
import { CartaoDespertar } from '@/componentes/cartoes';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import { DESP } from '@/regras/dados';
import { escolherDespertarAcao, sortearAtributosAcao, sortearDespertarAcao, type Resultado } from '../acoes';

/** Novo sorteio liberado pelo Mestre numa ficha já pronta (ou escolha pendente da Escolha Guiada). */
export function SorteiosLiberados({
  fichaId,
  liberados,
  despertarPendente,
  metodoPadrao,
}: {
  fichaId: string;
  liberados: string[];
  despertarPendente: string[] | null;
  metodoPadrao: boolean;
}) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const efeitos = useEfeitos();
  const executar = (fn: () => Promise<Resultado>) =>
    iniciar(async () => {
      const r = await fn();
      setErro(r.erro ?? null);
      if (r.atributos) await efeitos.abrir({ tipo: 'atributos', dados: r.atributos });
      if (r.despertar) await efeitos.abrir({ tipo: 'despertar', ...r.despertar });
    });

  if (despertarPendente)
    return (
      <section className="janela flex flex-col gap-3 p-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ ESCOLHA GUIADA ] Fique com um</p>
        <div className="grid gap-3 md:grid-cols-2">
          {despertarPendente.map((id) => (
            <CartaoDespertar
              key={id}
              x={DESP[id]}
              rodape={
                <button className="botao mt-2 self-start" disabled={pendente} onClick={() => executar(() => escolherDespertarAcao(fichaId, id))}>
                  Escolher {DESP[id].n}
                </button>
              }
            />
          ))}
        </div>
        {erro && <p className="text-sm text-perigo">{erro}</p>}
      </section>
    );

  const podeAtributos = liberados.includes('atributos') && !metodoPadrao;
  const podeDespertar = liberados.includes('despertar');
  if (!podeAtributos && !podeDespertar) return null;

  return (
    <section className="janela flex flex-col gap-3 p-4">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ SISTEMA ] O Mestre liberou um novo sorteio</p>
      <p className="text-sm text-apagado">
        O resultado novo substitui o anterior. Pontos de Status já distribuídos voltam para você redistribuir.
      </p>
      <div className="flex flex-wrap gap-2">
        {podeAtributos && (
          <button className="botao" disabled={pendente} onClick={() => executar(() => sortearAtributosAcao(fichaId))}>
            🎲 Sortear atributos de novo
          </button>
        )}
        {podeDespertar && (
          <button className="botao" disabled={pendente} onClick={() => executar(() => sortearDespertarAcao(fichaId))}>
            ✦ Sortear Despertar de novo
          </button>
        )}
      </div>
      {erro && <p className="text-sm text-perigo">{erro}</p>}
    </section>
  );
}
