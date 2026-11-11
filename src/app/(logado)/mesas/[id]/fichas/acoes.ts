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
import { computarFicha } from '@/regras/ficha';
import { novoPersonagem, type Personagem } from '@/regras/personagem';
import { sortearCrypto } from '@/regras/rolagem';
import { ATRIBUTO_IDS, type AtributoId } from '@/regras/tipos';
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
