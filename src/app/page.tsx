import { Suspense } from 'react';
import { connection } from 'next/server';
import { computarFicha } from '@/regras/ficha';
import { novoPersonagem } from '@/regras/personagem';

/* Página provisória: mostra o motor de regras calculando a ficha da Rafa (exemplo do livro).
   Será substituída pela lista de mesas quando o login estiver pronto. */

async function FichaExemplo() {
  await connection(); // calcula a cada acesso (o personagem de exemplo gera ids aleatórios)
  const p = novoPersonagem('Adaga');
  p.atr = { FOR: 15, AGI: 21, VIT: 14, INT: 13, PER: 17, PRE: 12 };
  p.despertar = { id: 'd23', nv: 1 }; // Passo Espacial
  const f = computarFicha(p);
  const adaga = f.ataques.find((a) => a.nome === 'Adaga');
  const valores: [string, string][] = [
    ['PV', String(f.pvMax)],
    ['PM', String(f.pmMax)],
    ['Deslocamento', `${f.desl} m`],
    ['Iniciativa', `+${f.ini}`],
    ['Defender', `+${f.def}`],
    ['Esquivar', `+${f.esq}`],
    ['Ataque (Adaga)', `+${adaga?.atk}`],
    ['Dano (Adaga)', `${adaga?.dado}+${adaga?.bonus}`],
  ];
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {valores.map(([k, v]) => (
        <div key={k} className="border border-sky-900 bg-slate-900/60 p-3">
          <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-slate-400">{k}</dt>
          <dd className="text-2xl font-bold text-sky-300">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Inicio() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-400">[ SISTEMA ] em construção</p>
      <h1 className="text-4xl font-bold">DESPERTAR</h1>
      <p className="text-slate-400">
        Plataforma de mesa para o RPG DESPERTAR. Abaixo, o motor de regras calculando a ficha da Rafa, o exemplo do
        livro.
      </p>
      <Suspense fallback={<p className="text-slate-500">Calculando…</p>}>
        <FichaExemplo />
      </Suspense>
    </main>
  );
}
