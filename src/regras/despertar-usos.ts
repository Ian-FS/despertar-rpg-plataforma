/* Poderes ativos dos Despertares, com custo em PM (capítulo 10).
   Cadastrado à mão a partir do texto de cada Despertar: só entram usos com custo de PM. */
import type { Personagem } from './personagem';
import { RANK_IDS, type Rank } from './tipos';

export interface UsoDespertar {
  id: string;
  nome: string;
  acao: string;
  /** custo em PM (para "por Rank", é o custo do Rank E) */
  pm: number;
  /** nível do Despertar que libera o uso */
  nvMin: number;
  /** Forma Evoluída: exige Despertar nv5 e personagem nível 20 */
  forma?: boolean;
  freq?: string;
  /** a partir deste nível do Despertar, o uso não custa PM */
  semCustoNv?: number;
  /** custo = pm × Rank (E=1, D=2…) escolhido na hora (Sombras) */
  porRank?: boolean;
  desc: string;
}

const u = (id: string, nome: string, acao: string, pm: number, desc: string, extra: Partial<UsoDespertar> = {}): UsoDespertar => ({
  id,
  nome,
  acao,
  pm,
  nvMin: 1,
  desc,
  ...extra,
});

export const USOS_DESPERTAR: Record<string, UsoDespertar[]> = {
  d01: [
    u('rd', 'RD dobrada', 'Ação de Movimento', 2, 'Até o fim da rodada (1 minuto no nv5), RD dobrada.'),
    u('forma', 'Forma de Aço', 'Ação Livre', 15, 'Por 3 rodadas, imune a dano físico de criaturas de nível menor.', { forma: true, freq: '1×/combate' }),
  ],
  d02: [
    u('lamina', 'Lâmina de Mana', 'Ação Livre', 1, 'Sua arma causa +1d6 de dano de mana por nível até o fim do turno.', { semCustoNv: 5 }),
    u('forma', 'Lâmina Absoluta', 'Ação Principal', 10, 'A lâmina de mana se estende até 30 m em um corte.', { forma: true }),
  ],
  d05: [u('projetil', 'Projétil de fogo', 'Ação Principal', 2, 'Projétil de fogo 2d8 (+1d8 por nível) + mod INT, 18 m.')],
  d06: [u('cura', 'Toque Restaurador', 'Ação Principal (Movimento no nv5)', 2, 'Cura 1d8 (+1d8 por nível) + mod PRE; 9 m a partir do nv3.')],
  d07: [
    u('barreira', 'Barreira', 'Reação', 2, '+2 (+1 por nível) na Reação de Defender de você ou de um aliado a 9 m.'),
    u('forma', 'Domo', 'Ação Especial', 20, 'Domo de raio 9 m com 50 PV × nível do Despertar.', { forma: true }),
  ],
  d09: [u('furia', 'Entrar em Fúria', 'Ação Livre', 2, 'Por 1 minuto: +2 de dano corpo a corpo e RD 2 (+1 cada por nível), −2 em Esquivar.')],
  d10: [u('gelo', 'Toque Gélido', 'Ação Principal', 2, 'Alvo a 9 m: Resistência (VIT) ou Lento por 1 rodada e 2d6 (+1d6 por nível).')],
  d13: [
    u('raio', 'Raio', 'Ação Principal', 3, 'Raio em linha de 18 m, 2d10 (+1d10 por nível).'),
    u('teleporte', 'Passo do Trovão', 'Ação de Movimento', 3, 'Teleporte-se 9 m como um raio.', { nvMin: 3 }),
  ],
  d14: [u('telecinese', 'Telecinese', 'Ação Principal', 2, 'Mova objeto ou criatura de até 50 kg (×2 por nível) a 18 m; arremessar causa 2d6.')],
  d15: [u('fera', 'Forma bestial', 'Ação de Movimento', 4, 'Por 1 minuto: garras 1d8, +2 FOR e AGI (+2 por nível), +3 m de deslocamento.')],
  d17: [u('medo', 'Presença Opressora', 'Ação Livre', 3, 'Inimigo a 9 m (todos a partir do nv3): Resistência (PRE) ou Amedrontado por 1 rodada.')],
  d18: [u('toxina', 'Toxina', 'Ação Livre', 2, 'Seu próximo acerto deixa o alvo Envenenado (2d4, +1d4 por nível, por 3 rodadas).')],
  d19: [u('clones', 'Criar clones', 'Ação Principal', 4, 'Cria 1 clone (+1 por nível) com sua Defesa e seu ataque por 1 minuto.')],
  d20: [u('absorver', 'Absorver poder', 'Reação', 5, 'Absorva um poder que o atinja, anulando metade do dano.', { nvMin: 5 })],
  d21: [u('crescer', 'Crescer', 'Ação de Movimento', 6, 'Por 1 minuto: tamanho Grande, alcance 3 m, +4 de dano e +10 PV temporários (mais por nível).')],
  d22: [u('gravidade', 'Gravidade', 'Ação Principal', 4, 'Área de raio 3 m a 18 m: Resistência (FOR) ou Derrubado e Lento.')],
  d23: [
    u('teleporte', 'Teleporte', 'Ação de Movimento', 3, 'Teleporte-se até 9 m (+9 m por nível) para um ponto que possa ver.'),
    u('esquiva', 'Teleporte de esquiva', 'Reação', 6, 'Teleporte-se para evitar um ataque.', { nvMin: 5 }),
  ],
  d24: [u('luz', 'Luz Sagrada', 'Ação Principal', 4, 'Raio de luz: cura 2d8 em aliados ou causa 2d8 em monstros (+1d8 por nível), raio 6 m.')],
  d25: [u('vento', 'Lâmina de vento', 'Ação Principal', 3, 'Lâmina de vento a 18 m, 2d8 (+1d8 por nível), empurra 3 m.')],
  d26: [u('forja', 'Forjar arma', 'Ação Livre', 2, 'Crie qualquer arma ou escudo da tabela, do seu Rank, que dura 1 cena.')],
  d28: [u('sangue', 'Lâmina de sangue', 'Ação Principal', 3, 'Lâmina de sangue 2d10 (+1d10 por nível) a 9 m; o alvo fica Sangrando (2/turno).')],
  d29: [u('sopro', 'Sopro', 'Ação Principal', 6, 'Sopro em cone de 9 m, 4d10 (+2d10 por nível) de fogo negro.')],
  d31: [u('enxame', 'Invocar enxame', 'Ação Principal', 5, 'Invoca um enxame (Soldado do seu nível) que ocupa 3 m e ataca todos na área.')],
  d32: [
    u('erguer', 'Erguer Sombra', 'Ação Especial', 5, 'Até 1 minuto após a morte: teste de PRE contra CD 10 + nível da criatura.'),
    u('invocar', 'Invocar Sombra', 'Ação Principal', 2, 'Invoca uma Sombra guardada: 2 PM por Rank dela (E=1). Sem custo com a Forma Evoluída.', { porRank: true }),
  ],
};

