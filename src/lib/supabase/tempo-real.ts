/* Assinatura do Realtime no navegador. O Realtime só entrega linhas que a RLS deixa a pessoa ler,
   então o canal precisa entrar com o token do login. Sem isso ele entra como anônimo e não chega
   nenhum evento (sem erro nenhum). Por isso o token é passado antes de assinar. */
import type { RealtimeChannel } from '@supabase/supabase-js';
import { clienteNavegador } from './navegador';

export function assinar(
  nome: string,
  configurar: (canal: RealtimeChannel) => RealtimeChannel,
  aoMudarStatus?: (conectado: boolean) => void,
): () => void {
  const sb = clienteNavegador();
  let canal: RealtimeChannel | null = null;
  let ativo = true;
  (async () => {
    const { data } = await sb.auth.getSession();
    if (!ativo) return;
    await sb.realtime.setAuth(data.session?.access_token ?? null);
    if (!ativo) return;
    canal = configurar(sb.channel(nome)).subscribe((status) => aoMudarStatus?.(status === 'SUBSCRIBED'));
  })();
  return () => {
    ativo = false;
    if (canal) sb.removeChannel(canal);
  };
}
