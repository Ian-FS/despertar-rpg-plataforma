'use client';

import { useState, useTransition } from 'react';
import { TelaCarregando } from '@/componentes/efeitos/carregando';
import { aceitarConvite } from '../../acoes';

export function BotaoAceitar({ codigo }: { codigo: string }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  return (
    <div className="flex flex-col gap-2">
      {pendente && <TelaCarregando texto="Entrando na mesa" />}
      <button
        type="button"
        className="botao"
        disabled={pendente}
        onClick={() => iniciar(async () => setErro((await aceitarConvite(codigo)).erro ?? null))}
      >
        {pendente ? 'Entrando…' : '[ ACEITAR ]'}
      </button>
      {erro && (
        <p role="alert" className="text-sm text-perigo">
          {erro}
        </p>
      )}
    </div>
  );
}
