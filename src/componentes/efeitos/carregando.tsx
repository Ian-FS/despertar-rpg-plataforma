/* Indicador de carregamento no estilo do Sistema. Funciona sem JavaScript (só CSS). */

export function Carregando({ texto = 'Sincronizando com o Sistema' }: { texto?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="font-mono text-xs tracking-[0.3em] text-sys">[ SISTEMA ]</span>
      <span className="text-apagado">
        {texto}
        <span className="pontos-carregando" aria-hidden />
      </span>
      <span className="barra-carregando h-1 w-56 bg-linha" aria-hidden />
    </div>
  );
}

/** Tela inteira bloqueando a interface enquanto uma ação importante acontece. */
export function TelaCarregando({ texto }: { texto: string }) {
  return (
    <div className="sobreposicao fixed inset-0 z-50 grid place-items-center bg-[#03060f]/80 backdrop-blur-[2px]">
      <div className="janela-sistema janela-sys relative w-full max-w-sm p-6">
        <span className="linhas-varredura" aria-hidden />
        <Carregando texto={texto} />
      </div>
    </div>
  );
}
