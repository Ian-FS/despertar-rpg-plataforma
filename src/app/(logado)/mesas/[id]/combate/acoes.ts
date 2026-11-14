'use server';
/* Rastreador de combate. O Mestre inicia, passa a vez e encerra; quem está na vez pode encerrar o
   próprio turno. A iniciativa é rolada aqui (registro da mesa) e o "Início do turno" das fichas
   dispara sozinho quando chega a vez delas. */
import {
  ErroFicha,
  contextoMesa,
  exigir,
  gravarFicha,
  registrarRolagens,
  type ContextoMesa,
} from '@/lib/fichas/contexto';
import { enviarDiscord } from '@/lib/discord';
import { clienteAdmin } from '@/lib/supabase/admin';
import type { FichaLinha } from '@/lib/supabase/tipos-banco';
import { CATEGORIAS_AMEACA, iniAmeaca, nivelValido, statsAmeaca } from '@/regras/ameacas';
import {
  COMBATE_VAZIO,
  pressao,
  iniciarCombate,
  naVez,
  ordenar,
  proximaVez,
  removerCombatente,
  type Avanco,
  type Combatente,
  type EstadoCombate,
} from '@/regras/combate';
import { computarFicha } from '@/regras/ficha';
import { aplicarEvento, type Evento } from '@/regras/gatilhos';
import type { Personagem } from '@/regras/personagem';
import { dobrarDados } from '@/regras/poderes';
import { d20Natural, rolar, sortearCrypto } from '@/regras/rolagem';
import type { CategoriaAmeaca } from '@/regras/tipos';
import { normalizarPersonagem } from '@/regras/validacao';

export interface ResultadoCombate {
  erro?: string;
  /** o que aconteceu (início de turno, passivas), para mostrar na tela */
  linhas?: string[];
}

export interface NovoInimigo {
  nome: string;
  /** bônus de iniciativa; ausente = metade do nível (ameaça) ou 0 */
  ini?: number;
  /** PV; ausente = o da tabela de ameaças */
  pv?: number;
  /** Ações Principais; ausente = o da tabela */
  acoes?: number;
  surpreso?: boolean;
  /** quantos iguais (Lobo 1, Lobo 2…) */
  qtd?: number;
  /** ameaça da tabela do capítulo 13: nível e categoria dão os números */
  nivel?: number;
  cat?: CategoriaAmeaca;
  /** traços (bestiário ou do Mestre) */
  traco?: string;
}

const ERRO_BANCO = 'O servidor não conseguiu acessar o banco. Tente de novo.';

async function tentar(fn: () => Promise<ResultadoCombate>): Promise<ResultadoCombate> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ErroFicha) return { erro: e.message };
    throw e;
  }
}

async function carregar(mesaId: string): Promise<{ estado: EstadoCombate; versao: number | null }> {
  const { data } = exigir(await clienteAdmin().from('combates').select('estado, versao').eq('mesa_id', mesaId).maybeSingle(), ERRO_BANCO);
  return data ? { estado: data.estado, versao: data.versao } : { estado: COMBATE_VAZIO, versao: null };
}

/** Grava só se ninguém gravou no meio (versão igual); senão pede para tentar de novo. */
async function gravar(mesaId: string, estado: EstadoCombate, versao: number | null) {
  const admin = clienteAdmin();
  const agora = new Date().toISOString();
  if (versao === null) {
    exigir(await admin.from('combates').upsert({ mesa_id: mesaId, estado, versao: 1, atualizado_em: agora }), ERRO_BANCO);
    return;
  }
  const { data } = exigir(
    await admin.from('combates').update({ estado, versao: versao + 1, atualizado_em: agora }).eq('mesa_id', mesaId).eq('versao', versao).select('versao'),
    ERRO_BANCO,
  );
  if (!data?.length) throw new ErroFicha('Alguém mexeu no combate ao mesmo tempo. Confira a tela e tente de novo.');
}

