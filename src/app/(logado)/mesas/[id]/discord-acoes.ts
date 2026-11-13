'use server';
/* Webhook do Discord da mesa: só o Mestre cadastra, testa ou remove. A URL nunca volta ao navegador. */
import { revalidatePath } from 'next/cache';
import { ErroFicha, contextoMesa, exigir } from '@/lib/fichas/contexto';
import { postarAgora, webhookDaMesa, webhookValido } from '@/lib/discord';
import { clienteAdmin } from '@/lib/supabase/admin';

export interface ResultadoDiscord {
  erro?: string;
  mensagem?: string;
}

async function tentar(fn: () => Promise<ResultadoDiscord>): Promise<ResultadoDiscord> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ErroFicha) return { erro: e.message };
    throw e;
  }
}

/** Grava (ou remove, com null) o webhook da mesa. */
export async function salvarDiscord(mesaId: string, url: string | null): Promise<ResultadoDiscord> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    if (!ctx.souMestre) return { erro: 'Só o Mestre configura o Discord da mesa.' };
    const limpa = url === null ? null : String(url).trim();
    if (limpa !== null && !webhookValido(limpa))
      return { erro: 'Isso não parece uma URL de webhook do Discord (começa com https://discord.com/api/webhooks/).' };
    exigir(
      await clienteAdmin()
        .from('mesas_segredos')
        .upsert({ mesa_id: mesaId, discord_webhook: limpa, atualizado_em: new Date().toISOString() }),
      'Não foi possível salvar. Tente de novo.',
    );
    revalidatePath(`/mesas/${mesaId}`);
    return { mensagem: limpa ? 'Webhook salvo. As rolagens públicas vão para o canal.' : 'Discord desligado nesta mesa.' };
  });
}

/** Manda uma mensagem de teste para o canal. */
export async function testarDiscord(mesaId: string): Promise<ResultadoDiscord> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    if (!ctx.souMestre) return { erro: 'Só o Mestre configura o Discord da mesa.' };
    const url = await webhookDaMesa(mesaId);
    if (!url) return { erro: 'Nenhum webhook cadastrado nesta mesa.' };
    const r = await postarAgora(url, { nome: 'Sistema', texto: '✅ **[ SISTEMA ]** Mesa conectada. As rolagens públicas vão aparecer aqui.' });
    if (r.ok) return { mensagem: 'Mensagem de teste enviada. Confira o canal.' };
    if (r.status === 404 || r.status === 401) return { erro: 'O Discord recusou: o webhook foi apagado ou a URL está errada. Crie outro e cole de novo.' };
    if (r.status === 429) return { erro: 'O Discord pediu para esperar um pouco (muitas mensagens). Tente em instantes.' };
    return { erro: 'Não foi possível falar com o Discord agora. Tente de novo.' };
  });
}
