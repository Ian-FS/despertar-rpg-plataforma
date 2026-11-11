import type { Metadata } from 'next';
import { Demonstracao } from './demonstracao';

export const metadata: Metadata = { title: 'Efeitos · DESPERTAR' };

/* Página de demonstração dos efeitos do Sistema (dados de exemplo, nada é gravado). */
export default function PaginaEfeitos() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <span className="rotulo">Demonstração</span>
        <h1 className="text-3xl font-bold">Efeitos do Sistema</h1>
        <p className="text-apagado">
          Exemplos com dados fictícios: nada aqui é gravado. Use os botões ⚡ (efeitos rápidos) e 🔊 (som) para ver as
          variações.
        </p>
      </div>
      <Demonstracao />
    </main>
  );
}
