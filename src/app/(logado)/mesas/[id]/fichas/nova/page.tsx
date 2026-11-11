import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { FormNovaFicha } from './form';

export const metadata: Metadata = { title: 'Novo personagem · DESPERTAR' };

export default function NovaFicha({ params }: PageProps<'/mesas/[id]/fichas/nova'>) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <Suspense fallback={null}>
        <Conteudo params={params} />
      </Suspense>
    </main>
  );
}

async function Conteudo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Link href={`/mesas/${id}`} className="text-sm text-apagado hover:text-texto">
        ← Voltar à mesa
      </Link>
      <div className="flex flex-col gap-2">
        <span className="rotulo">Passo 1 de 4 · Quem você era</span>
        <h1 className="text-3xl font-bold">Novo Caçador</h1>
        <p className="text-apagado">
          Antes de despertar, você era uma pessoa comum. O Motivo não tem efeito nas regras, mas o Mestre vai usá-lo.
        </p>
      </div>
      <FormNovaFicha mesaId={id} />
    </>
  );
}
