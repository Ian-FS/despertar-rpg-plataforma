/* Modelo do personagem: só as ESCOLHAS do jogador. Valores derivados vêm de computarFicha().
   Portado de novoPers / itemBase / armaComum / armaduraComum (app.js). */
import { ARMAS, ARMADURAS, RANKS } from './dados';
import type { AtributoId, Rank, RaridadeItem, TipoArmadura } from './tipos';

export type CategoriaItem = 'arma' | 'armadura' | 'escudo' | 'acessorio' | 'consumivel' | 'outro';

export interface AfixoItem {
  n: string;
  sufixo?: string;
  desc: string;
}

export interface SeloItem {
  n: string;
  desc: string;
}

export interface Item {
  uid: string;
  cat: CategoriaItem;
  nome: string;
  /** nome do item-base da tabela (ex.: "Espada") */
  base?: string;
  rank: Rank;
  rar: RaridadeItem;
  cor: string;
  linhas: string[];
  afixos: AfixoItem[];
  selos: SeloItem[];
  /** Sincronia */
  sinc: number;
  refino: number;
  /** X dos afixos = 1 + Bônus de Rank */
  X: number;
  equip: boolean;
  qtd?: number;
  preco?: number;
  // armas
  dano?: string;
  atr?: AtributoId;
  dist?: boolean;
  /** atributo exigido para o Bônus de Rank valer */
  reqAtr?: AtributoId | null;
  // armaduras
  armTipo?: TipoArmadura;
  // consumíveis
  usoDado?: string;
  usoAlvo?: 'pv' | 'pm';
}

export interface HabilidadeAdquirida {
  id: string;
  /** nível da habilidade (1 a 5) */
  nv: number;
  /** recebida de graça (Avaliação do Sistema, pergaminho…): não paga aquisição */
  gratis: boolean;
}

export type BonusManual = Record<'pv' | 'pm' | 'def' | 'esq' | 'atk' | 'dano' | 'rd' | 'desl' | 'ini', number>;

export interface Personagem {
  id: string;
  versao: 2;
  nome: string;
  jogador: string;
  conceito: string;
  motivo: string;
  nivel: number;
  xp: number;
  rankOficial: Rank;
  potencial: 'Fraco' | 'Normal' | 'Forte' | 'Padrão';
  ouro: number;
  /** valores atuais dos atributos (base + 2d6 + Pontos de Status já aplicados) */
  atr: Record<AtributoId, number>;
  /** Pontos de Status ainda não distribuídos */
  statusPend: number;
  /** compensação do Potencial */
  compPot: { ph: number; st: number };
  /** compensação da raridade do Despertar */
  compDesp: { ph: number; st: number };
  /** PH ganhos ao subir de nível */
  phNiveis: number;
  /** PH extras dados pelo Mestre */
  phExtra: number;
  /** grau de cada perícia, por nome */
  pericias: Record<string, number>;
  despertar: { id: string; nv: number };
  habs: HabilidadeAdquirida[];
  /** id do Título equipado */
  titulo: string;
  pvAtual: number | null;
  pmAtual: number | null;
  bonus: BonusManual;
  itens: Item[];
  condicoes: string;
  notas: string;
  criado: number;
}

const novoId = () => globalThis.crypto.randomUUID();

export function itemBase(cat: CategoriaItem, nome: string, extra: Partial<Item> = {}): Item {
  return {
    uid: novoId(),
    cat,
    nome,
    rank: 'E',
    rar: 'Comum',
    cor: '#9aa5b1',
    linhas: [],
    afixos: [],
    selos: [],
    sinc: 0,
    refino: 0,
    X: 1,
    equip: false,
    ...extra,
  };
}

export function armaComum(nomeBase: string, rank: Rank = 'E'): Item {
  const a = ARMAS.find((x) => x.n === nomeBase) ?? ARMAS[3];
  const br = RANKS[rank].br;
  return itemBase('arma', a.n, {
    base: a.n,
    dano: a.dano,
    atr: a.a,
    rank,
    X: 1 + br,
    dist: /distância/.test(a.tags),
    reqAtr: a.a,
    linhas: [`Dano ${a.dano} · Alcance ${a.alc} · ${a.a}${a.tags ? ' · ' + a.tags : ''}`],
  });
}

export function armaduraComum(tipo: TipoArmadura, rank: Rank = 'E'): Item {
  const a = ARMADURAS.find((x) => x.tipo === tipo) ?? ARMADURAS[0];
  const br = RANKS[rank].br;
  return itemBase('armadura', a.n, {
    base: a.n,
    armTipo: a.tipo,
    rank,
    X: 1 + br,
    reqAtr: a.tipo === 'Leve' ? null : 'FOR',
    linhas: [`Armadura ${a.tipo} · Defender +${a.def + br}${a.esq ? ' · Esquivar ' + a.esq : ''} · RD ${br}`],
  });
}

export function escudoComum(rank: Rank = 'E'): Item {
  const br = RANKS[rank].br;
  return itemBase('escudo', 'Escudo', {
    base: 'Escudo',
    rank,
    X: 1 + br,
    reqAtr: 'FOR',
    linhas: [`Escudo · Defender +${2 + br} · RD ${br}`],
  });
}

/** Personagem novo com o equipamento inicial padrão (arma à escolha, Traje de Combate, 2 Poções de Cura E, 100 Ouro). */
export function novoPersonagem(armaInicial = 'Espada'): Personagem {
  const arma = armaComum(armaInicial);
  arma.equip = true;
  const traje = armaduraComum('Leve');
  traje.equip = true;
  const pocao = itemBase('consumivel', 'Poção de Cura (Rank E)', {
    qtd: 2,
    linhas: ['Recupera 2d8 PV.'],
    usoDado: '2d8',
    usoAlvo: 'pv',
  });
  return {
    id: novoId(),
    versao: 2,
    nome: 'Novo Caçador',
    jogador: '',
    conceito: '',
    motivo: '',
    nivel: 1,
    xp: 0,
    rankOficial: 'E',
    potencial: 'Normal',
    ouro: 100,
    atr: { FOR: 10, AGI: 10, VIT: 10, INT: 10, PER: 10, PRE: 10 },
    statusPend: 0,
    compPot: { ph: 0, st: 0 },
    compDesp: { ph: 0, st: 0 },
    phNiveis: 0,
    phExtra: 0,
    pericias: {},
    despertar: { id: '', nv: 1 },
    habs: [],
    titulo: '',
    pvAtual: null,
    pmAtual: null,
    bonus: { pv: 0, pm: 0, def: 0, esq: 0, atk: 0, dano: 0, rd: 0, desl: 0, ini: 0 },
    itens: [arma, traje, pocao],
    condicoes: '',
    notas: '',
    criado: Date.now(),
  };
}