function exigirMestre(ctx: ContextoMesa) {
  if (!ctx.souMestre) throw new ErroFicha('Só o Mestre controla o combate.');
}

async function fichasDaMesa(mesaId: string, ids: string[]): Promise<FichaLinha[]> {
  if (!ids.length) return [];
  const { data } = exigir(await clienteAdmin().from('fichas').select('*').eq('mesa_id', mesaId).in('id', ids), ERRO_BANCO);
  return data ?? [];
}

const nomeDe = (p: Personagem) => p.nome?.trim() || 'Sem nome';

/** Dispara um evento (início do turno, fim do combate) numa ficha e grava. */
async function eventoNaFicha(ctx: ContextoMesa, ficha: FichaLinha, evento: Evento): Promise<string[]> {
  const p = normalizarPersonagem(ficha.dados as Personagem);
  const res = aplicarEvento(p, evento);
  await gravarFicha(ficha.id, p);
  await registrarRolagens({ ...ctx, ficha }, res.rolagens.map((x) => ({ rotulo: `Início do turno · ${x.rotulo}`, r: x.r })));
  return res.linhas.length ? [`${nomeDe(p)}: ${res.linhas.join(' ')}`] : [];
}

/** Depois de passar a vez: nova rodada atualiza as Ações; início de turno dispara a ficha. */
async function aplicarAvanco(ctx: ContextoMesa, av: Avanco): Promise<{ estado: EstadoCombate; linhas: string[] }> {
  let estado = av.estado;
  const linhas: string[] = [];
  const idsFichas = estado.combatentes.filter((c) => c.fichaId).map((c) => c.fichaId!);
  const quem = av.inicioTurno ? estado.combatentes.find((c) => c.uid === av.inicioTurno) : null;
  if (av.novaRodada || quem?.fichaId) {
    const fichas = await fichasDaMesa(ctx.mesaId, av.novaRodada ? idsFichas : [quem!.fichaId!]);
    if (av.novaRodada) {
      linhas.push(`Rodada ${estado.rodada}.`);
      // Fúria, Formas e afins mudam as Ações Principais: confere a cada rodada
      const acoes = new Map(fichas.map((f) => [f.id, computarFicha(normalizarPersonagem(f.dados as Personagem)).acoes]));
      estado = { ...estado, combatentes: estado.combatentes.map((c) => (c.fichaId && acoes.has(c.fichaId) ? { ...c, acoes: acoes.get(c.fichaId)! } : c)) };
    }
    const ficha = quem?.fichaId ? fichas.find((f) => f.id === quem.fichaId) : undefined;
    if (ficha) linhas.push(...(await eventoNaFicha(ctx, ficha, 'inicioTurno')));
  }
  return { estado, linhas };
}

/** Rola a iniciativa de uma ficha (registro da mesa) e monta o combatente. */
async function combatenteDaFicha(ctx: ContextoMesa, ficha: FichaLinha, surpreso = false): Promise<Combatente> {
  const p = normalizarPersonagem(ficha.dados as Personagem);
  const f = computarFicha(p);
  const r = rolar(`1d20${f.ini >= 0 ? '+' : ''}${f.ini}`, sortearCrypto)!;
  await registrarRolagens({ ...ctx, ficha }, [{ rotulo: 'Iniciativa', r }]);
  return {
    uid: `f:${ficha.id}`,
    nome: nomeDe(p),
    tipo: 'ficha',
    fichaId: ficha.id,
    donoId: ficha.dono_id,
    iniciativa: r.total,
    desempate: f.m.AGI,
    acoes: f.acoes,
    reacoes: 0,
    surpreso,
  };
}

