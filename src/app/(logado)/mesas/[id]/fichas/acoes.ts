'use server';
/* Ações de ficha: criar, sortear (no servidor, com registro), escolher, salvar, subir de nível.
   Permissão e regras são conferidas aqui; o navegador nunca grava direto no banco. */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  ErroFicha,
  contextoFicha,
  contextoMesa,
  exigir,
  gravarFicha,
  registrarSorteio,
  semLiberacao,
  sorteioPermitido,
  type ContextoFicha,
} from '@/lib/fichas/contexto';
import { clienteAdmin } from '@/lib/supabase/admin';
import type { EtapaFicha, RegrasMesa } from '@/lib/supabase/tipos-banco';
import {
  aplicarAtributos,
  aplicarAvaliacao,
  aplicarDespertar,
  aplicarSubidaNivel,
  atributosMetodoPadrao,
  exigeProvacao,
  podeSubirNivel,
  sortearAtributos,
  sortearAvaliacao,
  sortearDespertar,
  sortearSubidaNivel,
  validarMetodoPadrao,
} from '@/regras/criacao';
import type { DadosNivel } from '@/componentes/efeitos/revelacoes';
import type { SorteioAtributos } from '@/regras/criacao';
import { ARMAS } from '@/regras/dados';
import { computarFicha, condicoesAtivas, possui } from '@/regras/ficha';
import { HAB } from '@/regras/dados';
import { custoUso, PAGA_PM_COM_PV, usosDoDespertar } from '@/regras/despertar-usos';
import { aplicarCompra, aplicarVenda, precoPedido, validarPedido, type Pedido } from '@/regras/loja';
import { novoPersonagem, type Personagem } from '@/regras/personagem';
import { chavesDespertar, chavesHabilidade, efeitoDespertar, efeitoHabilidade, resolverPoder, type EfeitoPoder, type ResultadoPoder } from '@/regras/poderes';
import { rolar, sortearCrypto, type Rolagem } from '@/regras/rolagem';
import { ATRIBUTO_IDS, RANK_IDS, type AtributoId, type Rank } from '@/regras/tipos';
import { mesclarEdicaoJogador, normalizarPersonagem, resumoFicha, validarFicha } from '@/regras/validacao';

export interface Resultado {
  erro?: string;
  erros?: string[];
  /** resultados para a tela animar */
  atributos?: SorteioAtributos;
  despertar?: { d100: number[]; opcoes: string[] };
  nivel?: DadosNivel;
}

const caminhoFicha = (ctx: { mesaId: string; ficha: { id: string } }) => `/mesas/${ctx.mesaId}/fichas/${ctx.ficha.id}`;

async function tentar<T extends Resultado>(fn: () => Promise<T>): Promise<T | Resultado> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ErroFicha) return { erro: e.message };
    throw e;
  }
}

const distribuido = (p: Personagem) => ATRIBUTO_IDS.reduce((t, a) => t + p.atr[a] - p.atrBase[a], 0);

/* ---------------- criar e organizar ---------------- */

export async function criarFicha(mesaId: string, _anterior: Resultado, form: FormData): Promise<Resultado> {
  let destino = '';
  const r = await tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    const nome = String(form.get('nome') ?? '').trim().slice(0, 80);
    if (!nome) return { erro: 'Dê um nome ao personagem.' };
    const arma = String(form.get('arma') ?? 'Espada');
    const p = novoPersonagem(ARMAS.some((a) => a.n === arma) ? arma : 'Espada');
    p.nome = nome;
    p.idade = String(form.get('idade') ?? '').slice(0, 20);
    p.ocupacao = String(form.get('ocupacao') ?? '').slice(0, 80);
    p.motivo = String(form.get('motivo') ?? '').slice(0, 500);

    const admin = clienteAdmin();
    exigir(
      await admin.from('fichas').update({ ativa: false }).eq('mesa_id', mesaId).eq('dono_id', ctx.usuarioId).eq('tipo', 'jogador'),
      'Não foi possível criar a ficha. Tente de novo.',
    );
    const { data, error } = await admin
      .from('fichas')
      .insert({ mesa_id: mesaId, dono_id: ctx.usuarioId, dados: p, resumo: resumoFicha(p), etapa: 'atributos', ativa: true })
      .select('id')
      .single();
    if (error || !data) return { erro: 'Não foi possível criar a ficha. Tente de novo.' };
    destino = `/mesas/${mesaId}/fichas/${data.id}`;
    return {};
  });
  if (destino) redirect(destino);
  return r;
}

