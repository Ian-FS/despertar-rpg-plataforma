/* Assinatura do Realtime no navegador. O Realtime só entrega linhas que a RLS deixa a pessoa ler,
   então o canal precisa entrar com o token do login. Sem isso ele entra como anônimo e não chega
   nenhum evento (sem erro nenhum). Por isso o token é passado antes de assinar.

   O Realtime não reenvia o que se perdeu enquanto a conexão caiu (aba em segundo plano, celular
   bloqueado, Wi-Fi oscilando). Por isso `sincronizar` é chamado sempre que o canal (re)conecta e
   quando a aba volta a ficar visível: quem assina relê o estado atual do banco. */
import type { RealtimeChannel } from '@supabase/supabase-js';
import { clienteNavegador } from './navegador';

export function assinar(
  nome: string,
  configurar: (canal: RealtimeChannel) => RealtimeChannel,
  opcoes: {
    aoMudarStatus?: (conectado: boolean) => void;
    /** relê o estado atual (ao conectar, ao reconectar e ao voltar para a aba) */
    sincronizar?: () => void;
  } = {},
): () => void {
  const sb = clienteNavegador();
  let canal: RealtimeChannel | null = null;
  let ativo = true;
  const aoVoltar = () => {
    if (document.visibilityState === 'visible') opcoes.sincronizar?.();
  };
  (async () => {
    const { data } = await sb.auth.getSession();
    if (!ativo) return;
    await sb.realtime.setAuth(data.session?.access_token ?? null);
    if (!ativo) return;
    // nome único: duas telas assinando a mesma coisa não podem dividir o canal
    canal = configurar(sb.channel(`${nome}:${Math.random().toString(36).slice(2, 8)}`)).subscribe((status) => {
      opcoes.aoMudarStatus?.(status === 'SUBSCRIBED');
      if (status === 'SUBSCRIBED') opcoes.sincronizar?.();
    });
  })();
  document.addEventListener('visibilitychange', aoVoltar);
  return () => {
    ativo = false;
    document.removeEventListener('visibilitychange', aoVoltar);
    if (canal) sb.removeChannel(canal);
  };
}
