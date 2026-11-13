'use client';
/* Painel do Mestre: webhook do Discord da mesa (colar, testar, remover). A URL não é mostrada depois de salva. */
import { useState, useTransition } from 'react';
import { salvarDiscord, testarDiscord, type ResultadoDiscord } from './discord-acoes';

export function PainelDiscord({ mesaId, configurado }: { mesaId: string; configurado: boolean }) {
  const [ligado, setLigado] = useState(configurado);
  const [editando, setEditando] = useState(!configurado);
  const [url, setUrl] = useState('');
  const [aviso, setAviso] = useState<{ txt: string; erro: boolean } | null>(null);
  const [pendente, iniciar] = useTransition();

  const executar = (fn: () => Promise<ResultadoDiscord>, depois?: () => void) =>
    iniciar(async () => {
      const r = await fn();
      setAviso(r.erro ? { txt: r.erro, erro: true } : { txt: r.mensagem ?? 'Pronto.', erro: false });
      if (!r.erro) depois?.();
    });

  return (
    <section className="caixa flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="rotulo">Discord</h2>
        <span className={`font-mono text-xs ${ligado ? 'text-ok' : 'text-apagado'}`}>{ligado ? '● conectado' : '○ desligado'}</span>
      </div>
      <p className="text-sm text-apagado">
        As rolagens públicas (não as secretas) e os avisos de combate são enviados para um canal do Discord. No canal: Configurações → Integrações → Webhooks →
        Novo webhook → Copiar URL. Cole aqui; ninguém além do servidor vê essa URL.
      </p>

      {editando ? (
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            executar(() => salvarDiscord(mesaId, url), () => (setLigado(true), setEditando(false), setUrl('')));
          }}
        >
          <input
            type="password"
            autoComplete="off"
            className="campo min-w-0 flex-1"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/…"
            aria-label="URL do webhook do Discord"
          />
          <button className="botao" disabled={pendente || !url.trim()}>
            Salvar
          </button>
          {ligado && (
            <button type="button" className="botao botao-discreto" onClick={() => (setEditando(false), setUrl(''))}>
              Cancelar
            </button>
          )}
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button className="botao" disabled={pendente} onClick={() => executar(() => testarDiscord(mesaId))}>
            Enviar mensagem de teste
          </button>
          <button className="botao botao-discreto" onClick={() => setEditando(true)}>
            Trocar webhook
          </button>
          <button
            className="botao botao-discreto text-perigo"
            disabled={pendente}
            onClick={() => executar(() => salvarDiscord(mesaId, null), () => (setLigado(false), setEditando(true)))}
          >
            Desligar
          </button>
        </div>
      )}
      {aviso && <p className={`text-sm ${aviso.erro ? 'text-perigo' : 'text-ok'}`}>{aviso.txt}</p>}
    </section>
  );
}
