/* Loja do Sistema (capítulo 8): vende consumíveis e itens Comuns e Incomuns até o Rank do
   Jogador, pelos preços de Equipamentos, e compra itens por metade do preço. */
import { ACESSORIOS, AFIXOS, ARMADURAS, ARMAS, CONSUMIVEIS, PRECO_BASE, RANKS, RARIDADES } from './dados';
import { rankDoNivel } from './ficha';
import { armaComum, armaduraComum, escudoComum, itemBase, type CategoriaItem, type Item, type Personagem } from './personagem';
import { sortearCrypto, type Sorteio } from './rolagem';
import { RANK_IDS, type Rank, type RaridadeItem, type TipoArmadura } from './tipos';

export const LIMITE_INVENTARIO = 20;

/** Consumíveis que a Loja vende (Pergaminhos de Habilidade, Elixires, Núcleos e Chaves só em Portais). */
export const CONSUMIVEIS_LOJA = CONSUMIVEIS.filter(
  (c) => !['Pergaminho de Habilidade', 'Elixir de Despertar', 'Núcleo de Chefe', 'Chave de Instância'].includes(c.n),
);

export type CategoriaLoja = Exclude<CategoriaItem, 'outro'>;

export interface Pedido {
  cat: CategoriaLoja;
  /** arma: nome; armadura: tipo; acessório: tipo; consumível: nome; escudo: "Escudo" */
  base: string;
  rank: Rank;
  rar: Extract<RaridadeItem, 'Comum' | 'Incomum'>;
  afixos?: string[];
  qtd?: number;
}

const mult = (r: RaridadeItem) => RARIDADES.find((x) => x.n === r)?.mult ?? 1;

/** Preço de um item (ou de uma unidade de consumível). */
export function precoItem(it: Pick<Item, 'cat' | 'rank' | 'rar'>): number {
  const base = PRECO_BASE[it.rank] ?? PRECO_BASE.E;
  if (it.cat === 'consumivel') return Math.floor(base / 5);
  return base * mult(it.rar);
}

/** A Loja compra por metade do preço. */
export const precoVenda = (it: Item) => Math.floor(precoItem(it) / 2);

/** Quantos afixos o item precisa ter (acessórios recebem 1 a mais). */
export function afixosNecessarios(cat: CategoriaLoja, rar: RaridadeItem): number {
  if (cat === 'consumivel') return 0;
  const n = RARIDADES.find((x) => x.n === rar)?.afx ?? 0;
  return cat === 'acessorio' ? n + 1 : n;
}

export const categoriaAfixo = (cat: CategoriaItem) =>
  cat === 'arma' ? 'arma' : cat === 'armadura' || cat === 'escudo' ? 'armadura' : cat === 'acessorio' ? 'acessorio' : null;

/** Texto do afixo com o X já calculado: "+2X de dano" com X=2 vira "+4 de dano". */
export function textoAfixo(desc: string, X: number): string {
  return desc.replace(/(\d*)X(d\d+)?/g, (_, k: string, dado?: string) => `${(k ? Number(k) : 1) * X}${dado ?? ''}`);
}

/**
 * Sorteia os afixos do item na tabela do tipo dele, sem repetir (revisão 2: o item Incomum da Loja
 * vem com 1 afixo sorteado; acessórios têm 1 a mais).
 */
export function sortearAfixos(cat: CategoriaLoja, rar: RaridadeItem, sortear: Sorteio = sortearCrypto): string[] {
  const c = categoriaAfixo(cat);
  if (!c) return [];
  const restantes = AFIXOS[c].map((a) => a.n);
  const r: string[] = [];
  for (let i = 0; i < afixosNecessarios(cat, rar) && restantes.length; i++) r.push(restantes.splice(sortear(restantes.length) - 1, 1)[0]);
  return r;
}

export const ranksDaLoja = (p: Personagem): Rank[] => RANK_IDS.slice(0, RANK_IDS.indexOf(rankDoNivel(p.nivel)) + 1);

export const precoPedido = (pd: Pedido) => precoItem({ cat: pd.cat, rank: pd.rank, rar: pd.rar }) * (pd.cat === 'consumivel' ? Math.max(1, pd.qtd ?? 1) : 1);

