/* Sorteios e aplicações da criação de personagem (capítulo 3) e da subida de nível (capítulo 8).
   Funções puras: o sorteio é injetado (testes usam valores fixos; o servidor usa crypto). */
import { DESPERTARES, HABILIDADES, RARIDADE_DESPERTAR, DESP, HAB } from './dados';
import { possui, rankDoNivel } from './ficha';
import type { Personagem } from './personagem';
import type { Sorteio } from './rolagem';
import { ATRIBUTO_IDS, type AtributoId, type Despertar, type Habilidade, type Rank } from './tipos';

/* ---------------- Potencial e atributos (Passo 2) ---------------- */

export interface Potencial {
  n: 'Fraco' | 'Normal' | 'Forte';
  base: number;
  /** Pontos de Status de compensação */
  st: number;
  /** PH de compensação */
  ph: number;
}

export const POTENCIAIS: Potencial[] = [
  { n: 'Fraco', base: 6, st: 6, ph: 2 },
  { n: 'Normal', base: 8, st: 3, ph: 1 },
  { n: 'Forte', base: 10, st: 0, ph: 0 },
];

export const potencialDoD6 = (d6: number): Potencial => POTENCIAIS[d6 <= 2 ? 0 : d6 <= 4 ? 1 : 2];

export interface SorteioAtributos {
  d6: number;
  potencial: Potencial;
  /** os dois d6 de cada atributo, na ordem */
  rolagens: Record<AtributoId, [number, number]>;
  atr: Record<AtributoId, number>;
}

export function sortearAtributos(s: Sorteio): SorteioAtributos {
  const d6 = s(6);
  const potencial = potencialDoD6(d6);
  const rolagens = {} as Record<AtributoId, [number, number]>;
  const atr = {} as Record<AtributoId, number>;
  for (const a of ATRIBUTO_IDS) {
    rolagens[a] = [s(6), s(6)];
    atr[a] = potencial.base + rolagens[a][0] + rolagens[a][1];
  }
  return { d6, potencial, rolagens, atr };
}

/** Grava atributos e compensação do Potencial (substitui uma compensação anterior, se houver). */
export function aplicarAtributos(p: Personagem, atr: Record<AtributoId, number>, comp: { ph: number; st: number }, potencial: Personagem['potencial']) {
  p.atr = { ...atr };
  p.atrBase = { ...atr };
  p.potencial = potencial;
  p.statusPend = Math.max(0, p.statusPend - p.compPot.st) + comp.st;
  p.compPot = { ...comp };
}

/** Método Padrão (opcional): base 8 e distribuir 7, 7, 6, 6, 5 e 4, sem compensação. */
export const DISTRIBUICAO_PADRAO = [7, 7, 6, 6, 5, 4];

export function validarMetodoPadrao(bonus: Record<AtributoId, number>): boolean {
  const valores = ATRIBUTO_IDS.map((a) => Number(bonus[a])).sort((x, y) => y - x);
  return valores.every((v, i) => v === DISTRIBUICAO_PADRAO[i]);
}

export function atributosMetodoPadrao(bonus: Record<AtributoId, number>): Record<AtributoId, number> {
  return Object.fromEntries(ATRIBUTO_IDS.map((a) => [a, 8 + Number(bonus[a])])) as Record<AtributoId, number>;
}

/* ---------------- Despertar (Passo 3) ---------------- */

export const despertarDoD100 = (d: number): Despertar =>
  DESPERTARES.find((x) => d >= x.d[0] && d <= x.d[1]) ?? DESPERTARES[DESPERTARES.length - 1];

export function sortearDespertar(s: Sorteio): { d100: number; despertar: Despertar } {
  const d100 = s(100);
  return { d100, despertar: despertarDoD100(d100) };
}

