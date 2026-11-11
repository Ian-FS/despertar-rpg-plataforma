/* O que acontece quando um poder é usado: ataque, dano, cura, Resistência (CD) e testes.
   Regras usadas (capítulo 6):
   - Rolagem de ataque: como um ataque com arma. Ataque de poder = 1d20 + Nível + mod do atributo-chave.
   - Resistência: o alvo rola 1d20 + Nível + mod contra a CD = 10 + Nível + mod do atributo-chave.
   - Crítico: role todos os dados duas vezes; os modificadores não dobram.
   - Dano de habilidade: segue o texto de cada poder (soma mod e metade do Nível só quando ele diz).
   A tabela é escrita à mão a partir do texto de cada poder; `nv` é o nível da habilidade ou do Despertar. */
import { ARV, DESP, HAB } from './dados';
import { margemCritico, type AtaqueCalculado, type FichaCalculada } from './ficha';
import { computarFicha } from './ficha';
import type { Personagem } from './personagem';
import { ehCritico, rolar, sortearCrypto, type Rolagem, type Sorteio } from './rolagem';
import type { AtributoId } from './tipos';

export interface EfeitoPoder {
  /** rolagem de ataque: com a arma equipada (cac, dist, arma = qualquer), desarmado, ou de poder (atributo-chave) */
  ataque?: { tipo: 'cac' | 'dist' | 'arma' | 'desarmado' | 'poder'; vezes?: number; bonus?: number };
  dano?: {
    /** dados do poder já escalados pelo nível */
    dados?: string;
    /** soma o dano normal da arma do ataque */
    arma?: boolean;
    /** soma o mod (true = do atributo-chave) */
    mod?: boolean | AtributoId;
    meioNivel?: boolean;
    cura?: boolean;
    rotulo?: string;
    /** multiplica o total (Golpe Devastador) e soma um valor fixo depois */
    mult?: number;
    soma?: number;
  };
  resistencia?: { atr: AtributoId; cdBonus?: number; falha: string; sucesso?: string };
  /** teste do próprio usuário: perícia ou atributo (1d20 + Nível + mod) */
  teste?: { rotulo: string; pericia?: string; atr?: AtributoId };
  /** dano que o próprio usuário sofre (não reduzível); o servidor desconta dos PV */
  proprio?: string;
  nota?: string;
}

type Def = (nv: number) => EfeitoPoder;

/** "2d8" + (nv−1) × "1d8" → "(1+nv)d8" */
const d = (qtd: number, faces: number) => (qtd > 0 ? `${qtd}d${faces}` : undefined);

