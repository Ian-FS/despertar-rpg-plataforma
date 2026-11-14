/* Ameaças (capítulo 13): números por nível e categoria, bestiário e gerador de encontros.
   statsAmeaca é o porte de statsAmeaca do data.js (revisão 2: ataque e Reação somam 2 × o Bônus
   de Rank da faixa de nível, e o Chefe tem 50 + 35 × nível PV). */
import { BESTIARIO, ENCONTROS } from './dados';
import type { CategoriaAmeaca, Monstro } from './tipos';

export const CATEGORIAS_AMEACA: CategoriaAmeaca[] = ['Lacaio', 'Soldado', 'Elite', 'Chefe'];
export type Dificuldade = keyof typeof ENCONTROS;
export const DIFICULDADES = Object.keys(ENCONTROS) as Dificuldade[];

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

/** Bônus de Rank da faixa de nível (como os itens dos Jogadores). */
export const bonusRankAmeaca = (L: number) => (L < 5 ? 0 : L < 10 ? 1 : L < 15 ? 2 : L < 20 ? 3 : L < 25 ? 4 : 6);

export function statsAmeaca(L: number, cat: CategoriaAmeaca): StatsAmeaca {
  const meio = Math.floor(L / 2);
  const br = bonusRankAmeaca(L);
  const atk = L + 2 + meio + 2 * br;
  const reac = L + 1 + meio + 2 * br;
  const cd = 10 + L + Math.floor(L / 3);
  const res = L + meio;
  const porCategoria = {
    Lacaio: { pv: 4 + 2 * L, dano: `1d6+${L}`, acoes: 1, rd: 0 },
    Soldado: { pv: 10 + 6 * L, dano: `1d8+${L + meio}`, acoes: 1 + Math.floor(L / 10), rd: 0 },
    Elite: { pv: 20 + 12 * L, dano: `2d8+${L + meio}`, acoes: 1 + Math.floor(L / 7), rd: Math.floor(L / 5) },
    Chefe: { pv: 50 + 35 * L, dano: `3d8+${2 * L}`, acoes: 2 + Math.floor(L / 6), rd: Math.floor(L / 4) },
  }[cat];
  return { atk, reac, defFixa: 10 + reac, cd, res, ...porCategoria };
}

/**
 * Bônus de iniciativa de uma ameaça. O livro não dá um (monstros não têm AGI): a plataforma usa
 * metade do nível, e o Mestre pode mudar na hora de montar o combate.
 */
export const iniAmeaca = (L: number) => Math.floor(L / 2);

export const nivelValido = (L: number) => Math.min(30, Math.max(1, Math.trunc(Number(L) || 1)));

export const monstro = (nome: string): Monstro | undefined => BESTIARIO.find((m) => m.n === nome);

export interface GrupoEncontro {
  cat: CategoriaAmeaca;
  nivel: number;
  qtd: number;
}

/**
 * Encontro para o grupo (tabela ENCONTROS do livro, feita para 4 Jogadores de nível N).
 * "Para cada Jogador a mais ou a menos, ajuste 1 inimigo": o ajuste vai no grupo mais numeroso.
 */
export function gerarEncontro(dif: Dificuldade, nivelGrupo: number, jogadores = 4): GrupoEncontro[] {
  const N = nivelValido(nivelGrupo);
  const grupos = ENCONTROS[dif].map((e) => ({ cat: e.cat, nivel: nivelValido(N + e.deltaNivel), qtd: e.qtd }));
  const maior = grupos.reduce((a, b) => (b.qtd > a.qtd ? b : a), grupos[0]);
  maior.qtd = Math.max(1, maior.qtd + (Math.max(1, Math.trunc(jogadores)) - 4));
  return grupos;
}
