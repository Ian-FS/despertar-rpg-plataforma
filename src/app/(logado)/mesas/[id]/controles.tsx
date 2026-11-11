'use client';

import { useState, useSyncExternalStore, useTransition } from 'react';
import { gerarNovoConvite, sairDaMesa } from '../../acoes';

const semInscricao = () => () => {};

export function PainelConvite({ mesaId, codigo }: { mesaId: string; codigo: string }) {
  // endereço do site (só existe no navegador; no servidor fica vazio e o link sai relativo)
  const origem = useSyncExternalStore(semInscricao, () => window.location.origin, () => '');
  const link = `${origem}/convite/${codigo}`;
  const [aviso, setAviso] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setAviso('Link copiado.');
    } catch {
      setAviso('Não deu para copiar automaticamente. Selecione o link e copie.');
    }
  }

  function trocar() {
    iniciar(async () => {
      const r = await gerarNovoConvite(mesaId);
      setAviso(r.erro ?? 'Link novo gerado. O anterior não funciona mais.');
    });
  }

  return (
    <section className="janela flex flex-col gap-3 p-4">
      <h2 className="rotulo text-sys">Convidar jogadores</h2>
      <p className="text-sm text-apagado">Mande este link para o grupo. Quem abrir e entrar com o Google vira Jogador.</p>
      <div className="flex flex-wrap gap-2">
        <input id="link-convite" readOnly value={link} className="campo flex-1 font-mono text-sm" onFocus={(e) => e.target.select()} aria-label="Link de convite" />
        <button type="button" className="botao" onClick={copiar}>
          Copiar
        </button>
        <button type="button" className="botao botao-discreto" onClick={trocar} disabled={pendente}>
          {pendente ? 'Gerando…' : 'Gerar link novo'}
        </button>
      </div>
      {aviso && (
        <p role="status" className="text-sm text-apagado">
          {aviso}
        </p>
      )}
    </section>
  );
}

export function BotaoSair({ mesaId }: { mesaId: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();

  if (!confirmando)
    return (
      <button type="button" className="botao botao-discreto self-start" onClick={() => setConfirmando(true)}>
        Sair desta mesa
      </button>
    );

  return (
    <div className="caixa flex flex-wrap items-center gap-3 p-4">
      <span className="text-sm">Sair da mesa? Para voltar, você vai precisar de um convite novo.</span>
      <button
        type="button"
        className="botao border-perigo bg-transparent text-perigo"
        disabled={pendente}
        onClick={() => iniciar(async () => setErro((await sairDaMesa(mesaId)).erro ?? null))}
      >
        Sair
      </button>
      <button type="button" className="botao botao-discreto" onClick={() => setConfirmando(false)}>
        Cancelar
      </button>
      {erro && <p className="w-full text-sm text-perigo">{erro}</p>}
    </div>
  );
}