export const PODERES_HAB: Record<string, Def> = {
  lam2: (nv) => ({ ataque: { tipo: 'cac' }, dano: { arma: true, dados: d(nv, 6) }, nota: nv >= 3 ? 'Se acertar: mova-se 6 m sem Ataques de Oportunidade.' : 'Se acertar: mova-se 3 m sem Ataques de Oportunidade.' }),
  lam4: (nv) => ({
    ataque: { tipo: 'cac' },
    dano: { arma: true, dados: d(nv + 1, 8) },
    resistencia: {
      atr: 'VIT',
      cdBonus: nv >= 3 ? 2 : 0,
      falha: nv >= 5 ? 'Atordoado por 2 rodadas (Chefes: apenas Lentos)' : 'Atordoado até o fim do próximo turno dele',
    },
    nota: 'A Resistência só acontece se o ataque acertar.',
  }),
  lam5: (nv) => ({ ataque: { tipo: 'arma' }, dano: { arma: true, dados: d(nv + 2, 6) }, nota: `Alcance ${18 + 6 * (nv - 1)} m.${nv >= 3 ? ' Atravessa: o mesmo ataque vale contra todos na linha.' : ''}${nv >= 5 ? ' Ignora RD.' : ''}` }),
  lam6: (nv) => ({ ataque: { tipo: 'cac', vezes: nv + 2 }, dano: { arma: true, dados: nv >= 5 ? '2d6' : undefined }, nota: `Até ${nv + 2} alvos, um ataque contra cada.` }),
  lam8: (nv) => ({ ataque: { tipo: 'cac' }, dano: { dados: d(10 + 2 * (nv - 1), 10), mod: true, meioNivel: true }, nota: 'Um ataque contra todos na linha; quem reagir com sucesso sofre metade.' }),
  pun2: (nv) => ({ ataque: { tipo: 'desarmado' }, dano: { arma: true, dados: d(nv - 1, 6) } }),
  pun3: (nv) => ({ teste: { rotulo: 'Atletismo (oposto)', pericia: 'Atletismo' }, nota: `Se vencer: Agarrado, e sofre seu dano desarmado${nv > 1 ? ` +${nv - 1}d6` : ''} no início de cada turno seu.` }),
  pun5: (nv) => ({ ataque: { tipo: 'desarmado', vezes: nv + 3 }, dano: { arma: true } }),
  pun6: (nv) => ({ dano: { dados: d(nv + 3, 8), mod: 'FOR' }, resistencia: { atr: 'FOR', falha: 'Derrubado e sofre o dano todo', sucesso: 'metade do dano' } }),
  pun8: (nv) => ({
    ataque: { tipo: 'desarmado' },
    dano: { arma: true, mult: nv >= 4 ? 4 : 3, soma: [0, 0, 10, 20, 0, 20][nv] ?? 0 },
    nota: 'Errar ainda causa o dano normal a estruturas.',
  }),
  vul4: (nv) => ({ resistencia: { atr: 'VIT', falha: `Envenenado: ${nv}d6 no início de cada turno dele por 3 rodadas`, sucesso: 'anula' }, nota: 'Vale para o seu próximo acerto.' }),
  vul8: (nv) => ({
    ataque: { tipo: 'arma' },
    dano: { arma: true },
    resistencia: { atr: 'VIT', cdBonus: 0, falha: 'morre', sucesso: 'Chefe sobrevive com 1 PV' },
    nota: `O alvo não pode reagir. Se ficar com ${25 + 5 * (nv - 1)}% ou menos dos PV máximos, morre (Chefes fazem a Resistência${nv >= 5 ? ' com −5' : ''}).`,
  }),
  dis2: (nv) => ({ ataque: { tipo: 'dist', vezes: nv >= 5 ? 3 : 2, bonus: nv >= 5 ? 0 : -(5 - nv) }, dano: { arma: true } }),
  dis3: (nv) => ({ ataque: { tipo: 'dist' }, dano: { arma: true, dados: d(nv, 8) }, nota: 'Sem munição.' }),
  dis5: (nv) => ({ ataque: { tipo: 'dist' }, dano: { arma: true, dados: d(nv + 1, 6) }, nota: 'Um ataque contra todas as criaturas na área.' }),
  dis6: (nv) => ({ ataque: { tipo: 'dist' }, dano: { arma: true, dados: d(nv + 3, 8) }, nota: 'Contra cada alvo na linha; escudo e RD não se aplicam.' }),
  dis7: (nv) => ({ nota: `Alvo marcado: +${1 + nv} no acerto e +${nv}d6 de dano nos seus ataques contra ele.` }),
  dis8: (nv) => ({ ataque: { tipo: 'dist', bonus: 10 }, dano: { dados: d(12 + 2 * (nv - 1), 12) }, nota: nv >= 5 ? 'Sem rodada de carga.' : 'Dispare no turno seguinte (sem Reações enquanto carrega).' }),
  bas2: (nv) => ({ resistencia: { atr: 'PRE', falha: '−4 em ataques contra quem não for você' }, nota: nv >= 5 ? 'Todos os inimigos no alcance; 2 rodadas.' : nv >= 3 ? 'Até 3 inimigos.' : undefined }),
  bas3: (nv) => ({ nota: `+${2 * nv} na sua Reação de Defender.` }),
  bas4: (nv) => ({ nota: `+${2 + nv} em Defender e +${2 + nv} de RD; deslocamento 0.` }),
  bas7: (nv) => ({ nota: `Barreira com PV = 30 + 5 × Nível + ${20 * (nv - 1)}.` }),
  bas8: (nv) => ({ nota: `RD ${10 + 2 * (nv - 1)} para aliados no alcance por ${1 + nv} rodadas.` }),
  ele1: (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(nv, 10), mod: 'INT', meioNivel: true }, nota: 'Fogo: Queimando 1d4 · Gelo: −3 m · Raio: −1 em Reações (1 rodada).' }),
  ele3: (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(nv + 2, 6), mod: 'INT' }, nota: 'Um ataque contra cada criatura na área; atingidos ficam Queimando (1d6 por 2 rodadas).' }),
  ele4: (nv) => ({ resistencia: { atr: 'AGI', falha: `Imobilizado${nv >= 3 ? ' por 2 rodadas' : ''} e sofre o dano` }, dano: { dados: d(nv + 1, 6), rotulo: 'Dano (se falhar)' } }),
  ele5: (nv) => ({ ataque: { tipo: 'poder', vezes: nv + 2 }, dano: { dados: d(nv + 3, 8) }, nota: `Até ${nv + 2} alvos, cada um a até 9 m do anterior.` }),
  ele6: (nv) => ({ resistencia: { atr: 'AGI', falha: 'dano todo', sucesso: 'metade do dano' }, dano: { dados: d(nv + 4, 8), rotulo: 'Dano por turno na zona' } }),
  ele7: (nv) => ({ nota: `Quem o acerta corpo a corpo sofre ${d(nv + 1, 10)}; poderes elementais custam metade.` }),
  ele8: (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(15 + 3 * (nv - 1), 10) }, nota: 'Um ataque contra todos na área; quem reagir com sucesso sofre metade.' }),
  res1: (nv) => ({ dano: { dados: d(nv + 1, 8), mod: 'INT', cura: true } }),
  res2: (nv) => ({ nota: `+${nv} em ataques e Reações.` }),
  res4: (nv) => ({ dano: { dados: d(nv, 6), cura: true, rotulo: 'Cura (por turno)' } }),
  res5: (nv) => ({ dano: { dados: d(nv + 2, 8), mod: 'INT', cura: true }, nota: 'Todos os aliados na área.' }),
  res6: (nv) => ({ nota: `${15 + 10 * (nv - 1)} PV temporários antes do dano.` }),
  dom3: (nv) => ({ resistencia: { atr: 'PRE', falha: 'torna-se sua companheira leal' }, nota: nv >= 5 ? 'Chefe derrotado: Resistência com −5.' : undefined }),
  dom4: (nv) => ({ resistencia: { atr: 'FOR', cdBonus: nv - 1, falha: nv >= 3 ? 'Imobilizado e Agarrado por 2 rodadas' : 'Imobilizado' } }),
  aur1: (nv) => ({ nota: `+${nv} em ataques e +${2 * nv} de dano corpo a corpo.` }),
  aur3: (nv) => ({ resistencia: { atr: 'PRE', cdBonus: nv - 1, falha: 'Amedrontado' }, nota: nv >= 5 ? 'Inimigos 5+ níveis abaixo falham automaticamente.' : undefined }),
  aur4: (nv) => ({ dano: { dados: d(nv + 1, 8), rotulo: 'Dano extra (próximo ataque ou poder)' }, proprio: nv >= 3 ? '1d4' : '1d6', nota: nv >= 5 ? 'Se o ataque for crítico, o Mestre devolve o dano que você sofreu.' : undefined }),
  aur6: (nv) => ({ resistencia: { atr: 'FOR', falha: 'dano todo e empurrado 6 m', sucesso: 'metade e não é empurrado' }, dano: { dados: d(nv + 5, 6) } }),
  aur7: () => ({ nota: '+1 Ação Principal e +4 em ataques, Reações e dano. Ao terminar: Exausto.' }),
};

