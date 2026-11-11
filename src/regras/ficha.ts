/* Cálculo da ficha, Pontos de Habilidade e requisitos.
   Portado de computar / bolsa / brItem / phGasto / checarReq (app.js do site original). */
import { ARMADURAS, ATRIBUTOS, DESP, HAB, PERICIAS, RANKS, TIT } from './dados';
import { AFIXO_ELEMENTO, EFEITOS_AFIXO, EFEITOS_DESP, EFEITOS_HAB } from './efeitos';
import type { Item, Personagem } from './personagem';
import { RANK_IDS, type ArvoreId, type AtributoId, type Bonus, type Habilidade, type Rank } from './tipos';

/** Modificador = (atributo − 10) ÷ 2, para baixo. Sem limite. */
export const mod = (valor: number) => Math.floor((Number(valor) - 10) / 2);

/** Rank de habilidades liberado pelo nível do personagem (5/10/15/20/25). */
export function rankDoNivel(nivel: number): Rank {
  let r: Rank = 'E';
  for (const k of RANK_IDS) if (nivel >= RANKS[k].nivel) r = k;
  return r;
}

const nivelDe = (p: Personagem) => Math.max(1, Number(p.nivel) || 1);

export const equipados = (p: Personagem) => p.itens.filter((i) => i.equip);

/** Bônus de Rank efetivo do item. Sem o atributo exigido (10 + 4×BR), funciona como Rank E. Relíquias usam o Rank do portador. */
export function brItem(it: Item, p: Personagem): { br: number; rank: Rank; semReq: boolean } {
  const rank = it.rar === 'Relíquia' ? rankDoNivel(nivelDe(p)) : it.rank;
  const br = RANKS[rank]?.br ?? 0;
  if (br && it.reqAtr && Number(p.atr[it.reqAtr]) < 10 + 4 * br) return { br: 0, rank, semReq: true };
  return { br, rank, semReq: false };
}

/** Soma de todos os bônus automáticos: habilidades, Despertar, Título, afixos e bônus manuais. */
export function bolsa(p: Personagem): Bonus {
  const b: Bonus = {};
  const somar = (o: Bonus) => {
    for (const [k, v] of Object.entries(o)) {
      if (k === 'desarmado') {
        b.desarmado = v as string;
        continue;
      }
      const chave = k as keyof Omit<Bonus, 'desarmado'>;
      b[chave] = (b[chave] ?? 0) + Number(v || 0);
    }
  };
  const ctx = { nivel: nivelDe(p) };
  for (const x of p.habs) {
    const ef = EFEITOS_HAB[x.id];
    if (ef) somar(ef(x.nv, ctx));
  }
  const efDesp = EFEITOS_DESP[p.despertar.id];
  if (efDesp) somar(efDesp(p.despertar.nv, ctx));
  if (p.titulo && TIT[p.titulo]) somar(TIT[p.titulo].ef);
  for (const it of equipados(p)) {
    for (const a of it.afixos) {
      const ef = EFEITOS_AFIXO[a.n];
      if (ef) somar(ef(it.X || 1));
    }
  }
  somar({ ...p.bonus });
  return b;
}

export interface AtaqueCalculado {
  id: string;
  nome: string;
  /** bônus de ataque (1d20 + atk) */
  atk: number;
  /** dado da arma */
  dado: string;
  /** bônus de dano fixo somado ao dado */
  bonus: number;
  /** dano elemental extra dos afixos, ex.: "+2d4 fogo" */
  extra: string;
  dist?: boolean;
  /** menor resultado natural do d20 que é crítico (20 = só 20 natural; 19 = 19–20) */
  critico: number;
}

/** Margem de crítico de um ataque.
 *  "Margem 19–20" (Domínio de Armas, Katana +5, Arqueiro Nato nv5) define o ponto de partida;
 *  "margem +1" (Letal, Ponto Vital) amplia a partir dele, cumulativamente. */
function margemCritico(p: Personagem, it: Item | null, dist: boolean): number {
  let base = 20;
  const dominio = possui(p, ID.dominioDeArmas);
  if (it && !dist && dominio) base = Math.min(base, dominio.nv >= 5 ? 18 : dominio.nv >= 3 ? 19 : 20);
  if (it?.base === 'Katana' && Number(it.refino || 0) >= 5) base = Math.min(base, 19);
  if (dist && p.despertar.id === ID.arqueiroNato && p.despertar.nv >= 5) base = Math.min(base, 19);
  let amplia = 0;
  if (it?.afixos.some((a) => a.n === 'Letal')) amplia += ['A', 'S'].includes(brItem(it, p).rank) ? 2 : 1;
  if (possui(p, ID.pontoVital)) amplia += 1;
  return base - amplia;
}