/** Despertares que pagam PM com PV sem Exaustão (Hemomancia). */
export const PAGA_PM_COM_PV = new Set(['d28']);

export interface UsoDisponivel extends UsoDespertar {
  liberado: boolean;
  motivo?: string;
}

/** Usos do Despertar do personagem, marcando os que ele já pode usar. */
export function usosDoDespertar(p: Personagem): UsoDisponivel[] {
  const nv = p.despertar.nv;
  return (USOS_DESPERTAR[p.despertar.id] ?? []).map((x) => {
    if (x.forma && (nv < 5 || p.nivel < 20)) return { ...x, liberado: false, motivo: 'Forma Evoluída: Despertar nível 5 e personagem nível 20' };
    if (nv < x.nvMin) return { ...x, liberado: false, motivo: `Despertar nível ${x.nvMin}` };
    return { ...x, liberado: true };
  });
}

/** Custo efetivo de um uso agora (considera "sem custo" por nível e a Forma do Herdeiro das Sombras). */
export function custoUso(p: Personagem, x: UsoDespertar, rank: Rank = 'E'): number {
  if (x.semCustoNv && p.despertar.nv >= x.semCustoNv) return 0;
  if (x.porRank) {
    const formaSombras = p.despertar.id === 'd32' && p.despertar.nv >= 5 && p.nivel >= 20;
    return formaSombras ? 0 : x.pm * (RANK_IDS.indexOf(rank) + 1);
  }
  return x.pm;
}
