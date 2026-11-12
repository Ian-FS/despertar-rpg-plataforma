/* Gatilhos: o que acontece sozinho em certos momentos do jogo.
   - Limites de uso ("1× por combate", "1× por dia"): contados em p.usos e zerados no fim do combate
     ou no descanso longo.
   - Efeitos ativos (Fúria, Modo Limite, venenos): somam bônus na ficha e duram rodadas; a duração
     diminui no início do turno de quem tem o efeito.
   - Passivas com gatilho (Circulação de Mana, Fôlego de Combate, Sangue Fervente, Corpo Imortal…).
   Eventos: início do turno, fim do combate, descanso curto, descanso longo. Hoje o Mestre os dispara
   na ficha; na Fase 2 o rastreador de combate dispara "início do turno" sozinho. */
import { HAB } from './dados';
import type { UsoDespertar } from './despertar-usos';
import { computarFicha, condicoesAtivas, possui, type FichaCalculada } from './ficha';
import type { EfeitoAtivo, Personagem } from './personagem';
import { rolar, sortearCrypto, type Rolagem, type Sorteio } from './rolagem';

export type Evento = 'inicioTurno' | 'fimCombate' | 'descansoCurto' | 'descansoLongo';

export const NOME_EVENTO: Record<Evento, string> = {
  inicioTurno: 'Início do turno',
  fimCombate: 'Fim do combate',
  descansoCurto: 'Descanso curto',
  descansoLongo: 'Descanso longo',
};

export interface ResultadoEvento {
  linhas: string[];
  rolagens: { rotulo: string; r: Rolagem }[];
}

const novoUid = () => globalThis.crypto.randomUUID();

/* ---------------- condições (texto "A, B, C") ---------------- */

export function adicionarCondicao(p: Personagem, c: string) {
  const atuais = condicoesAtivas(p);
  if (!atuais.includes(c)) p.condicoes = [...atuais, c].join(', ');
}
export function removerCondicao(p: Personagem, c: string) {
  p.condicoes = condicoesAtivas(p)
    .filter((x) => x !== c)
    .join(', ');
}

/* ---------------- PV e PM ---------------- */

function ganhar(p: Personagem, f: FichaCalculada, alvo: 'pv' | 'pm', valor: number): number {
  const campo = alvo === 'pv' ? 'pvAtual' : 'pmAtual';
  const max = alvo === 'pv' ? f.pvMax : f.pmMax;
  const atual = p[campo] ?? max;
  const novo = valor >= 0 ? Math.max(atual, Math.min(max, atual + valor)) : alvo === 'pm' ? Math.max(0, atual + valor) : atual + valor;
  p[campo] = novo;
  return novo - atual;
}

/* ---------------- limites de uso ---------------- */

export type Periodo = 'combate' | 'dia';
export interface Limite {
  chave: string;
  por: Periodo;
  max: number;
  texto: string;
}
const limite = (origem: string, por: Periodo, max: number): Limite => ({
  chave: `${por}:${origem}`,
  por,
  max,
  texto: `${max}× por ${por}`,
});

/** Melhorias por nível que mudam a frequência do livro. */
const LIMITES_HAB: Record<string, (nv: number) => [Periodo, number]> = {
  lam8: (nv) => ['combate', nv >= 5 ? 2 : 1],
  bas8: (nv) => ['combate', nv >= 5 ? 2 : 1],
  ele8: (nv) => (nv >= 5 ? ['combate', 1] : ['dia', 1]),
  res7: (nv) => ['dia', nv >= 5 ? 2 : 1],
  sen8: (nv) => ['combate', nv >= 5 ? 3 : nv >= 3 ? 2 : 1],
};

const lerFreq = (txt?: string): [Periodo, number] | null => {
  const m = /(\d+)×\s*(?:por|\/)\s*(combate|dia)/.exec(txt ?? '');
  return m ? [m[2] as Periodo, Number(m[1])] : null;
};

