/* Tipos do domínio DESPERTAR. Os dados em src/regras/dados/ seguem estes tipos. */

export const ATRIBUTO_IDS = ['FOR', 'AGI', 'VIT', 'INT', 'PER', 'PRE'] as const;
export type AtributoId = (typeof ATRIBUTO_IDS)[number];

export const RANK_IDS = ['E', 'D', 'C', 'B', 'A', 'S'] as const;
export type Rank = (typeof RANK_IDS)[number];

export type ArvoreId =
  | 'lamina'
  | 'punho'
  | 'vulto'
  | 'disparo'
  | 'bastiao'
  | 'elementos'
  | 'restauracao'
  | 'dominio'
  | 'sentidos'
  | 'aura';

export type RaridadeDespertar = 'Comum' | 'Raro' | 'Épico' | 'Lendário' | 'Anomalia';
export type RaridadeItem = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Relíquia';
export type CategoriaAmeaca = 'Lacaio' | 'Soldado' | 'Elite' | 'Chefe';
export type TipoArmadura = 'Leve' | 'Média' | 'Pesada';

export interface Atributo {
  id: AtributoId;
  nome: string;
  desc: string;
}

export interface Pericia {
  /** nome da perícia */
  n: string;
  /** atributo padrão */
  a: AtributoId;
}

export interface InfoRank {
  nome: string;
  /** nível de personagem mínimo para habilidades deste Rank */
  nivel: number;
  /** valor mínimo de atributo para habilidades deste Rank */
  attr: number;
  /** custo de aquisição em PH */
  custo: number;
  /** Bônus de Rank dos itens */
  br: number;
  cor: string;
}

export interface Arvore {
  id: ArvoreId;
  nome: string;
  /** atributos principais, ex.: "FOR/AGI" */
  atr: string;
  cor: string;
  icone: string;
  desc: string;
}

export interface Habilidade {
  id: string;
  /** árvore */
  t: ArvoreId;
  /** Rank */
  r: Rank;
  /** nome */
  n: string;
  tipo: 'Passiva' | 'Ativa';
  acao: string;
  /** custo de uso em PM */
  pm: number;
  /** atributo de requisito; "A/B" = qualquer um dos dois */
  attr: string;
  /** pré-requisitos: [id da habilidade, nível mínimo] */
  pre: [string, number][];
  /** true = basta um dos pré-requisitos */
  preAny?: boolean;
  alc: string;
  dur: string;
  freq?: string;
  /** efeito no nível 1 */
  ef: string;
  /** ganho por nível acima do 1º */
  esc: string;
  m3: string;
  m5: string;
}

export interface InfoRaridadeDespertar {
  cor: string;
  /** PH extras na criação */
  ph: number;
  /** Pontos de Status extras na criação */
  status: number;
  txt: string;
}

export interface Despertar {
  id: string;
  /** faixa no d100 */
  d: [number, number];
  n: string;
  rar: RaridadeDespertar;
  /** árvores afins (custo de aquisição −1, mínimo 1) */
  afin: ArvoreId[];
  desc: string;
  ef: string;
  esc: string;
  m3: string;
  m5: string;
  forma: string;
}

/** Forma de uso de um Despertar, como o site publica (USOS_DESP). */
export interface UsoDespertarSite {
  n: string;
  acao: string;
  /** custo em PM */
  pm?: number;
  /** custo a partir do Despertar nv5 */
  pm5?: number;
  /** ação a partir do Despertar nv5 */
  acao5?: string;
  /** custo = 2 PM por Rank (Sombras) */
  pmRank?: boolean;
  freq?: string;
  /** nível do Despertar que libera */
  desde?: number;
  forma?: boolean;
}

/** Uso alternativo de uma habilidade (USOS_HAB), ex.: "primeiro da rodada custa 0 PM". */
export interface UsoHabilidadeSite {
  n: string;
  pm: number;
  /** nível da habilidade que libera */
  desde: number;
  /** substitui o uso normal (em vez de ser mais uma opção) */
  substitui?: boolean;
}

export interface Descritivo {
  n: string;
  desc: string;
}

export interface Arma {
  n: string;
  dano: string;
  alc: string;
  a: AtributoId;
  tags: string;
}

export interface Armadura {
  n: string;
  tipo: TipoArmadura;
  def: number;
  esq: number;
}

export interface InfoRaridadeItem {
  n: RaridadeItem;
  /** faixa no d100 (com bônus) */
  min: number;
  max: number;
  /** número de afixos */
  afx: number;
  /** número de Selos ocultos */
  selos: number;
  cor: string;
  /** multiplicador de preço */
  mult: number;
}

export interface Afixo {
  /** forma prefixo, ex.: "Afiada" */
  n: string;
  /** forma sufixo, ex.: "da Precisão" */
  sufixo: string;
  desc: string;
}

export interface PortalTipo {
  /** limite superior no d20 */
  max: number;
  n: string;
  d: string;
  /** multiplicador de XP */
  xp: number;
  /** bônus na rolagem de raridade */
  raridade: number;
}

export interface Monstro {
  n: string;
  r: Rank;
  /** nível */
  L: number;
  cat: CategoriaAmeaca;
  /** traços */
  tr: string;
}

export interface Encontro {
  cat: CategoriaAmeaca;
  /** nível relativo ao grupo (N + delta) */
  deltaNivel: number;
  qtd: number;
}

/**
 * Bônus que habilidades, Despertares, Títulos e afixos somam na ficha.
 * Chaves: atributos · pv pm · def esq · atk atkCaC atkDist · dano danoCaC danoDist
 * · rd desl ini · res (todas) · res.<ATR> · cd · per.<Perícia> · semPenEsq.
 */
export type ChaveBonus =
  | AtributoId
  | 'pv'
  | 'pm'
  | 'def'
  | 'esq'
  | 'atk'
  | 'atkCaC'
  | 'atkDist'
  | 'dano'
  | 'danoCaC'
  | 'danoDist'
  | 'rd'
  | 'desl'
  | 'ini'
  | 'res'
  | `res.${AtributoId}`
  | 'cd'
  | `per.${string}`
  | 'semPenEsq'
  /** RD que só vale contra dano físico */
  | 'rdFisico'
  /** bônus de Percepção que só vale para a visão */
  | 'percepcaoVisual'
  /** ataque desarmado recebe o Bônus de Rank do personagem (Punhos de Ferro) */
  | 'brDesarmado'
  /** quantidade de d4 extras no dano à distância (Arqueiro Nato) */
  | 'd4Dist';

export type Bonus = Partial<Record<ChaveBonus, number>> & {
  /** dado do ataque desarmado (substitui, não soma) */
  desarmado?: string;
};

export interface Titulo {
  id: string;
  n: string;
  cond: string;
  txt: string;
  ef: Bonus;
}
