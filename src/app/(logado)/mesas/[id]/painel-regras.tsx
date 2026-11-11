'use client';

import { useState, useTransition } from 'react';
import { DESCRICAO_REGRAS } from '@/lib/fichas/regras-padrao';
import type { RegrasMesa } from '@/lib/supabase/tipos-banco';
import { salvarRegrasMesa } from './fichas/acoes';

export function PainelRegras({ mesaId, regras }: { mesaId: string; regras: RegrasMesa }) {
  const [atual, setAtual] = useState(regras);
  const [aviso, setAviso] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  function alternar(chave: keyof RegrasMesa) {
    const novo = { ...atual, [chave]: !atual[chave] };
    setAtual(novo);
    iniciar(async () => {
      const r = await salvarRegrasMesa(mesaId, novo);
      if (r.erro) {
        setAtual(atual);
        setAviso(r.erro);
      } else setAviso('Regras salvas.');
    });
  }

  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <h2 className="rotulo">Regras opcionais</h2>
      <p className="text-sm text-apagado">Desligadas, valem as regras padrão do livro.</p>
      <ul className="flex flex-col gap-3">
        {DESCRICAO_REGRAS.map((r) => (
          <li key={r.chave}>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id={`regra-${r.chave}`}
                type="checkbox"
                className="mt-1 h-4 w-4 accent-sky-400"
                checked={atual[r.chave]}
                disabled={pendente}
                onChange={() => alternar(r.chave)}
              />
              <span>
                <span className="font-semibold">{r.nome}</span>
                <span className="block text-sm text-apagado">{r.desc}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      {aviso && (
        <p role="status" className="text-sm text-apagado">
          {aviso}
        </p>
      )}
    </section>
  );
}