/** Poderes do Despertar, por "despertar.uso" (ids de despertar-usos.ts). */
export const PODERES_DESP: Record<string, Def> = {
  'd01.rd': () => ({ nota: 'RD dobrada até o fim da rodada.' }),
  'd02.lamina': (nv) => ({ ataque: { tipo: 'cac' }, dano: { arma: true, dados: d(nv, 6) } }),
  'd05.projetil': (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(nv + 1, 8), mod: 'INT' } }),
  'd06.cura': (nv) => ({ dano: { dados: d(nv, 8), mod: 'PRE', cura: true } }),
  'd07.barreira': (nv) => ({ nota: `+${1 + nv} na Reação de Defender.` }),
  'd09.furia': (nv) => ({ nota: `Fúria: +${1 + nv} de dano corpo a corpo, RD ${1 + nv}, −2 em Esquivar.` }),
  'd10.gelo': (nv) => ({ resistencia: { atr: 'VIT', falha: `Lento por 1 rodada e sofre o dano${nv >= 5 ? ' (falhar por 5+: Imobilizado)' : ''}` }, dano: { dados: d(nv + 1, 6), rotulo: 'Dano (se falhar)' } }),
  'd13.raio': (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(nv + 1, 10) }, nota: nv >= 5 ? 'Atingidos não podem usar Reação até o seu próximo turno.' : 'Linha de 18 m.' }),
  'd14.telecinese': (nv) => ({ resistencia: { atr: 'FOR', falha: 'é movido' }, dano: { dados: d(nv + 1, 6), rotulo: 'Dano se arremessar' } }),
  'd15.fera': (nv) => ({ nota: `Garras 1d8, +${2 * nv} FOR e AGI, +3 m de deslocamento.` }),
  'd17.medo': (nv) => ({ resistencia: { atr: 'PRE', cdBonus: nv - 1, falha: nv >= 5 ? 'Amedrontado e Lento' : 'Amedrontado por 1 rodada' } }),
  'd18.toxina': (nv) => ({ nota: `Próximo acerto: Envenenado, ${d(nv + 1, 4)} por 3 rodadas.` }),
  'd22.gravidade': (nv) => ({ resistencia: { atr: 'FOR', falha: 'Derrubado e Lento' }, dano: nv >= 5 ? { dados: '4d10' } : undefined }),
  'd24.luz': (nv) => ({ dano: { dados: d(nv + 1, 8), rotulo: 'Cura nos aliados / dano nos monstros' } }),
  'd25.vento': (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(nv + 1, 8) }, nota: 'Empurra 3 m.' }),
  'd28.sangue': (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(nv + 1, 10) }, nota: `O alvo fica Sangrando (2 por turno).${nv >= 3 ? ' Você cura metade do dano causado.' : ''}` }),
  'd29.sopro': (nv) => ({ ataque: { tipo: 'poder' }, dano: { dados: d(2 * nv + 2, 10) }, nota: 'Cone de 9 m: um ataque contra todos; quem reagir com sucesso sofre metade.' }),
  'd32.erguer': (nv) => ({ teste: { rotulo: 'Erguer Sombra (PRE)', atr: 'PRE' }, nota: `CD 10 + nível da criatura${nv >= 5 ? ' (+5 se for Chefe)' : ''}. Até 3 tentativas por corpo.` }),
};