/** Confere o pedido. Devolve a mensagem de erro, ou null se puder comprar. */
export function validarPedido(p: Personagem, pd: Pedido): string | null {
  if (!ranksDaLoja(p).includes(pd.rank)) return `A Loja só vende até o seu Rank (${rankDoNivel(p.nivel)}).`;
  if (pd.rar !== 'Comum' && pd.rar !== 'Incomum') return 'A Loja só vende itens Comuns e Incomuns.';
  const okBase =
    (pd.cat === 'arma' && ARMAS.some((a) => a.n === pd.base)) ||
    (pd.cat === 'armadura' && ARMADURAS.some((a) => a.tipo === pd.base)) ||
    (pd.cat === 'escudo' && pd.base === 'Escudo') ||
    (pd.cat === 'acessorio' && ACESSORIOS.includes(pd.base)) ||
    (pd.cat === 'consumivel' && CONSUMIVEIS_LOJA.some((c) => c.n === pd.base));
  if (!okBase) return 'Item indisponível na Loja.';
  const cat = categoriaAfixo(pd.cat);
  // sem afixos no pedido = conferência da tela (o servidor sorteia e confere de novo na compra)
  const afixos = pd.afixos;
  if (afixos) {
    if (afixos.length !== afixosNecessarios(pd.cat, pd.rar)) return 'Os afixos do item são sorteados na compra.';
    if (new Set(afixos).size !== afixos.length) return 'Os afixos precisam ser diferentes.';
    if (cat && afixos.some((n) => !AFIXOS[cat].some((a) => a.n === n))) return 'Afixo inválido para este item.';
  }
  if (pd.cat === 'consumivel' && (!Number.isInteger(pd.qtd ?? 1) || (pd.qtd ?? 1) < 1 || (pd.qtd ?? 1) > 99)) return 'Quantidade inválida.';
  if (precoPedido(pd) > p.ouro) return `Ouro insuficiente: custa ${precoPedido(pd)} e você tem ${p.ouro}.`;
  const empilha = pd.cat === 'consumivel' && p.itens.some((i) => mesmoConsumivel(i, pd));
  if (!empilha && p.itens.length >= LIMITE_INVENTARIO) return `Inventário cheio (${LIMITE_INVENTARIO} itens).`;
  return null;
}

const nomeConsumivel = (base: string, rank: Rank) => `${base} (Rank ${rank})`;
const mesmoConsumivel = (i: Item, pd: Pedido) => i.cat === 'consumivel' && i.nome === nomeConsumivel(pd.base, pd.rank);

/** Monta o item comprado. */
export function montarItem(pd: Pedido): Item {
  const br = RANKS[pd.rank].br;
  const X = 1 + br;
  let it: Item;
  switch (pd.cat) {
    case 'arma':
      it = armaComum(pd.base, pd.rank);
      break;
    case 'armadura':
      it = armaduraComum(pd.base as TipoArmadura, pd.rank);
      break;
    case 'escudo':
      it = escudoComum(pd.rank);
      break;
    case 'acessorio':
      it = itemBase('acessorio', pd.base, { base: pd.base, rank: pd.rank, X });
      break;
    default: {
      const c = CONSUMIVEIS_LOJA.find((x) => x.n === pd.base)!;
      const usoDado = c.n === 'Poção de Cura' ? `${2 + 2 * br}d8` : c.n === 'Poção de Mana' ? `${2 + 2 * br}d6` : undefined;
      const usoAlvo = c.n === 'Poção de Cura' ? 'pv' : c.n === 'Poção de Mana' ? 'pm' : undefined;
      return itemBase('consumivel', nomeConsumivel(c.n, pd.rank), { rank: pd.rank, qtd: pd.qtd ?? 1, linhas: [c.desc], usoDado, usoAlvo });
    }
  }
  const cat = categoriaAfixo(pd.cat)!;
  it.rar = pd.rar;
  it.cor = RARIDADES.find((r) => r.n === pd.rar)!.cor;
  it.afixos = (pd.afixos ?? []).map((n) => {
    const a = AFIXOS[cat].find((x) => x.n === n)!;
    return { n: a.n, sufixo: a.sufixo, desc: textoAfixo(a.desc, X) };
  });
  if (it.afixos.length) it.nome = `${it.nome} ${it.afixos.map((a) => a.n).join(' ')}`.trim();
  return it;
}

/** Aplica a compra no personagem (empilha consumíveis iguais). */
export function aplicarCompra(p: Personagem, pd: Pedido): Item {
  p.ouro -= precoPedido(pd);
  if (pd.cat === 'consumivel') {
    const existente = p.itens.find((i) => mesmoConsumivel(i, pd));
    if (existente) {
      existente.qtd = (existente.qtd ?? 1) + (pd.qtd ?? 1);
      return existente;
    }
  }
  const it = montarItem(pd);
  p.itens.push(it);
  return it;
}

/** Aplica a venda de `qtd` unidades (itens não empilháveis: o item inteiro). Devolve o Ouro recebido. */
export function aplicarVenda(p: Personagem, uid: string, qtd = 1): number {
  const it = p.itens.find((i) => i.uid === uid);
  if (!it) throw new Error('Item não encontrado.');
  const n = it.cat === 'consumivel' ? Math.max(1, Math.min(qtd, it.qtd ?? 1)) : 1;
  const ganho = precoVenda(it) * n;
  if (it.cat === 'consumivel' && (it.qtd ?? 1) > n) it.qtd = (it.qtd ?? 1) - n;
  else p.itens = p.itens.filter((i) => i.uid !== uid);
  p.ouro += ganho;
  return ganho;
}
