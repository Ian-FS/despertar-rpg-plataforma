/* Envio de mensagens para o canal do Discord da mesa, pelo webhook que o Mestre cadastrou.
   Só roda no servidor: a URL do webhook nunca vai para o navegador.
   O envio acontece depois da resposta (after), então o Discord nunca atrasa uma rolagem;
   se falhar, só fica registrado no log. */
import 'server-only';
import { after } from 'next/server';
import { clienteAdmin } from '@/lib/supabase/admin';
export { linhaRolagem, webhookValido } from './discord-formato';

export interface MensagemDiscord {
  /** nome que aparece como autor (o personagem, "Mestre", "Sistema") */
  nome: string;
  texto: string;
}

export async function webhookDaMesa(mesaId: string): Promise<string | null> {
  const { data } = await clienteAdmin().from('mesas_segredos').select('discord_webhook').eq('mesa_id', mesaId).maybeSingle();
  return data?.discord_webhook ?? null;
}

/** Posta já (espera a resposta). Usado no "Enviar mensagem de teste". */
export async function postarAgora(url: string, m: MensagemDiscord): Promise<{ ok: boolean; status?: number }> {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: m.nome.slice(0, 80) || 'Sistema',
        content: m.texto.slice(0, 2000),
        // nada de @everyone, @here ou menções vindas de rótulos que o jogador digitou
        allowed_mentions: { parse: [] },
      }),
      signal: AbortSignal.timeout(5000),
    });
    return { ok: r.ok, status: r.status };
  } catch {
    return { ok: false };
  }
}

/** Agenda o envio para depois da resposta. Mesa sem webhook: não faz nada. */
export function enviarDiscord(mesaId: string, mensagens: MensagemDiscord[]) {
  if (!mensagens.length) return;
  after(async () => {
    const url = await webhookDaMesa(mesaId);
    if (!url) return;
    // em ordem, uma de cada vez (a ordem das iniciativas importa)
    for (const m of mensagens) {
      const r = await postarAgora(url, m);
      if (!r.ok) {
        console.error('[discord] falha ao enviar', r.status ?? 'sem resposta');
        return;
      }
    }
  });
}