/** Ids usados em regras especiais do cálculo. */
const ID = {
  dominioDeArmas: 'lam1',
  pontoVital: 'vul7',
  arqueiroNato: 'd08',
} as const;

export interface FichaCalculada {
  nivel: number;
  rank: Rank;
  /** atributos com bônus de itens/efeitos */
  atr: Record<AtributoId, number>;
  /** modificadores */
  m: Record<AtributoId, number>;
  bonus: Bonus;
  pvMax: number;
  pmMax: number;
  /** deslocamento em metros */
  desl: number;
  acoes: number;
  ini: number;
  /** bônus de Defender */
  def: number;
  /** bônus de Esquivar */
  esq: number;
  defPassiva: number;
  /** RD contra todo dano */
  rd: number;
  /** RD adicional que só vale contra dano físico (Pele Resistente abaixo do nível 3) */
  rdFisico: number;
  /** Percepção quando o teste é de visão (inclui Olho de Falcão) */
  perVisual: number;
  res: Record<AtributoId, number>;
  cd: Record<AtributoId, number>;
  /** bônus total de cada perícia */
  per: Record<string, number>;
  ataques: AtaqueCalculado[];
  xpProx: number;
  periciaMax: number;
  periciaTotal: number;
  /** condições ativas e o que elas mudaram */
  condicoes: string[];
  efeitosCondicoes: string[];
  /** penalidade nos testes de atributo (Amedrontado, Exausto) */
  penTeste: number;
  /** não pode usar Reações (Atordoado, Incapacitado, Inconsciente, Surpreso; Cego, salvo adjacente) */
  semReacao: boolean;
  /** não pode Esquivar (Imobilizado) */
  semEsquiva: boolean;
}

