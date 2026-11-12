/* Formas de uso dos Despertares (botão "Usar"), montadas a partir da tabela USOS_DESP do site
   (src/regras/dados/usos.ts, gerada pelo script de importação). Aqui só se dá um id estável a cada uso:
   os contadores "1× por combate" e os efeitos ativos guardados nas fichas usam esse id. */
import { DESP, USOS_DESP } from './dados';
import type { Personagem } from './personagem';
import { RANK_IDS, type Rank } from './tipos';

export { PAGA_PM_COM_PV } from './custo';

export interface UsoDespertar {
  id: string;
  nome: string;
  acao: string;
  /** ação a partir do Despertar nv5 (ex.: a cura vira Ação de Movimento) */
  acao5?: string;
  /** custo em PM (para "por Rank", é o custo do Rank E) */
  pm: number;
  /** custo a partir do Despertar nv5 */
  pm5?: number;
  /** nível do Despertar que libera o uso */
  nvMin: number;
  /** Forma Evoluída: exige Despertar nv5 e personagem nível 20 */
  forma?: boolean;
  freq?: string;
  /** custo = pm × Rank (E=1, D=2…) escolhido na hora (Sombras) */
  porRank?: boolean;
  /** texto do livro que descreve o uso (Forma, melhoria do nv3 ou nv5); vazio = o efeito do Despertar */
  desc: string;
}

/** Ids dos usos que não são Forma, na ordem do site. Mantêm os ids já gravados nas fichas. */
const IDS: Record<string, string[]> = {
  d01: ['rd'],
  d02: ['lamina'],
  d05: ['projetil'],
  d06: ['cura'],
  d07: ['barreira', 'parede'],
  d09: ['furia'],
  d10: ['gelo', 'gelo-solido'],
  d13: ['raio', 'teleporte'],
  d14: ['telecinese', 'parar-projeteis'],
  d15: ['fera'],
  d16: ['runa', 'runa-armadilha'],
  d17: ['medo'],
  d18: ['toxina', 'nuvem'],
  d19: ['clones', 'trocar'],
  d20: ['absorver'],
  d21: ['crescer'],
  d22: ['gravidade'],
  d23: ['teleporte', 'esquiva'],
  d24: ['luz'],
  d25: ['vento'],
  d26: ['forja'],
  d28: ['sangue'],
  d29: ['sopro'],
  d31: ['enxame'],
  d32: ['erguer', 'invocar', 'trocar'],
};

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const USOS_DESPERTAR: Record<string, UsoDespertar[]> = Object.fromEntries(
  Object.entries(USOS_DESP).map(([despId, lista]) => {
    let i = 0;
    const d = DESP[despId];
    return [
      despId,
      lista.map((u): UsoDespertar => {
        const id = u.forma ? 'forma' : (IDS[despId]?.[i++] ?? slug(u.n));
        const nvMin = u.desde ?? 1;
        return {
          id,
          nome: u.n,
          acao: u.acao,
          acao5: u.acao5,
          pm: u.pmRank ? 2 : (u.pm ?? 0),
          pm5: u.pm5,
          nvMin,
          forma: u.forma,
          freq: u.freq,
          porRank: u.pmRank,
          desc: u.forma ? (d?.forma ?? '') : nvMin >= 5 ? (d?.m5 ?? '') : nvMin >= 3 ? (d?.m3 ?? '') : '',
        };
      }),
    ];
  }),
);

export interface UsoDisponivel extends UsoDespertar {
  liberado: boolean;
  motivo?: string;
}

/** Usos do Despertar do personagem, marcando os que ele já pode usar. */
export function usosDoDespertar(p: Personagem): UsoDisponivel[] {
  const nv = p.despertar.nv;
  return (USOS_DESPERTAR[p.despertar.id] ?? []).map((x) => {
    const acao = nv >= 5 && x.acao5 ? x.acao5 : x.acao;
    if (x.forma && (nv < 5 || p.nivel < 20)) return { ...x, acao, liberado: false, motivo: 'Forma Evoluída: Despertar nível 5 e personagem nível 20' };
    if (nv < x.nvMin) return { ...x, acao, liberado: false, motivo: `Despertar nível ${x.nvMin}` };
    return { ...x, acao, liberado: true };
  });
}

/** Custo efetivo de um uso agora (custo do nv5 e a Forma do Herdeiro das Sombras). */
export function custoUso(p: Personagem, x: UsoDespertar, rank: Rank = 'E'): number {
  if (x.pm5 !== undefined && p.despertar.nv >= 5) return x.pm5;
  if (x.porRank) {
    const formaSombras = p.despertar.id === 'd32' && p.despertar.nv >= 5 && p.nivel >= 20;
    return formaSombras ? 0 : x.pm * (RANK_IDS.indexOf(rank) + 1);
  }
  return x.pm;
}