/** Monta os inimigos (Lobo 1, Lobo 2…) e rola a iniciativa de cada um. */
async function criarInimigos(ctx: ContextoMesa, lista: NovoInimigo[]): Promise<Combatente[]> {
  const r: Combatente[] = [];
  const rolagens = [];
  const marca = Date.now().toString(36);
  for (const [i, ini] of lista.entries()) {
    const qtd = Math.min(20, Math.max(1, Math.trunc(Number(ini.qtd) || 1)));
    const cat = ini.cat && CATEGORIAS_AMEACA.includes(ini.cat) ? ini.cat : null;
    const nivel = nivelValido(Number(ini.nivel));
    const st = cat ? statsAmeaca(nivel, cat) : null;
    const num = (v: unknown, padrao: number) => (v === undefined || v === null || v === '' || Number.isNaN(Number(v)) ? padrao : Math.trunc(Number(v)));
    const bonus = num(ini.ini, cat ? iniAmeaca(nivel) : 0);
    const pv = Math.max(1, num(ini.pv, st?.pv ?? 10));
    const acoes = Math.min(10, Math.max(1, num(ini.acoes, st?.acoes ?? 1)));
    const ameaca = st && cat ? { nivel, cat, atk: st.atk, reac: st.reac, defFixa: st.defFixa, dano: st.dano, rd: st.rd, cd: st.cd, res: st.res, traco: String(ini.traco ?? '').slice(0, 300) || undefined } : undefined;
    for (let n = 1; n <= qtd; n++) {
      const nome = (String(ini.nome ?? '').trim().slice(0, 40) || 'Inimigo') + (qtd > 1 ? ` ${n}` : '');
      const rol = rolar(`1d20${bonus >= 0 ? '+' : ''}${bonus}`, sortearCrypto)!;
      rolagens.push({ rotulo: `Iniciativa · ${nome}`, r: rol });
      r.push({
        uid: `i:${marca}.${i}.${n}`,
        nome,
        tipo: 'inimigo',
        iniciativa: rol.total,
        desempate: bonus,
        acoes,
        reacoes: 0,
        surpreso: !!ini.surpreso,
        pv,
        pvMax: pv,
        ameaca,
      });
    }
  }
  await registrarRolagens(ctx, rolagens);
  return r;
}

/* ---------------- ações ---------------- */

export async function iniciarCombateAcao(
  mesaId: string,
  pedido: { fichas: { id: string; surpreso?: boolean }[]; inimigos: NovoInimigo[] },
): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    exigirMestre(ctx);
    const atual = await carregar(mesaId);
    if (atual.estado.ativo) return { erro: 'Já existe um combate em andamento. Encerre antes de começar outro.' };

    const combatentes: Combatente[] = [];
    for (const ficha of await fichasDaMesa(mesaId, pedido.fichas.map((x) => x.id)))
      combatentes.push(await combatenteDaFicha(ctx, ficha, !!pedido.fichas.find((x) => x.id === ficha.id)?.surpreso));
    combatentes.push(...(await criarInimigos(ctx, pedido.inimigos ?? [])));
    if (!combatentes.length) return { erro: 'Escolha ao menos um participante.' };

    const { estado, linhas } = await aplicarAvanco(ctx, iniciarCombate(combatentes));
    await gravar(mesaId, estado, atual.versao);
    enviarDiscord(mesaId, [
      { nome: 'Sistema', texto: `⚔ **Combate iniciado.** Ordem: ${estado.combatentes.map((c) => `${c.nome} (${c.iniciativa})`).join(' → ')}` },
    ]);
    return { linhas: ['Combate iniciado.', ...linhas] };
  });
}

/** Passa a vez. Pode o Mestre ou o dono da ficha que está na vez. */
export async function proximaVezAcao(mesaId: string, vezEsperada: { uid: string; passada: number } | null): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    const { estado, versao } = await carregar(mesaId);
    if (!estado.ativo) return { erro: 'Não há combate em andamento.' };
    const atual = naVez(estado);
    if (!ctx.souMestre && atual?.donoId !== ctx.usuarioId) return { erro: 'Só o Mestre ou quem está na vez pode passar o turno.' };
    // o botão foi clicado olhando uma vez que já passou (outra pessoa passou antes)
    if (vezEsperada && (estado.vez?.uid !== vezEsperada.uid || estado.vez?.passada !== vezEsperada.passada)) return { erro: 'A vez já tinha passado.' };
    const r = await aplicarAvanco(ctx, proximaVez(estado));
    await gravar(mesaId, r.estado, versao);
    if (r.estado.rodada !== estado.rodada) enviarDiscord(mesaId, [{ nome: 'Sistema', texto: `⚔ **Rodada ${r.estado.rodada}**` }]);
    return { linhas: r.linhas };
  });
}

