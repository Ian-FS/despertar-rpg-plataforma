/* Rastreador de combate: iniciativa, passadas, turnos e Pressão (regras.md, cap. 6).
   - Iniciativa: 1d20 + mod AGI, do maior para o menor; empate: maior mod AGI.
   - Passadas: 1ª passada todos em ordem; 2ª só quem tem 2+ Ações Principais; e assim por diante.
   - Pressão: cada Reação depois da primeira na rodada sofre −2 cumulativo; zera no início do seu turno.
   - Surpreso: não age nem reage na primeira rodada.
   Puro: o servidor rola os dados, grava e dispara o "Início do turno" das fichas. */

export interface Combatente {
  uid: string;
  nome: string;
  tipo: 'ficha' | 'inimigo';
  fichaId?: string;
  /** dono da ficha (pode encerrar o próprio turno) */
  donoId?: string;
  /** total da iniciativa rolada */
  iniciativa: number;
  /** desempate: mod AGI (ou bônus de iniciativa do inimigo) */
  desempate: number;
  /** Ações Principais por rodada (define as passadas) */
  acoes: number;
  /** Reações feitas nesta rodada (a Pressão é −2 por Reação depois da primeira) */
  reacoes: number;
  surpreso: boolean;
  /** inimigos: PV controlados no rastreador */
  pv?: number;
  pvMax?: number;
}

export interface Vez {
  uid: string;
  passada: number;
}

export interface EstadoCombate {
  ativo: boolean;
  rodada: number;
  vez: Vez | null;
  combatentes: Combatente[];
}

export const COMBATE_VAZIO: EstadoCombate = { ativo: false, rodada: 0, vez: null, combatentes: [] };

/** Penalidade de Pressão da próxima Reação (0, −2, −4…). */
export const pressao = (c: Pick<Combatente, 'reacoes'>) => -2 * c.reacoes;

/** Ordem de iniciativa: maior total; empate pelo maior mod AGI; depois pelo nome (estável). */
export function ordenar(lista: Combatente[]): Combatente[] {
  return [...lista].sort((a, b) => b.iniciativa - a.iniciativa || b.desempate - a.desempate || a.nome.localeCompare(b.nome));
}

/** Ordem dos turnos da rodada, passada por passada. */
export function sequencia(e: Pick<EstadoCombate, 'rodada' | 'combatentes'>): Vez[] {
  const aptos = ordenar(e.combatentes).filter((c) => !(c.surpreso && e.rodada === 1));
  const max = Math.max(0, ...aptos.map((c) => c.acoes));
  const r: Vez[] = [];
  for (let passada = 1; passada <= max; passada++) for (const c of aptos) if (c.acoes >= passada) r.push({ uid: c.uid, passada });
  return r;
}

export interface Avanco {
  estado: EstadoCombate;
  /** começou o turno de alguém (1ª passada): disparar o "Início do turno" da ficha */
  inicioTurno: string | null;
  novaRodada: boolean;
}

/** Leva a vez para a posição `i` da sequência; zera a Pressão de quem começa o turno. */
function irPara(e: EstadoCombate, seq: Vez[], i: number, novaRodada: boolean): Avanco {
  const vez = seq[i] ?? null;
  const inicio = vez && vez.passada === 1 ? vez.uid : null;
  const combatentes = e.combatentes.map((c) => (c.uid === inicio ? { ...c, reacoes: 0 } : c));
  return { estado: { ...e, vez, combatentes }, inicioTurno: inicio, novaRodada };
}

/** Começa o combate na rodada 1, com a vez de quem tirou a maior iniciativa. */
export function iniciarCombate(combatentes: Combatente[]): Avanco {
  const e: EstadoCombate = { ativo: true, rodada: 1, vez: null, combatentes: ordenar(combatentes) };
  const seq = sequencia(e);
  // todos surpresos na 1ª rodada: começa direto na 2ª
  if (!seq.length && e.combatentes.length) return proximaRodada(e);
  return irPara(e, seq, 0, false);
}

function proximaRodada(e: EstadoCombate): Avanco {
  const nova: EstadoCombate = {
    ...e,
    rodada: e.rodada + 1,
    // a surpresa só vale na primeira rodada
    combatentes: e.combatentes.map((c) => ({ ...c, surpreso: false })),
  };
  return irPara(nova, sequencia(nova), 0, true);
}

/** Passa a vez. No fim da última passada começa a próxima rodada. */
export function proximaVez(e: EstadoCombate): Avanco {
  const seq = sequencia(e);
  const i = e.vez ? seq.findIndex((v) => v.uid === e.vez!.uid && v.passada === e.vez!.passada) : -1;
  if (i >= 0 && i + 1 < seq.length) return irPara(e, seq, i + 1, false);
  if (i < 0 && e.vez) {
    // a vez atual deixou de existir (ex.: perdeu uma Ação Principal): segue para a próxima passada
    const j = seq.findIndex((v) => v.passada > e.vez!.passada);
    if (j >= 0) return irPara(e, seq, j, false);
  }
  return proximaRodada(e);
}

/** Tira um combatente. Se era a vez dele, a vez passa antes. */
export function removerCombatente(e: EstadoCombate, uid: string): Avanco {
  const base = e.vez?.uid === uid ? proximaVez(e) : { estado: e, inicioTurno: null, novaRodada: false };
  const combatentes = base.estado.combatentes.filter((c) => c.uid !== uid);
  const estado = { ...base.estado, combatentes };
  if (!combatentes.length) return { estado: { ...estado, vez: null }, inicioTurno: null, novaRodada: false };
  return { ...base, estado };
}

/** Quem está na vez. */
export const naVez = (e: EstadoCombate) => (e.vez ? (e.combatentes.find((c) => c.uid === e.vez!.uid) ?? null) : null);