export async function ativarFicha(fichaId: string): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const admin = clienteAdmin();
    const msg = 'Não foi possível ativar a ficha. Tente de novo.';
    exigir(await admin.from('fichas').update({ ativa: false }).eq('mesa_id', ctx.mesaId).eq('dono_id', ctx.ficha.dono_id).eq('tipo', 'jogador'), msg);
    exigir(await admin.from('fichas').update({ ativa: true }).eq('id', fichaId), msg);
    revalidatePath(`/mesas/${ctx.mesaId}`);
    return {};
  });
}

export async function excluirFicha(fichaId: string): Promise<Resultado> {
  let destino = '';
  const r = await tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    exigir(await clienteAdmin().from('fichas').delete().eq('id', fichaId), 'Não foi possível excluir a ficha.');
    destino = `/mesas/${ctx.mesaId}`;
    return {};
  });
  if (destino) redirect(destino);
  return r;
}

/* ---------------- sorteios da criação ---------------- */

async function avancar(ctx: ContextoFicha, de: EtapaFicha, para: EtapaFicha): Promise<EtapaFicha> {
  return ctx.ficha.etapa === de ? para : ctx.ficha.etapa;
}

export async function sortearAtributosAcao(fichaId: string): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    if (ctx.regras.metodoPadrao) return { erro: 'Esta mesa usa o Método Padrão: distribua 7, 7, 6, 6, 5 e 4.' };
    if (!(await sorteioPermitido(ctx, 'atributos'))) return { erro: 'Os atributos já foram sorteados. Peça ao Mestre para liberar outro sorteio.' };
    const r = sortearAtributos(sortearCrypto);
    const p = ctx.p;
    p.statusPend += distribuido(p); // se for um novo sorteio, devolve os pontos já distribuídos
    aplicarAtributos(p, r.atr, { ph: r.potencial.ph, st: r.potencial.st }, r.potencial.n);
    await registrarSorteio(ctx, 'atributos', r);
    await gravarFicha(fichaId, p, { etapa: await avancar(ctx, 'atributos', 'despertar'), sorteios_liberados: semLiberacao(ctx, 'atributos') });
    revalidatePath(caminhoFicha(ctx));
    return { atributos: r };
  });
}

export async function metodoPadraoAcao(fichaId: string, bonus: Record<AtributoId, number>): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    if (!ctx.regras.metodoPadrao) return { erro: 'Esta mesa usa atributos sorteados.' };
    if (ctx.ficha.etapa !== 'atributos' && !ctx.ficha.sorteios_liberados.includes('atributos'))
      return { erro: 'Os atributos já foram definidos. Peça ao Mestre para liberar.' };
    if (!validarMetodoPadrao(bonus)) return { erro: 'Use exatamente os valores 7, 7, 6, 6, 5 e 4, um em cada atributo.' };
    const p = ctx.p;
    p.statusPend += distribuido(p);
    aplicarAtributos(p, atributosMetodoPadrao(bonus), { ph: 0, st: 0 }, 'Padrão');
    await registrarSorteio(ctx, 'atributos', { metodoPadrao: true, bonus });
    await gravarFicha(fichaId, p, { etapa: await avancar(ctx, 'atributos', 'despertar'), sorteios_liberados: semLiberacao(ctx, 'atributos') });
    revalidatePath(caminhoFicha(ctx));
    return {};
  });
}