/** Marca uma Reação (sobe a Pressão). O Mestre marca de qualquer um; o jogador, a dele. delta −1 desfaz. */
export async function reacaoAcao(mesaId: string, uid: string, delta: 1 | -1): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    const { estado, versao } = await carregar(mesaId);
    const c = estado.combatentes.find((x) => x.uid === uid);
    if (!estado.ativo || !c) return { erro: 'Combatente não encontrado.' };
    if (!ctx.souMestre && c.donoId !== ctx.usuarioId) return { erro: 'Você só marca as Reações do seu personagem.' };
    const combatentes = estado.combatentes.map((x) => (x.uid === uid ? { ...x, reacoes: Math.max(0, x.reacoes + delta) } : x));
    await gravar(mesaId, { ...estado, combatentes }, versao);
    return {};
  });
}

/** O Mestre ajusta os PV de um inimigo (dano negativo, cura positivo). */
export async function pvInimigoAcao(mesaId: string, uid: string, delta: number): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    exigirMestre(ctx);
    const { estado, versao } = await carregar(mesaId);
    const d = Math.trunc(Number(delta) || 0);
    const linhas: string[] = [];
    const combatentes = estado.combatentes.map((x) => {
      if (x.uid !== uid || x.tipo !== 'inimigo') return x;
      const pv = Math.min(x.pvMax ?? Infinity, (x.pv ?? 0) + d);
      // Chefe: segunda fase aos 50% dos PV, com +1 Ação Principal (capítulo 13)
      if (x.ameaca?.cat === 'Chefe' && !x.ameaca.fase2 && pv <= (x.pvMax ?? 0) / 2 && pv > 0) {
        linhas.push(`${x.nome} entra na 2ª fase: +1 Ação Principal.`);
        return { ...x, pv, acoes: x.acoes + 1, ameaca: { ...x.ameaca, fase2: true } };
      }
      if (pv <= 0 && (x.pv ?? 0) > 0) linhas.push(`${x.nome} caiu.`);
      return { ...x, pv };
    });
    await gravar(mesaId, { ...estado, combatentes }, versao);
    if (linhas.length) enviarDiscord(mesaId, [{ nome: 'Sistema', texto: `⚔ ${linhas.join(' ')}` }]);
    return { linhas };
  });
}

export type RolagemInimigo = 'ataque' | 'reacao' | 'resistencia';

/**
 * O Mestre rola por um inimigo da tabela de ameaças: ataque (e dano), Reação (com a Pressão, e
 * conta a Reação) ou Resistência. Lacaio não rola Reação: usa a Defesa Fixa.
 */
