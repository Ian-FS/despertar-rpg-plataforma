'use client';

import { TIT } from '@/regras/dados';
import type { Personagem } from '@/regras/personagem';
import type { PropsAba } from './ficha-editor';

type CampoTexto = 'idade' | 'ocupacao' | 'motivo' | 'conceito' | 'notas';

export function AbaNotas({ p, alterar, podeEditar }: PropsAba) {
  const texto = (campo: CampoTexto, rotulo: string, longo = false) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={`n-${campo}`} className="text-sm font-semibold">
        {rotulo}
      </label>
      {longo ? (
        <textarea
          id={`n-${campo}`}
          className="campo min-h-28"
          value={p[campo]}
          disabled={!podeEditar}
          onChange={(e) => alterar((r: Personagem) => void (r[campo] = e.target.value))}
        />
      ) : (
        <input id={`n-${campo}`} className="campo" value={p[campo]} disabled={!podeEditar} onChange={(e) => alterar((r: Personagem) => void (r[campo] = e.target.value))} />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <section className="caixa flex flex-col gap-3 p-4">
        <h2 className="rotulo">Título equipado</h2>
        {p.titulosObtidos.length ? (
          <>
            <select
              id="titulo"
              aria-label="Título equipado"
              className="campo"
              value={p.titulo}
              disabled={!podeEditar}
              onChange={(e) => alterar((r) => void (r.titulo = e.target.value))}
            >
              <option value="">Nenhum</option>
              {p.titulosObtidos.map((id) => (
                <option key={id} value={id}>
                  {TIT[id]?.n} · {TIT[id]?.txt}
                </option>
              ))}
            </select>
            <p className="text-xs text-apagado">Só um equipado por vez, e só se troca fora de combate.</p>
          </>
        ) : (
          <p className="text-sm text-apagado">Nenhum Título conquistado ainda. O Mestre concede quando você cumprir um feito.</p>
        )}
      </section>
      <section className="caixa flex flex-col gap-3 p-4">
        <h2 className="rotulo">Quem você era</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {texto('idade', 'Idade')}
          {texto('ocupacao', 'Ocupação')}
        </div>
        {texto('motivo', 'Motivo', true)}
        {texto('conceito', 'Aparência e personalidade', true)}
      </section>
      <section className="caixa flex flex-col gap-3 p-4">{texto('notas', 'Anotações', true)}</section>
    </div>
  );
}