export async function sortearDespertarAcao(fichaId: string): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    if (ctx.ficha.etapa === 'conceito' || ctx.ficha.etapa === 'atributos') return { erro: 'Defina os atributos primeiro.' };
    if (!(await sorteioPermitido(ctx, 'despertar'))) return { erro: 'O Despertar já foi sorteado. Peça ao Mestre para liberar outro sorteio.' };
    const rolagens = ctx.regras.escolhaGuiada ? [sortearDespertar(sortearCrypto), sortearDespertar(sortearCrypto)] : [sortearDespertar(sortearCrypto)];
    const opcoes = rolagens.map((r) => r.despertar.id);
    const unico = new Set(opcoes).size === 1;
    await registrarSorteio(ctx, 'despertar', { d100: rolagens.map((r) => r.d100), opcoes, escolhida: unico ? opcoes[0] : null });
    const p = ctx.p;
    if (unico) aplicarDespertar(p, opcoes[0]);
    await gravarFicha(fichaId, p, {
      etapa: unico ? await avancar(ctx, 'despertar', 'avaliacao') : ctx.ficha.etapa,
      sorteios_liberados: semLiberacao(ctx, 'despertar'),
    });
    revalidatePath(caminhoFicha(ctx));
    return { despertar: { d100: rolagens.map((r) => r.d100), opcoes } };
  });
}

/** Sorteio pendente de escolha (Despertar da Escolha Guiada ou Avaliação do Sistema). */
async function sorteioPendente(ctx: ContextoFicha, tipo: string) {
  const { data } = exigir(
    await clienteAdmin()
      .from('sorteios')
      .select('*')
      .eq('ficha_id', ctx.ficha.id)
      .eq('tipo', tipo)
      .order('criado_em', { ascending: false })
      .limit(1)
      .maybeSingle(),
    'Não foi possível conferir os sorteios. Tente de novo.',
  );
  return data && data.resultado?.escolhida == null ? data : null;
}

export async function escolherDespertarAcao(fichaId: string, despertarId: string): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const pendente = await sorteioPendente(ctx, 'despertar');
    if (!pendente || !pendente.resultado.opcoes.includes(despertarId)) return { erro: 'Escolha um dos Despertares sorteados.' };
    exigir(
      await clienteAdmin().from('sorteios').update({ resultado: { ...pendente.resultado, escolhida: despertarId } }).eq('id', pendente.id),
      'Não foi possível registrar a escolha. Tente de novo.',
    );
    aplicarDespertar(ctx.p, despertarId);
    await gravarFicha(fichaId, ctx.p, { etapa: await avancar(ctx, 'despertar', 'avaliacao') });
    revalidatePath(caminhoFicha(ctx));
    return {};
  });
}

export async function sortearAvaliacaoAcao(fichaId: string): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    if (ctx.ficha.etapa !== 'avaliacao') return { erro: 'A Avaliação inicial é feita depois do Despertar.' };
    if (await sorteioPendente(ctx, 'avaliacao')) return {};
    if (!(await sorteioPermitido(ctx, 'avaliacao'))) return { erro: 'A Avaliação já foi feita.' };
    const opcoes = sortearAvaliacao(sortearCrypto, 'E', ctx.p).map((h) => h.id);
    await registrarSorteio(ctx, 'avaliacao', { rank: 'E', opcoes, escolhida: null });
    revalidatePath(caminhoFicha(ctx));
    return {};
  });
}

export async function escolherAvaliacaoAcao(fichaId: string, habId: string): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const pendente = await sorteioPendente(ctx, 'avaliacao');
    if (!pendente || !pendente.resultado.opcoes.includes(habId)) return { erro: 'Escolha uma das habilidades sorteadas.' };
    exigir(
      await clienteAdmin().from('sorteios').update({ resultado: { ...pendente.resultado, escolhida: habId } }).eq('id', pendente.id),
      'Não foi possível registrar a escolha. Tente de novo.',
    );
    aplicarAvaliacao(ctx.p, habId);
    await gravarFicha(fichaId, ctx.p, { etapa: await avancar(ctx, 'avaliacao', 'pronta') });
    revalidatePath(caminhoFicha(ctx));
    return {};
  });
}