export function limiteHabilidade(habId: string, nv: number): Limite | null {
  const f = LIMITES_HAB[habId]?.(nv) ?? lerFreq(HAB[habId]?.freq);
  return f ? limite(`hab:${habId}`, f[0], f[1]) : null;
}
export function limiteDespertar(despId: string, uso: UsoDespertar): Limite | null {
  const f = lerFreq(uso.freq);
  return f ? limite(`desp:${despId}.${uso.id}`, f[0], f[1]) : null;
}
export const usosRestantes = (p: Personagem, l: Limite) => l.max - (p.usos[l.chave] ?? 0);
export function registrarUso(p: Personagem, l: Limite) {
  p.usos = { ...p.usos, [l.chave]: (p.usos[l.chave] ?? 0) + 1 };
}
export const erroLimite = (p: Personagem, nome: string, l: Limite | null) =>
  l && usosRestantes(p, l) <= 0 ? `${nome}: já usado ${l.max}× neste ${l.por === 'dia' ? 'dia' : 'combate'}.` : null;

function zerarUsos(p: Personagem, periodos: Periodo[]) {
  p.usos = Object.fromEntries(Object.entries(p.usos).filter(([k]) => !periodos.some((x) => k.startsWith(`${x}:`))));
}

/* ---------------- efeitos ativos ---------------- */

export type NovoEfeito = Omit<EfeitoAtivo, 'uid' | 'origem'>;

/** Liga um efeito (se já existe um da mesma origem, renova). */
export function ativarEfeito(p: Personagem, origem: string, e: NovoEfeito): EfeitoAtivo {
  const novo: EfeitoAtivo = { ...e, uid: novoUid(), origem };
  if (origem !== 'mestre') p.efeitosAtivos = p.efeitosAtivos.filter((x) => x.origem !== origem);
  p.efeitosAtivos = [...p.efeitosAtivos, novo];
  if (novo.condicao) adicionarCondicao(p, novo.condicao);
  return novo;
}

/** Desliga um efeito: tira a condição dele (se nenhum outro a mantém) e aplica a de término. */
export function encerrarEfeito(p: Personagem, uid: string, linhas: string[] = []) {
  const e = p.efeitosAtivos.find((x) => x.uid === uid);
  if (!e) return;
  p.efeitosAtivos = p.efeitosAtivos.filter((x) => x.uid !== uid);
  if (e.condicao && !p.efeitosAtivos.some((x) => x.condicao === e.condicao)) removerCondicao(p, e.condicao);
  linhas.push(`${e.nome} terminou.`);
  if (e.aoTerminar) {
    adicionarCondicao(p, e.aoTerminar);
    linhas.push(`${e.nome}: agora você está ${e.aoTerminar}.`);
  }
}

/** Texto curto do que o efeito soma na ficha. */
export function resumoBonus(e: { bonus?: EfeitoAtivo['bonus'] }): string {
  const NOMES: Record<string, string> = { atk: 'ataque', dano: 'dano', danoCaC: 'dano corpo a corpo', danoDist: 'dano à distância', def: 'Defender', esq: 'Esquivar', rd: 'RD', desl: 'm de deslocamento', ini: 'Iniciativa', cd: 'CD' };
  return Object.entries(e.bonus ?? {})
    .filter(([, v]) => v)
    .map(([k, v]) => (k === 'desarmado' ? `desarmado ${v}` : `${Number(v) > 0 ? '+' : ''}${v} ${NOMES[k] ?? k}`))
    .join(', ');
}

/* ---------------- passivas com gatilho ---------------- */

interface Ctx {
  p: Personagem;
  f: FichaCalculada;
  nv: number;
  linhas: string[];
}
type Gatilho = (c: Ctx) => void;

const curar = (c: Ctx, alvo: 'pv' | 'pm', valor: number, nome: string) => {
  const g = ganhar(c.p, c.f, alvo, valor);
  if (g > 0) c.linhas.push(`${nome}: +${g} ${alvo.toUpperCase()}.`);
};

/** Início do turno (em combate), por habilidade e por Despertar. */
const INICIO_TURNO_HAB: Record<string, Gatilho> = {
  aur2: (c) => curar(c, 'pm', c.nv, 'Circulação de Mana'),
  pun4: (c) => {
    const pv = c.p.pvAtual ?? c.f.pvMax;
    if (pv > c.f.pvMax / 2) return;
    curar(c, 'pv', 2 * c.nv, 'Fôlego de Combate');
    if (c.nv >= 3) curar(c, 'pm', 2, 'Fôlego de Combate');
    if (c.nv >= 5) {
      const tirar = ['Atordoado', 'Lento', 'Amedrontado'].find((x) => condicoesAtivas(c.p).includes(x));
      if (tirar) {
        removerCondicao(c.p, tirar);
        c.linhas.push(`Fôlego de Combate: ${tirar} removido.`);
      }
    }
  },
};
const INICIO_TURNO_DESP: Record<string, Gatilho> = {
  d12: (c) => curar(c, 'pv', c.nv, 'Sangue Fervente'),
  d30: (c) => curar(c, 'pv', 3 * c.nv, 'Corpo Imortal'),
  d15: (c) => {
    if (c.nv >= 3 && c.p.efeitosAtivos.some((e) => e.origem === 'desp:d15.fera')) curar(c, 'pv', 3, 'Pele de Fera');
  },
};

