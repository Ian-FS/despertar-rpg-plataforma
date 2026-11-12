'use client';
/* Bandeja de dados: clicar nos dados monta a fórmula (d6, d6 → 2d6; +1 → 2d6+1).
   Usada no registro da mesa e em todo campo que pede uma fórmula de dado. */
import { somarDado, somarFixo } from '@/regras/rolagem';

const FACES = [4, 6, 8, 10, 12, 20, 100];

export function BandejaDados({ valor, onChange }: { valor: string; onChange: (formula: string) => void }) {
  const botao = 'border border-linha bg-painel-2 px-1 py-1 font-mono text-xs hover:border-sys hover:text-sys';
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Montar a fórmula com dados">
      {FACES.map((n) => (
        <button key={n} type="button" className={`min-w-9 flex-1 ${botao}`} onClick={() => onChange(somarDado(valor, n))} title={`Somar 1d${n}`}>
          d{n}
        </button>
      ))}
      <button type="button" className={`px-2 ${botao}`} onClick={() => onChange(somarFixo(valor, -1))} title="Tirar 1 do modificador">
        −1
      </button>
      <button type="button" className={`px-2 ${botao}`} onClick={() => onChange(somarFixo(valor, 1))} title="Somar 1 ao modificador">
        +1
      </button>
      <button
        type="button"
        className="px-2 py-1 text-xs text-apagado hover:text-texto disabled:opacity-40"
        onClick={() => onChange('')}
        disabled={!valor}
      >
        Limpar
      </button>
    </div>
  );
}
