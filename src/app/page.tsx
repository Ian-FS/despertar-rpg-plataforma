import Link from 'next/link';

export default function Inicio() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-sys">[ SISTEMA ]</p>
      <h1 className="text-5xl font-bold">DESPERTAR</h1>
      <p className="max-w-prose text-lg text-apagado">
        Mesa virtual do RPG DESPERTAR: fichas com as contas feitas, dados para todos verem, combate e ferramentas do
        Mestre. A conversa fica no Discord.
      </p>
      <div>
        <Link href="/mesas" className="botao">
          Entrar
        </Link>
      </div>
      <p className="text-xs text-apagado">
        Obra de fã, sem fins lucrativos, inspirada em Solo Leveling. Regras de{' '}
        <a href="https://maickon.github.io/-SISTEMA-DESPERTAR/" className="underline hover:text-texto">
          DESPERTAR
        </a>
        .
      </p>
    </main>
  );
}
