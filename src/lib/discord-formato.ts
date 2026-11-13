/* Partes puras do envio ao Discord (sem servidor), para poderem ser testadas. */
import { d20Natural, ehCritico, type Rolagem } from '@/regras/rolagem';

/** Só aceita URLs de webhook do próprio Discord (evita o servidor postar em qualquer endereço). */
const WEBHOOK = /^https:\/\/(?:(?:ptb|canary)\.)?discord(?:app)?\.com\/api\/webhooks\/\d{5,30}\/[\w-]{20,200}$/;

export const webhookValido = (url: string) => WEBHOOK.test(url.trim());

/** "Ataque · Espada: **18** `1d20[13] +5` · crítico" */
export function linhaRolagem(rotulo: string, r: Rolagem, margemCritico = 20): string {
  const nat = d20Natural(r);
  const marca = ehCritico(r, margemCritico) ? (nat === 20 ? ' · **20 natural!**' : ` · crítico (${margemCritico}+)`) : nat === 1 ? ' · 1 natural' : '';
  // o rótulo pode vir do jogador: tira crases e quebras para não bagunçar a mensagem
  const limpo = rotulo.replace(/[`\n\r]/g, ' ').slice(0, 150);
  return `${limpo}: **${r.total}**  \`${r.texto.replace(/`/g, '')}\`${marca}`;
}