/* ---------------- atributo-chave ---------------- */

const atributosDe = (txt: string) => txt.split('/').map((x) => x.trim()) as AtributoId[];

/** Atributo-chave do Despertar: o texto do poder manda quando cita um; senão, o da primeira árvore afim. */
const CHAVE_DESP: Record<string, AtributoId[]> = { d05: ['INT'], d06: ['PRE'], d17: ['PRE'], d32: ['PRE'] };

export function chavesHabilidade(habId: string): AtributoId[] {
  return atributosDe(HAB[habId]?.attr ?? 'FOR');
}
export function chavesDespertar(despId: string): AtributoId[] {
  const afim = DESP[despId]?.afin[0];
  return CHAVE_DESP[despId] ?? atributosDe(afim ? ARV[afim].atr : 'INT');
}
/** Entre "A/B", o atributo-chave é o de maior modificador. */
export const melhorChave = (f: FichaCalculada, chaves: AtributoId[]) =>
  chaves.reduce((a, b) => (f.m[b] > f.m[a] ? b : a), chaves[0]);

/* ---------------- montagem das fórmulas ---------------- */

const fmt = (dados: string[], fixo: number) => {
  const ds = dados.filter(Boolean).join('+');
  if (!ds) return String(fixo);
  return fixo ? `${ds}${fixo > 0 ? '+' : '-'}${Math.abs(fixo)}` : ds;
};
const d20 = (b: number) => (b >= 0 ? `1d20+${b}` : `1d20-${Math.abs(b)}`);
/** Crítico: todos os dados rolam duas vezes; modificadores não dobram. */
export const dobrarDados = (formula: string) => formula.replace(/(\d*)d(\d+)/g, (_, q, fc) => `${2 * Number(q || 1)}d${fc}`);