export function computarFicha(p: Personagem): FichaCalculada {
  const n = nivelDe(p);
  const b = bolsa(p);
  const g = (k: keyof Omit<Bonus, 'desarmado'>) => b[k] ?? 0;

  const atr = {} as Record<AtributoId, number>;
  const m = {} as Record<AtributoId, number>;
  for (const a of ATRIBUTOS) {
    atr[a.id] = Number(p.atr[a.id] || 0) + g(a.id);
    m[a.id] = mod(atr[a.id]);
  }

  const eq = equipados(p);
  const arm = eq.find((i) => i.cat === 'armadura');
  const escudo = eq.find((i) => i.cat === 'escudo');
  let defArm = 0;
  let pen = 0;
  let rdArm = 0;
  let defEsc = 0;
  if (arm) {
    const t = ARMADURAS.find((a) => a.tipo === arm.armTipo) ?? ARMADURAS[0];
    const { br } = brItem(arm, p);
    defArm = t.def + br + Number(arm.refino || 0);
    pen = g('semPenEsq') ? 0 : t.esq;
    rdArm += br;
  }
  if (escudo) {
    const { br } = brItem(escudo, p);
    defEsc = 2 + br + Number(escudo.refino || 0);
    rdArm += br;
  }

  const res = {} as Record<AtributoId, number>;
  const cd = {} as Record<AtributoId, number>;
  for (const a of ATRIBUTOS) {
    res[a.id] = n + m[a.id] + g('res') + g(`res.${a.id}`);
    cd[a.id] = 10 + n + m[a.id] + g('cd');
  }

  const per: Record<string, number> = {};
  for (const pc of PERICIAS) per[pc.n] = m[pc.a] + Number(p.pericias[pc.n] || 0) + g(`per.${pc.n}`);

  const meioN = Math.floor(n / 2);
  // Punhos de Ferro: o desarmado recebe o Bônus de Rank do Rank do personagem
  const brDesarmado = g('brDesarmado') ? RANKS[rankDoNivel(n)].br : 0;
  const ataques: AtaqueCalculado[] = [
    {
      id: 'desarmado',
      nome: 'Desarmado',
      atk: n + m.FOR + brDesarmado + g('atk') + g('atkCaC'),
      dado: b.desarmado ?? '1d4',
      bonus: m.FOR + meioN + 2 * brDesarmado + g('dano') + g('danoCaC'),
      extra: '',
      critico: margemCritico(p, null, false),
    },
  ];
  const d4Dist = g('d4Dist');
  for (const it of eq.filter((i) => i.cat === 'arma')) {
    const { br } = brItem(it, p);
    const mm = it.atr ? m[it.atr] : 0;
    const ref = Number(it.refino || 0);
    const dist = !!it.dist;
    const temAfixo = (nome: string) => it.afixos.some((a) => a.n === nome);
    const X = it.X || 1;
    const extra = it.afixos
      .filter((a) => AFIXO_ELEMENTO[a.n])
      .map((a) => `+${X}d4 ${AFIXO_ELEMENTO[a.n]}`)
      .join(' ');
    ataques.push({
      id: it.uid,
      nome: it.nome,
      atk: n + mm + br + ref + g('atk') + (dist ? g('atkDist') : g('atkCaC')) + (temAfixo('Afiada') ? X : 0),
      dado: (it.dano || '1d6') + (dist && d4Dist ? `+${d4Dist}d4` : ''),
      bonus:
        mm + meioN + 2 * br + ref + g('dano') + (dist ? g('danoDist') : g('danoCaC')) + (temAfixo('Brutal') ? 2 * X : 0),
      extra,
      dist,
      critico: margemCritico(p, it, dist),
    });
  }

  return aplicarCondicoes(p, {
    nivel: n,
    rank: rankDoNivel(n),
    atr,
    m,
    bonus: b,
    pvMax: 10 + m.VIT + (n - 1) * Math.max(1, 5 + m.VIT) + g('pv'),
    pmMax: 10 + m.INT + (n - 1) * Math.max(1, 4 + m.INT) + g('pm'),
    desl: Math.max(1, 9 + Math.floor(m.AGI / 2) + g('desl')),
    acoes: 1 + Math.floor(n / 5),
    ini: m.AGI + g('ini'),
    def: n + m.FOR + defArm + defEsc + g('def'),
    esq: n + m.AGI + pen + g('esq'),
    defPassiva: 10 + defArm,
    rd: rdArm + g('rd'),
    rdFisico: g('rdFisico'),
    perVisual: per['Percepção'] + g('percepcaoVisual'),
    res,
    cd,
    per,
    ataques,
    xpProx: n * 10,
    periciaMax: 2 + Math.floor(n / 2),
    periciaTotal: 4 + 2 * (n - 1),
    condicoes: [],
    efeitosCondicoes: [],
    penTeste: 0,
    semReacao: false,
    semEsquiva: false,
  });
}

/* ---------------- condições (capítulo 7) ---------------- */

