'use client';

import { useActionState } from 'react';
import { criarMesa } from '../acoes';

export function FormNovaMesa() {
  const [estado, acao, enviando] = useActionState(criarMesa, {});
  return (
    <form action={acao} className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <label htmlFor="nome-mesa" className="sr-only">
          Nome da mesa
        </label>
        <input
          id="nome-mesa"
          name="nome"
          className="campo flex-1"
          placeholder="Ex.: Guilda Sem Nome"
          maxLength={80}
          required
        />
        <button className="botao" disabled={enviando}>
          {enviando ? 'Criando…' : 'Criar mesa'}
        </button>
      </div>
      {estado.erro && (
        <p role="alert" className="text-sm text-perigo">
          {estado.erro}
        </p>
      )}
    </form>
  );
}