/** Grava o Despertar e a compensação da raridade (substitui a anterior, se houver). */
export function aplicarDespertar(p: Personagem, despertarId: string) {
  const x = DESP[despertarId];
  if (!x) throw new Error(`Despertar desconhecido: ${despertarId}`);
  const r = RARIDADE_DESPERTAR[x.rar];
  p.despertar = { id: x.id, nv: 1 };
  p.statusPend = Math.max(0, p.statusPend - p.compDesp.st) + r.status;
  p.compDesp = { ph: r.ph, st: r.status };
}

/** Despertares que a Escolha Guiada permite escolher livremente: Comum ou Raro. */
export const despertaresEscolhaLivre = () => DESPERTARES.filter((x) => x.rar === 'Comum' || x.rar === 'Raro');

/* ---------------- Avaliação do Sistema (Passo 4 e a cada novo Rank) ---------------- */

/** Sorteia 3 habilidades distintas do Rank que o personagem ainda não tem. */
export function sortearAvaliacao(s: Sorteio, rank: Rank, p: Personagem): Habilidade[] {
  const pool = HABILIDADES.filter((h) => h.r === rank && !possui(p, h.id));
  const escolhidas: Habilidade[] = [];
  while (escolhidas.length < 3 && pool.length) escolhidas.push(pool.splice(s(pool.length) - 1, 1)[0]);
  return escolhidas;
}

/** Recebe de graça a habilidade escolhida na Avaliação (ignora requisitos de atributo e pré-requisito). */
export function aplicarAvaliacao(p: Personagem, habId: string) {
  if (!HAB[habId]) throw new Error(`Habilidade desconhecida: ${habId}`);
  if (!possui(p, habId)) p.habs.push({ id: habId, nv: 1, gratis: true });
}

/* ---------------- Subir de nível (capítulo 8) ---------------- */

/** 1d6 com a Bênção do Sistema: se sair 1, rola de novo uma vez e fica com o segundo. */
export function d6ComBencao(s: Sorteio): { rolagens: number[]; valor: number } {
  const r = s(6);
  if (r !== 1) return { rolagens: [r], valor: r };
  const r2 = s(6);
  return { rolagens: [1, r2], valor: r2 };
}

export interface SorteioNivel {
  novoNivel: number;
  status: { rolagens: number[]; valor: number };
  ph: { rolagens: number[]; valor: number };
  /** novo Rank liberado neste nível (5, 10, 15, 20, 25), se houver */
  novoRank: Rank | null;
  /** opções da Avaliação do Sistema do novo Rank */
  avaliacao: string[];
}

export const xpParaSubir = (nivel: number) => nivel * 10;

export function podeSubirNivel(p: Personagem, regras: { marcos?: boolean }): boolean {
  return regras.marcos ? true : p.xp >= xpParaSubir(p.nivel);
}

export function sortearSubidaNivel(s: Sorteio, p: Personagem): SorteioNivel {
  const novoNivel = p.nivel + 1;
  const status = d6ComBencao(s);
  const ph = d6ComBencao(s);
  const novoRank = rankDoNivel(novoNivel) !== rankDoNivel(p.nivel) ? rankDoNivel(novoNivel) : null;
  const avaliacao = novoRank ? sortearAvaliacao(s, novoRank, p).map((h) => h.id) : [];
  return { novoNivel, status, ph, novoRank, avaliacao };
}

/** Aplica a subida: nível, Pontos de Status, PH e consumo de XP. A Avaliação é escolhida depois. */
export function aplicarSubidaNivel(p: Personagem, r: SorteioNivel, regras: { marcos?: boolean }) {
  if (!regras.marcos) p.xp = Math.max(0, p.xp - xpParaSubir(p.nivel));
  p.nivel = r.novoNivel;
  p.statusPend += r.status.valor;
  p.phNiveis += r.ph.valor;
}

/** Na Provação de Ascensão (opcional), 19→20 e 29→30 exigem vencer uma Instância: só o Mestre libera. */
export const exigeProvacao = (nivel: number, regras: { provacao?: boolean }) =>
  !!regras.provacao && (nivel === 19 || nivel === 29);