interface AtaqueDoPoder {
  nome: string;
  atk: number;
  critico: number;
  arma?: AtaqueCalculado;
}

function escolherArma(f: FichaCalculada, tipo: 'cac' | 'dist' | 'arma' | 'desarmado'): AtaqueCalculado {
  const armas = f.ataques.filter((a) => a.id !== 'desarmado');
  const achada =
    tipo === 'desarmado' ? undefined : tipo === 'cac' ? armas.find((a) => !a.dist) : tipo === 'dist' ? armas.find((a) => a.dist) : armas[0];
  return achada ?? (tipo === 'dist' ? (armas[0] ?? f.ataques[0]) : f.ataques[0]);
}

function ataqueDo(p: Personagem, f: FichaCalculada, ef: EfeitoPoder, chave: AtributoId): AtaqueDoPoder | null {
  const a = ef.ataque;
  if (!a) return null;
  const extra = a.bonus ?? 0;
  if (a.tipo === 'poder')
    return {
      nome: `ataque de poder (${chave})`,
      atk: f.nivel + f.m[chave] + (f.bonus.atk ?? 0) + f.penAtaque + extra,
      critico: margemCritico(p, null, true),
    };
  const arma = escolherArma(f, a.tipo);
  return { nome: arma.nome, atk: arma.atk + extra, critico: arma.critico, arma };
}

function formulaDano(f: FichaCalculada, ef: EfeitoPoder, chave: AtributoId, arma?: AtaqueCalculado): string | null {
  const dn = ef.dano;
  if (!dn) return null;
  const dados: string[] = [];
  let fixo = 0;
  if (dn.arma && arma) {
    dados.push(arma.dado);
    dados.push(...(arma.extra.match(/\d*d\d+/g) ?? []));
    fixo += arma.bonus;
  }
  if (dn.dados) dados.push(dn.dados);
  if (dn.mod) fixo += f.m[dn.mod === true ? chave : dn.mod];
  if (dn.meioNivel) fixo += Math.floor(f.nivel / 2);
  if (!dados.length && !fixo) return null;
  return fmt(dados, fixo);
}

/* ---------------- prévia (o que aparece na tela antes de usar) ---------------- */

export interface PreviaPoder {
  ataque?: string;
  dano?: string;
  resistencia?: string;
  teste?: string;
  proprio?: string;
  nota?: string;
}

export function previaPoder(p: Personagem, ef: EfeitoPoder, chaves: AtributoId[], f = computarFicha(p)): PreviaPoder {
  const chave = melhorChave(f, chaves);
  const atq = ataqueDo(p, f, ef, chave);
  const formula = formulaDano(f, ef, chave, atq?.arma);
  const vezes = ef.ataque?.vezes ?? 1;
  const out: PreviaPoder = { nota: ef.nota };
  if (atq) out.ataque = `${vezes > 1 ? `${vezes}× ` : ''}Ataque ${atq.atk >= 0 ? '+' : ''}${atq.atk} (${atq.nome})`;
  if (formula) {
    const mult = ef.dano?.mult ? ` ×${ef.dano.mult}${ef.dano.soma ? ` +${ef.dano.soma}` : ''}` : '';
    out.dano = `${ef.dano?.rotulo ?? (ef.dano?.cura ? 'Cura' : 'Dano')} ${formula}${mult}`;
  }
  if (ef.resistencia) {
    const r = ef.resistencia;
    out.resistencia = `CD ${f.cd[chave] + (r.cdBonus ?? 0)} · Resistência (${r.atr}) · falha: ${r.falha}${r.sucesso ? ` · sucesso: ${r.sucesso}` : ''}`;
  }
  if (ef.teste) out.teste = `${ef.teste.rotulo} ${bonusTeste(f, ef.teste) >= 0 ? '+' : ''}${bonusTeste(f, ef.teste)}`;
  if (ef.proprio) out.proprio = `Você sofre ${ef.proprio} (não reduzível)`;
  return out;
}

