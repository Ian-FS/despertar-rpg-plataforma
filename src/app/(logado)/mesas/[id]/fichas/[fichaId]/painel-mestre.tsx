'use client';

import { useState, useTransition } from 'react';
import type { SorteioLinha } from '@/lib/supabase/tipos-banco';
import { liberarSorteioAcao } from '../acoes';
import { RegistroSorteios } from './criacao';

/** Ferramentas do Mestre nesta ficha: liberar sorteios e ver o registro completo. */
export function PainelMestreFicha({ fichaId, liberados, sorteios }: { fichaId: string; liberados: string[]; sorteios: SorteioLinha[] }) {
  const [aviso, setAviso] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const liberar = (tipo: 'atributos' | 'despertar') =>
    iniciar(async () => {
      const r = await liberarSorteioAcao(fichaId, tipo);
      setAviso(r.erro ?? `O jogador pode sortear ${tipo === 'atributos' ? 'os atributos' : 'o Despertar'} de novo.`);
    });

  return (
    <section className="caixa flex flex-col gap-3 border-ouro/50 p-4">
      <h2 className="rotulo text-ouro">Mestre</h2>
      <p className="text-sm text-apagado">
        Como Mestre, você pode editar qualquer campo desta ficha (nível, XP, PH extra, Títulos) e liberar um novo sorteio.
      </p>
      <div className="flex flex-wrap gap-2">
        {(['atributos', 'despertar'] as const).map((t) => (
          <button key={t} className="botao botao-discreto" disabled={pendente || liberados.includes(t)} onClick={() => liberar(t)}>
            {liberados.includes(t) ? `Sorteio de ${t} liberado` : `Liberar novo sorteio de ${t}`}
          </button>
        ))}
      </div>
      {aviso && (
        <p role="status" className="text-sm text-apagado">
          {aviso}
        </p>
      )}
      <RegistroSorteios sorteios={sorteios} />
    </section>
  );
}