/* ---------------- edição e progressão ---------------- */

export interface ResultadoSalvar extends Resultado {
  ok?: boolean;
}

export async function salvarFicha(fichaId: string, edicao: unknown): Promise<ResultadoSalvar> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    let depois: Personagem;
    if (ctx.souMestre) {
      // o Mestre pode ajustar qualquer campo (nível, XP, PH extra, Títulos…)
      depois = normalizarPersonagem({ ...ctx.p, ...(edicao as Partial<Personagem>) });
    } else {
      depois = mesclarEdicaoJogador(ctx.p, edicao);
      const erros = validarFicha(ctx.p, depois);
      if (erros.length) return { erros };
    }
    await gravarFicha(fichaId, depois);
    return { ok: true };
  });
}

export async function subirNivelAcao(fichaId: string): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const p = ctx.p;
    if (ctx.ficha.etapa !== 'pronta') return { erro: 'Termine a criação do personagem primeiro.' };
    if (p.nivel >= 30) return { erro: 'Nível máximo.' };
    if (!ctx.souMestre && ctx.regras.marcos) return { erro: 'Esta mesa usa Marcos: o Mestre decide quando o grupo sobe.' };
    if (!podeSubirNivel(p, ctx.regras)) return { erro: `Faltam ${p.nivel * 10 - p.xp} XP para o próximo nível.` };
    if (!ctx.souMestre && exigeProvacao(p.nivel, ctx.regras))
      return { erro: 'Para passar deste nível é preciso vencer a Provação de Ascensão. O Mestre libera.' };
    if (await sorteioPendente(ctx, 'avaliacao')) return { erro: 'Escolha a habilidade da Avaliação do Sistema antes de subir de novo.' };

    const antes = computarFicha(p);
    const r = sortearSubidaNivel(sortearCrypto, p);
    aplicarSubidaNivel(p, r, ctx.regras);
    const depois = computarFicha(p);
    await registrarSorteio(ctx, 'nivel', r);
    if (r.novoRank && r.avaliacao.length) await registrarSorteio(ctx, 'avaliacao', { rank: r.novoRank, opcoes: r.avaliacao, escolhida: null });
    await gravarFicha(fichaId, p);
    revalidatePath(caminhoFicha(ctx));
    return {
      nivel: {
        nivelAntes: antes.nivel,
        nivelDepois: depois.nivel,
        status: r.status,
        ph: r.ph,
        novoRank: r.novoRank,
        pv: [antes.pvMax, depois.pvMax],
        pm: [antes.pmMax, depois.pmMax],
        acoes: [antes.acoes, depois.acoes],
      },
    };
  });
}

/* ---------------- uso em jogo (rolado e aplicado pelo servidor) ---------------- */

/** Campos que o servidor mudou, para a tela atualizar sem perder o rascunho do jogador. */
export interface MudancaFicha {
  pvAtual: number | null;
  pmAtual: number | null;
  itens: Personagem['itens'];
  condicoes: string;
  ouro: number;
}

export interface ResultadoUso extends Resultado {
  mudanca?: MudancaFicha;
  rolagem?: Rolagem;
  mensagem?: string;
  /** rolagens de ataque, dano e a CD de um poder usado */
  poder?: ResultadoPoder;
}

/** Rola o poder e desconta o dano que o próprio usuário sofre (ex.: Sobrecarga). */
function rolarPoder(p: Personagem, ef: EfeitoPoder | null, chaves: AtributoId[]): ResultadoPoder | undefined {
  if (!ef) return undefined;
  const res = resolverPoder(p, ef, chaves);
  if (res.danoProprio) p.pvAtual = (p.pvAtual ?? computarFicha(p).pvMax) - res.danoProprio;
  return res;
}

const mudancaDe = (p: Personagem): MudancaFicha => ({ pvAtual: p.pvAtual, pmAtual: p.pmAtual, itens: p.itens, condicoes: p.condicoes, ouro: p.ouro });