const bonusTeste = (f: FichaCalculada, t: NonNullable<EfeitoPoder['teste']>) =>
  t.pericia ? (f.per[t.pericia] ?? 0) : f.nivel + f.m[t.atr ?? 'PRE'] + f.penTeste;

/* ---------------- uso (rolagens feitas no servidor) ---------------- */

export interface RolagemPoder {
  rotulo: string;
  r: Rolagem;
  tipo: 'ataque' | 'dano' | 'cura' | 'teste' | 'proprio';
  /** margem de crítico, quando é ataque */
  critico?: number;
  /** o dano rolou dobrado por causa de um crítico */
  dobrado?: boolean;
}

export interface ResultadoPoder {
  rolagens: RolagemPoder[];
  resistencia?: string;
  nota?: string;
  /** dano sofrido pelo próprio usuário */
  danoProprio?: number;
}

function multiplicar(r: Rolagem, mult?: number, soma?: number): Rolagem {
  if (!mult) return r;
  return { ...r, total: r.total * mult + (soma ?? 0), texto: `(${r.texto}) ×${mult}${soma ? ` +${soma}` : ''}` };
}

export function resolverPoder(p: Personagem, ef: EfeitoPoder, chaves: AtributoId[], sortear: Sorteio = sortearCrypto): ResultadoPoder {
  const f = computarFicha(p);
  const chave = melhorChave(f, chaves);
  const previa = previaPoder(p, ef, chaves, f);
  const rolagens: RolagemPoder[] = [];
  const atq = ataqueDo(p, f, ef, chave);
  const formula = formulaDano(f, ef, chave, atq?.arma);
  const tipoDano = ef.dano?.cura ? 'cura' : 'dano';
  const rotuloDano = ef.dano?.rotulo ?? (ef.dano?.cura ? 'Cura' : 'Dano');

  if (ef.teste) {
    const r = rolar(d20(bonusTeste(f, ef.teste)), sortear)!;
    rolagens.push({ rotulo: ef.teste.rotulo, r, tipo: 'teste' });
  }

  if (atq) {
    const vezes = ef.ataque?.vezes ?? 1;
    for (let i = 0; i < vezes; i++) {
      const n = vezes > 1 ? ` ${i + 1}` : '';
      const ra = rolar(d20(atq.atk), sortear)!;
      const crit = ehCritico(ra, atq.critico);
      rolagens.push({ rotulo: `Ataque${n} · ${atq.nome}`, r: ra, tipo: 'ataque', critico: atq.critico });
      if (formula) {
        const rd = rolar(crit ? dobrarDados(formula) : formula, sortear)!;
        rolagens.push({ rotulo: `${rotuloDano}${n}${crit ? ' (crítico)' : ''}`, r: multiplicar(rd, ef.dano?.mult, ef.dano?.soma), tipo: tipoDano, dobrado: crit });
      }
    }
  } else if (formula) {
    rolagens.push({ rotulo: rotuloDano, r: multiplicar(rolar(formula, sortear)!, ef.dano?.mult, ef.dano?.soma), tipo: tipoDano });
  }

  let danoProprio: number | undefined;
  if (ef.proprio) {
    const r = rolar(ef.proprio, sortear)!;
    danoProprio = r.total;
    rolagens.push({ rotulo: 'Dano em você', r, tipo: 'proprio' });
  }

  return { rolagens, resistencia: previa.resistencia, nota: ef.nota, danoProprio };
}

/* ---------------- atalhos ---------------- */

export function efeitoHabilidade(p: Personagem, habId: string): EfeitoPoder | null {
  const nv = p.habs.find((h) => h.id === habId)?.nv ?? 1;
  return PODERES_HAB[habId]?.(nv) ?? null;
}
export function efeitoDespertar(p: Personagem, usoId: string): EfeitoPoder | null {
  return PODERES_DESP[`${p.despertar.id}.${usoId}`]?.(p.despertar.nv) ?? null;
}