export async function rolarInimigoAcao(mesaId: string, uid: string, tipo: RolagemInimigo): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    exigirMestre(ctx);
    const { estado, versao } = await carregar(mesaId);
    const c = estado.combatentes.find((x) => x.uid === uid);
    const a = c?.ameaca;
    if (!estado.ativo || !c || !a) return { erro: 'Inimigo sem números da tabela de ameaças.' };
    const d20 = (b: number) => `1d20${b >= 0 ? '+' : ''}${b}`;
    if (tipo === 'ataque') {
      const atk = rolar(d20(a.atk), sortearCrypto)!;
      const nat = d20Natural(atk);
      const itens = [{ rotulo: `Ataque${nat === 1 ? ' (1 natural: erra)' : ''}`, r: atk }];
      if (nat !== 1) {
        const crit = nat === 20;
        itens.push({ rotulo: crit ? 'Dano (crítico)' : 'Dano', r: rolar(crit ? dobrarDados(a.dano) : a.dano, sortearCrypto)! });
      }
      await registrarRolagens(ctx, itens, false, c.nome);
      return { linhas: [`${c.nome}: ataque ${atk.total}${itens[1] ? `, dano ${itens[1].r.total}` : ''}.`] };
    }
    if (tipo === 'resistencia') {
      const r = rolar(d20(a.res), sortearCrypto)!;
      await registrarRolagens(ctx, [{ rotulo: 'Resistência', r }], false, c.nome);
      return { linhas: [`${c.nome}: Resistência ${r.total}.`] };
    }
    if (a.cat === 'Lacaio') return { linhas: [`${c.nome} é Lacaio: não rola Reação, usa a Defesa Fixa ${a.defFixa}.`] };
    const pen = pressao(c);
    const r = rolar(d20(a.reac + pen), sortearCrypto)!;
    await registrarRolagens(ctx, [{ rotulo: `Reação${pen ? ` (Pressão ${pen})` : ''}`, r }], false, c.nome);
    const combatentes = estado.combatentes.map((x) => (x.uid === uid ? { ...x, reacoes: x.reacoes + 1 } : x));
    await gravar(mesaId, { ...estado, combatentes }, versao);
    return { linhas: [`${c.nome}: Reação ${r.total}.`] };
  });
}

/** Entra alguém no meio do combate (rola a iniciativa e encaixa na ordem). */
export async function adicionarCombatenteAcao(mesaId: string, novo: { fichaId?: string; inimigo?: NovoInimigo }): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    exigirMestre(ctx);
    const { estado, versao } = await carregar(mesaId);
    if (!estado.ativo) return { erro: 'Não há combate em andamento.' };
    const extra: Combatente[] = [];
    if (novo.fichaId) {
      if (estado.combatentes.some((c) => c.fichaId === novo.fichaId)) return { erro: 'Esse personagem já está no combate.' };
      const [ficha] = await fichasDaMesa(mesaId, [novo.fichaId]);
      if (!ficha) return { erro: 'Ficha não encontrada.' };
      extra.push(await combatenteDaFicha(ctx, ficha));
    } else if (novo.inimigo) extra.push(...(await criarInimigos(ctx, [novo.inimigo])));
    if (!extra.length) return { erro: 'Nada para adicionar.' };
    await gravar(mesaId, { ...estado, combatentes: ordenar([...estado.combatentes, ...extra]) }, versao);
    return {};
  });
}

/** Tira alguém do combate (derrotado, fugiu). Se era a vez dele, a vez passa. */
export async function removerCombatenteAcao(mesaId: string, uid: string): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    exigirMestre(ctx);
    const { estado, versao } = await carregar(mesaId);
    const r = await aplicarAvanco(ctx, removerCombatente(estado, uid));
    await gravar(mesaId, r.estado, versao);
    return { linhas: r.linhas };
  });
}

/** Fim do combate: encerra os efeitos ativos e libera os usos "por combate" de todas as fichas. */
export async function encerrarCombateAcao(mesaId: string): Promise<ResultadoCombate> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    exigirMestre(ctx);
    const { estado, versao } = await carregar(mesaId);
    if (!estado.ativo) return { erro: 'Não há combate em andamento.' };
    const fichas = await fichasDaMesa(mesaId, estado.combatentes.filter((c) => c.fichaId).map((c) => c.fichaId!));
    for (const ficha of fichas) {
      const p = normalizarPersonagem(ficha.dados as Personagem);
      aplicarEvento(p, 'fimCombate');
      await gravarFicha(ficha.id, p);
    }
    await gravar(mesaId, COMBATE_VAZIO, versao);
    enviarDiscord(mesaId, [{ nome: 'Sistema', texto: '⚔ **Combate encerrado.**' }]);
    return { linhas: ['Combate encerrado: efeitos ativos terminaram e os usos "por combate" foram liberados.'] };
  });
}