export async function usarConsumivel(fichaId: string, itemUid: string): Promise<ResultadoUso> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const p = ctx.p;
    const it = p.itens.find((i) => i.uid === itemUid);
    if (!it || it.cat !== 'consumivel') return { erro: 'Item não encontrado no inventário.' };
    if (!it.usoDado || !it.usoAlvo) return { erro: 'Este item não tem efeito automático. Avise o Mestre ao usar.' };
    const r = rolar(it.usoDado, sortearCrypto);
    if (!r) return { erro: 'Fórmula do item inválida.' };
    const f = computarFicha(p);
    const campo = it.usoAlvo === 'pm' ? 'pmAtual' : 'pvAtual';
    const max = it.usoAlvo === 'pm' ? f.pmMax : f.pvMax;
    const atual = p[campo] ?? max;
    const novo = Math.min(max, atual + r.total);
    p[campo] = novo;
    it.qtd = (it.qtd ?? 1) - 1;
    if (it.qtd <= 0) p.itens = p.itens.filter((i) => i.uid !== itemUid);
    await gravarFicha(fichaId, p);
    return {
      mudanca: mudancaDe(p),
      rolagem: r,
      mensagem: `${it.nome}: +${novo - atual} ${it.usoAlvo.toUpperCase()} (${atual} → ${novo})`,
    };
  });
}

/** Gasta o PM de uma habilidade ativa. Sem PM suficiente, pode pagar o dobro em PV e ficar Exausto. */
/**
 * Paga o custo em PM. Sem PM suficiente: Exaustão de Mana (dobro em PV e fica Exausto), ou,
 * com a Hemomancia, paga o mesmo valor em PV sem Exaustão. Devolve a mensagem, ou um erro.
 */
function pagarPM(p: Personagem, nome: string, custo: number, pagarComPV: boolean): { mensagem?: string; erro?: string } {
  const f = computarFicha(p);
  const pm = p.pmAtual ?? f.pmMax;
  const pv = p.pvAtual ?? f.pvMax;
  if (custo <= 0) return { mensagem: `${nome}: sem custo de PM.` };
  if (pm >= custo) {
    p.pmAtual = pm - custo;
    return { mensagem: `${nome}: −${custo} PM (${pm} → ${p.pmAtual})` };
  }
  if (!pagarComPV) return { erro: `PM insuficiente: ${nome} custa ${custo} PM e você tem ${pm}.` };
  if (PAGA_PM_COM_PV.has(p.despertar.id)) {
    p.pvAtual = pv - custo;
    return { mensagem: `Hemomancia: ${nome} custou ${custo} PV (${pv} → ${p.pvAtual}).` };
  }
  p.pvAtual = pv - 2 * custo;
  const conds = condicoesAtivas(p);
  if (!conds.includes('Exausto')) p.condicoes = [...conds, 'Exausto'].join(', ');
  return { mensagem: `Exaustão de Mana: ${nome} custou ${2 * custo} PV (${pv} → ${p.pvAtual}). Você está Exausto.` };
}

/** Gasta o PM de uma habilidade ativa. */
export async function usarHabilidade(fichaId: string, habId: string, pagarComPV = false): Promise<ResultadoUso> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const p = ctx.p;
    const h = HAB[habId];
    if (!h || !possui(p, habId)) return { erro: 'Você não tem essa habilidade.' };
    if (h.tipo !== 'Ativa' || !h.pm) return { erro: 'Essa habilidade não gasta PM.' };
    const r = pagarPM(p, h.n, h.pm, pagarComPV);
    if (r.erro) return { erro: r.erro };
    const poder = rolarPoder(p, efeitoHabilidade(p, habId), chavesHabilidade(habId));
    await gravarFicha(fichaId, p);
    return { mudanca: mudancaDe(p), mensagem: r.mensagem, poder };
  });
}

