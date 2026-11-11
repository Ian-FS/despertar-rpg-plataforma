/* Estatísticas de ameaças por nível e categoria (capítulo 13). Portado de statsAmeaca (data.js). */
import type { CategoriaAmeaca } from './tipos';

export interface StatsAmeaca {
  atk: number;
  reac: number;
  /** Defesa Fixa = 10 + Reação (usada por Lacaios) */
  defFixa: number;
  cd: number;
  res: number;
  pv: number;
  dano: string;
  acoes: number;
  rd: number;
}

export function statsAmeaca(L: number, cat: CategoriaAmeaca): StatsAmeaca {
  const meio = Math.floor(L / 2);
  const atk = L + 2 + meio;
  const reac = L + 1 + meio;
  const cd = 10 + L + Math.floor(L / 3);
  const res = L + meio;
  const porCategoria = {
    Lacaio: { pv: 4 + 2 * L, dano: `1d6+${L}`, acoes: 1, rd: 0 },
    Soldado: { pv: 10 + 6 * L, dano: `1d8+${L + meio}`, acoes: 1 + Math.floor(L / 10), rd: 0 },
    Elite: { pv: 20 + 12 * L, dano: `2d8+${L + meio}`, acoes: 1 + Math.floor(L / 7), rd: Math.floor(L / 5) },
    Chefe: { pv: 50 + 25 * L, dano: `3d8+${2 * L}`, acoes: 2 + Math.floor(L / 6), rd: Math.floor(L / 4) },
  }[cat];
  return { atk, reac, defFixa: 10 + reac, cd, res, ...porCategoria };
}