/** Circulação de Mana nv5: ao chegar a 0 PM pela primeira vez no dia, recupera metade. */
export function aoZerarPM(p: Personagem): string | null {
  const h = possui(p, 'aur2');
  if (!h || h.nv < 5 || p.pmAtual !== 0 || p.usos['dia:hab:aur2.m5']) return null;
  const f = computarFicha(p);
  p.pmAtual = Math.floor(f.pmMax / 2);
  p.usos = { ...p.usos, 'dia:hab:aur2.m5': 1 };
  return `Circulação de Mana: PM a zero, recuperou ${p.pmAtual} PM.`;
}

/* ---------------- eventos ---------------- */

export function aplicarEvento(p: Personagem, evento: Evento, sortear: Sorteio = sortearCrypto): ResultadoEvento {
  const res: ResultadoEvento = { linhas: [], rolagens: [] };
  const f = computarFicha(p);

  if (evento === 'inicioTurno') {
    // 1) efeitos que rolam todo turno (veneno, queimadura, regeneração)
    for (const e of p.efeitosAtivos) {
      if (!e.porTurno) continue;
      const r = rolar(e.porTurno.formula, sortear);
      if (!r) continue;
      const alvo = e.porTurno.alvo ?? 'pv';
      res.rolagens.push({ rotulo: `${e.nome} (${e.porTurno.cura ? 'cura' : 'dano'})`, r });
      const g = ganhar(p, f, alvo, e.porTurno.cura ? r.total : -r.total);
      res.linhas.push(`${e.nome}: ${g >= 0 ? '+' : ''}${g} ${alvo.toUpperCase()}.`);
    }
    // 2) passivas
    for (const x of p.habs) INICIO_TURNO_HAB[x.id]?.({ p, f, nv: x.nv, linhas: res.linhas });
    INICIO_TURNO_DESP[p.despertar.id]?.({ p, f, nv: p.despertar.nv, linhas: res.linhas });
    // 3) a duração diminui
    for (const e of [...p.efeitosAtivos]) {
      if (e.rodadas === null) continue;
      e.rodadas -= 1;
      if (e.rodadas <= 0) encerrarEfeito(p, e.uid, res.linhas);
    }
  }

  if (evento === 'fimCombate' || evento === 'descansoLongo') {
    for (const e of [...p.efeitosAtivos]) encerrarEfeito(p, e.uid, res.linhas);
    zerarUsos(p, evento === 'descansoLongo' ? ['combate', 'dia'] : ['combate']);
    res.linhas.push(evento === 'fimCombate' ? 'Usos "por combate" liberados.' : 'Usos "por combate" e "por dia" liberados.');
  }

  if (evento === 'descansoCurto') {
    const usados = p.usos['dia:descansoCurto'] ?? 0;
    p.usos = { ...p.usos, 'dia:descansoCurto': usados + 1 };
    if (usados >= 2) res.linhas.push(`Atenção: este é o ${usados + 1}º descanso curto do dia (o livro permite 2).`);
    const metadePV = p.despertar.id === 'd12';
    const metadePM = (possui(p, 'aur2')?.nv ?? 0) >= 3;
    const pv = ganhar(p, f, 'pv', Math.floor(f.pvMax / (metadePV ? 2 : 4)));
    const pm = ganhar(p, f, 'pm', Math.floor(f.pmMax / (metadePM ? 2 : 4)));
    res.linhas.push(`Descanso curto: +${pv} PV${metadePV ? ' (Sangue Fervente: metade)' : ''}, +${pm} PM${metadePM ? ' (Circulação de Mana: metade)' : ''}.`);
  }

  if (evento === 'descansoLongo') {
    const g = computarFicha(p); // já sem os efeitos que acabaram
    p.pvAtual = g.pvMax;
    p.pmAtual = g.pmMax;
    removerCondicao(p, 'Exausto');
    res.linhas.push('Descanso longo: PV e PM restaurados, Exausto removido.');
  }

  return res;
}
