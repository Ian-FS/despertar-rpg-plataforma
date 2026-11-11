import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BotaoGoogle } from './botao-google';

export const metadata: Metadata = { title: 'Entrar · DESPERTAR' };

export default function Entrar() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div className="janela flex flex-col gap-5 p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ NOTIFICAÇÃO ]</p>
        <h1 className="text-3xl font-bold">Você foi escolhido como Jogador.</h1>
        <p className="text-apagado">Entre com sua conta Google para acessar as mesas do grupo.</p>
        <Suspense fallback={<span className="botao opacity-50">Entrar com Google</span>}>
          <BotaoGoogle />
        </Suspense>
      </div>
    </main>
  );
}
