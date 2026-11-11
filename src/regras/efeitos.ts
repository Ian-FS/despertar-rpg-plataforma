/* Efeitos automáticos na ficha. Só entram efeitos permanentes e sem condição.
   Portado de EFEITOS_HAB / EFEITOS_DESP (data.js) e EF_AFIXO / ELEM (app.js). */
import type { Bonus } from './tipos';

type EfeitoNivel = (nv: number, ctx: { nivel: number }) => Bonus;

export const EFEITOS_HAB: Record<string, EfeitoNivel> = {
  lam1: (nv) => ({ atkCaC: nv }), // Domínio de Armas
  // Punhos de Ferro: o desarmado conta como arma do seu Rank (recebe o Bônus de Rank)
  pun1: (nv) => ({ desarmado: ['1d6', '1d8', '1d10', '2d6', '2d8'][nv - 1], brDesarmado: 1 }),
  vul1: (nv) => ({ 'per.Furtividade': 2 * nv }), // Passos Silenciosos
  dis1: (nv) => ({ atkDist: nv }), // Mira Firme
  dis4: (nv) => ({ percepcaoVisual: 2 * nv }), // Olho de Falcão: só Percepção visual
  // Pele Resistente: RD só contra dano físico; a partir do nível 3 vale também contra elemental
  bas1: (nv) => ({ ...(nv >= 3 ? { rd: nv } : { rdFisico: nv }), pv: nv >= 5 ? 10 : 0 }),
  bas6: (nv, { nivel }) => ({ pv: nv * nivel }), // Fortaleza Viva
  sen3: (nv) => ({ ini: 2 * nv }), // Instinto de Perigo
  pun7: (nv) => ({ rd: 4 + 2 * (nv - 1) }), // Corpo Inquebrável
  aur2: (nv) => ({ pm: 5 * nv }), // Circulação de Mana
  aur5: (nv) => ({ pv: 5 * nv, pm: 5 * nv, res: nv }), // Corpo de Mana
};

export const EFEITOS_DESP: Record<string, EfeitoNivel> = {
  d01: (nv) => ({ rd: 2 + (nv - 1) }), // Corpo Endurecido
  d03: (nv) => ({ 'per.Percepção': 2 + (nv - 1), 'per.Sentir Mana': 2 + (nv - 1) }), // Olhos de Caçador
  d04: (nv) => ({ desl: 3 + 1.5 * (nv - 1), ini: 2 + (nv - 1) }), // Passos Velozes
  // Arqueiro Nato: +1 ataque à distância por nível; +1d4 de dano à distância, +1d4 nos níveis 3 e 5
  d08: (nv) => ({ atkDist: nv, d4Dist: 1 + (nv >= 3 ? 1 : 0) + (nv >= 5 ? 1 : 0) }),
  d17: (nv) => ({ 'per.Intimidação': 2 + (nv - 1) }), // Presença Opressora
  d29: () => ({ rd: 3 }), // Coração de Dragão
};

/** Afixos com efeito fixo na ficha. X = 1 + Bônus de Rank do item. */
export const EFEITOS_AFIXO: Record<string, (X: number) => Bonus> = {
  Veloz: (X) => ({ ini: X, desl: 1.5 }),
  Robusta: (X) => ({ def: X }),
  Esguia: (X) => ({ esq: X, semPenEsq: 1 }),
  Vital: (X) => ({ pv: 5 * X }),
  Arcana: (X) => ({ pm: 5 * X }),
  Firme: (X) => ({ 'res.FOR': X, 'res.VIT': X }),
  Sombria: (X) => ({ 'per.Furtividade': 2 * X }),
  Forte: (X) => ({ FOR: 2 * X }),
  Ágil: (X) => ({ AGI: 2 * X }),
  Vigoroso: (X) => ({ VIT: 2 * X }),
  Sábio: (X) => ({ INT: 2 * X }),
  Atento: (X) => ({ PER: 2 * X }),
  Imponente: (X) => ({ PRE: 2 * X }),
  Focado: (X) => ({ cd: X }),
  Profundo: (X) => ({ pm: 5 * X }),
  Resiliente: (X) => ({ pv: 5 * X }),
  Ligeiro: (X) => ({ desl: X }),
};

/** Afixos de arma que somam dano elemental (+Xd4). */
export const AFIXO_ELEMENTO: Record<string, string> = {
  Flamejante: 'fogo',
  Gélida: 'gelo',
  Trovejante: 'raio',
};