export const condicoesAtivas = (p: Personagem) =>
  (p.condicoes || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

/** Aplica nos números as condições que têm efeito fixo. */
function aplicarCondicoes(p: Personagem, f: FichaCalculada): FichaCalculada {
  const c = new Set(condicoesAtivas(p));
  const efeitos: string[] = [];
  const somarAtaques = (v: number, soCaC = false) =>
    f.ataques.forEach((a) => {
      if (!soCaC || !a.dist) a.atk += v;
    });
  const somarPericias = (v: number) => Object.keys(f.per).forEach((k) => (f.per[k] += v));
  const somarRes = (v: number) => (Object.keys(f.res) as AtributoId[]).forEach((k) => (f.res[k] += v));

  if (c.has('Agarrado')) {
    somarAtaques(-2);
    f.desl = 0;
    efeitos.push('Agarrado: −2 em ataques, deslocamento 0');
  }
  if (c.has('Amedrontado')) {
    somarAtaques(-2);
    somarPericias(-2);
    f.penTeste -= 2;
    efeitos.push('Amedrontado: −2 em ataques e testes');
  }
  if (c.has('Cego')) {
    somarAtaques(-5);
    f.semReacao = true;
    efeitos.push('Cego: −5 em ataques; só Reage a adjacentes com Percepção CD 15');
  }
  if (c.has('Derrubado')) {
    somarAtaques(-4, true);
    f.esq -= 4;
    efeitos.push('Derrubado: −4 em corpo a corpo e em Esquivar');
  }
  if (c.has('Envenenado')) {
    f.res.VIT -= 2;
    efeitos.push('Envenenado: −2 em Resistências de VIT');
  }
  if (c.has('Exausto')) {
    somarPericias(-2);
    somarRes(-2);
    f.penTeste -= 2;
    f.desl /= 2;
    efeitos.push('Exausto: −2 em todos os testes, deslocamento pela metade');
  }
  if (c.has('Imobilizado')) {
    f.desl = 0;
    f.semEsquiva = true;
    efeitos.push('Imobilizado: deslocamento 0, não pode Esquivar');
  }
  if (c.has('Lento')) {
    f.desl /= 2;
    f.acoes = Math.max(1, f.acoes - 1);
    efeitos.push('Lento: deslocamento pela metade, −1 Ação Principal');
  }
  if (c.has('Atordoado')) {
    f.acoes = 1;
    f.semReacao = true;
    efeitos.push('Atordoado: sem Reações nem Ações Especiais; só uma Ação Principal ou de Movimento');
  }
  for (const x of ['Incapacitado', 'Inconsciente', 'Surpreso']) {
    if (!c.has(x)) continue;
    f.semReacao = true;
    efeitos.push(`${x}: não age nem reage`);
  }

  f.condicoes = [...c];
  f.efeitosCondicoes = efeitos;
  return f;
}

/* ---------------- Pontos de Habilidade ---------------- */

export const afinidades = (p: Personagem): ArvoreId[] => DESP[p.despertar.id]?.afin ?? [];

/** Custo de aquisição: 1–6 PH pelo Rank; −1 nas árvores afins ao Despertar (mínimo 1). */
export function custoAquisicao(h: Habilidade, p?: Personagem): number {
  const c = RANKS[h.r].custo;
  return p && afinidades(p).includes(h.t) ? Math.max(1, c - 1) : c;
}

/** PH recebidos: 3 iniciais + compensações + subidas de nível + extras. */
export const phRecebidos = (p: Personagem) =>
  3 + Number(p.compPot.ph || 0) + Number(p.compDesp.ph || 0) + Number(p.phNiveis || 0) + Number(p.phExtra || 0);

/** Níveis grátis do Despertar: +1 a cada novo Rank (níveis 5, 10, 15…), até 5. */
export const niveisGratisDespertar = (p: Personagem) => Math.min(5, Math.floor(nivelDe(p) / 5));

export function phGasto(p: Personagem): number {
  let g = 0;
  for (const x of p.habs) {
    const h = HAB[x.id];
    if (!h) continue;
    if (!x.gratis) g += custoAquisicao(h, p);
    for (let k = 2; k <= x.nv; k++) g += k;
  }
  if (p.despertar.id) for (let k = 2 + niveisGratisDespertar(p); k <= p.despertar.nv; k++) g += k;
  return g;
}

export const phDisponiveis = (p: Personagem) => phRecebidos(p) - phGasto(p);

/* ---------------- Requisitos ---------------- */

export const possui = (p: Personagem, id: string) => p.habs.find((x) => x.id === id);

export interface Requisito {
  ok: boolean;
  txt: string;
}

export function checarRequisitos(h: Habilidade, p: Personagem): Requisito[] {
  const n = nivelDe(p);
  const rk = RANKS[h.r];
  const out: Requisito[] = [{ ok: n >= rk.nivel, txt: `Nível ${rk.nivel}` }];
  const atrs = h.attr.split('/') as AtributoId[];
  out.push({ ok: atrs.some((a) => Number(p.atr[a]) >= rk.attr), txt: `${atrs.join(' ou ')} ${rk.attr}` });
  if (h.pre.length) {
    const r = h.pre.map(([id, nv]) => {
      const x = possui(p, id);
      return { ok: !!x && x.nv >= nv, txt: `${HAB[id]?.n ?? id} nv${nv}` };
    });
    if (h.preAny) out.push({ ok: r.some((z) => z.ok), txt: 'Um entre: ' + r.map((z) => z.txt).join(' / ') });
    else out.push(...r);
  }
  return out;
}

export const requisitosOk = (h: Habilidade, p: Personagem) => checarRequisitos(h, p).every((r) => r.ok);

/** Custo do próximo passo: aquisição se não tem; nível seguinte se tem; null se já está no 5. */
export function custoProximo(id: string, p: Personagem): number | null {
  const x = possui(p, id);
  if (x) return x.nv < 5 ? x.nv + 1 : null;
  return custoAquisicao(HAB[id], p);
}