/** Usa um poder do Despertar (custo cadastrado em despertar-usos.ts). */
export async function usarDespertar(fichaId: string, usoId: string, rank: Rank = 'E', pagarComPV = false): Promise<ResultadoUso> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const p = ctx.p;
    const uso = usosDoDespertar(p).find((x) => x.id === usoId);
    if (!uso) return { erro: 'Esse poder não existe no seu Despertar.' };
    if (!uso.liberado) return { erro: `Ainda bloqueado: ${uso.motivo}.` };
    if (!RANK_IDS.includes(rank)) return { erro: 'Rank inválido.' };
    const custo = custoUso(p, uso, rank);
    const nome = uso.porRank ? `${uso.nome} (Rank ${rank})` : uso.nome;
    const r = pagarPM(p, nome, custo, pagarComPV);
    if (r.erro) return { erro: r.erro };
    const poder = rolarPoder(p, efeitoDespertar(p, usoId), chavesDespertar(p.despertar.id));
    await gravarFicha(fichaId, p);
    return { mudanca: mudancaDe(p), mensagem: r.mensagem, poder };
  });
}

/* ---------------- Loja do Sistema ---------------- */

export async function comprarNaLoja(fichaId: string, pedido: Pedido): Promise<ResultadoUso> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const p = ctx.p;
    const pd: Pedido = {
      cat: pedido.cat,
      base: String(pedido.base),
      rank: pedido.rank,
      rar: pedido.rar,
      afixos: Array.isArray(pedido.afixos) ? pedido.afixos.map(String) : [],
      qtd: pedido.cat === 'consumivel' ? Math.trunc(Number(pedido.qtd) || 1) : undefined,
    };
    const erro = validarPedido(p, pd);
    if (erro) return { erro };
    const preco = precoPedido(pd);
    const it = aplicarCompra(p, pd);
    await gravarFicha(fichaId, p);
    return { mudanca: mudancaDe(p), mensagem: `Comprado: ${pd.qtd && pd.qtd > 1 ? pd.qtd + '× ' : ''}${it.nome} por ${preco} Ouro.` };
  });
}

export async function venderNaLoja(fichaId: string, itemUid: string, qtd = 1): Promise<ResultadoUso> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    const p = ctx.p;
    const it = p.itens.find((i) => i.uid === itemUid);
    if (!it) return { erro: 'Item não encontrado no inventário.' };
    const nome = it.nome;
    const ganho = aplicarVenda(p, itemUid, Math.trunc(Number(qtd) || 1));
    await gravarFicha(fichaId, p);
    return { mudanca: mudancaDe(p), mensagem: `Vendido: ${nome} por ${ganho} Ouro.` };
  });
}

/* ---------------- Mestre ---------------- */

export async function liberarSorteioAcao(fichaId: string, tipo: 'atributos' | 'despertar'): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoFicha(fichaId);
    if (!ctx.souMestre) return { erro: 'Só o Mestre libera um novo sorteio.' };
    const lista = Array.from(new Set([...ctx.ficha.sorteios_liberados, tipo]));
    exigir(await clienteAdmin().from('fichas').update({ sorteios_liberados: lista }).eq('id', fichaId), 'Não foi possível liberar o sorteio.');
    revalidatePath(caminhoFicha(ctx));
    return {};
  });
}

export async function salvarRegrasMesa(mesaId: string, regras: RegrasMesa): Promise<Resultado> {
  return tentar(async () => {
    const ctx = await contextoMesa(mesaId);
    if (!ctx.souMestre) return { erro: 'Só o Mestre muda as regras da mesa.' };
    const limpas: RegrasMesa = {
      metodoPadrao: !!regras.metodoPadrao,
      escolhaGuiada: !!regras.escolhaGuiada,
      marcos: !!regras.marcos,
      provacao: !!regras.provacao,
    };
    exigir(await clienteAdmin().from('mesas').update({ regras: limpas }).eq('id', mesaId), 'Não foi possível salvar as regras. Tente de novo.');
    revalidatePath(`/mesas/${mesaId}`);
    return {};
  });
}
