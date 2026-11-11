'use client';

import { useActionState } from 'react';
import { TelaCarregando } from '@/componentes/efeitos/carregando';
import { ARMAS } from '@/regras/dados';
import { criarFicha } from '../acoes';

export function FormNovaFicha({ mesaId }: { mesaId: string }) {
  const [estado, acao, enviando] = useActionState(criarFicha.bind(null, mesaId), {});
  return (
    <form action={acao} className="caixa flex flex-col gap-4 p-4">
      {enviando && <TelaCarregando texto="Registrando novo Jogador" />}
      <Campo id="nome" rotulo="Nome do personagem">
        <input id="nome" name="nome" className="campo" maxLength={80} required placeholder="Ex.: Rafa Moreira" />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="idade" rotulo="Idade">
          <input id="idade" name="idade" className="campo" maxLength={20} placeholder="Ex.: 24" />
        </Campo>
        <Campo id="ocupacao" rotulo="Ocupação antes de despertar">
          <input id="ocupacao" name="ocupacao" className="campo" maxLength={80} placeholder="Ex.: entregador" />
        </Campo>
      </div>
      <Campo id="motivo" rotulo="Motivo: por que você continua entrando em Portais?">
        <textarea
          id="motivo"
          name="motivo"
          className="campo min-h-24"
          maxLength={500}
          placeholder="Dívidas, um parente no hospital, vingança, fama, curiosidade sobre o Sistema…"
        />
      </Campo>
      <Campo id="arma" rotulo="Arma inicial (Comum, Rank E)">
        <select id="arma" name="arma" className="campo" defaultValue="Espada">
          {ARMAS.map((a) => (
            <option key={a.n} value={a.n}>
              {a.n} · {a.dano} · {a.a}
              {a.tags ? ` · ${a.tags}` : ''}
            </option>
          ))}
        </select>
      </Campo>
      <p className="text-sm text-apagado">
        Você também recebe: Licença de Caçador Rank E, Traje de Combate, 2 Poções de Cura Rank E e 100 de Ouro.
      </p>
      {estado.erro && (
        <p role="alert" className="text-sm text-perigo">
          {estado.erro}
        </p>
      )}
      <button className="botao self-start" disabled={enviando}>
        {enviando ? 'Criando…' : 'Continuar para os atributos'}
      </button>
    </form>
  );
}

function Campo({ id, rotulo, children }: { id: string; rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      {children}
    </div>
  );
}
