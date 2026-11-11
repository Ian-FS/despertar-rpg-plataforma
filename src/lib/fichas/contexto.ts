/* Carrega uma ficha com a permissão de quem pede. Toda ação de ficha passa por aqui. */
import 'server-only';
import { clienteAdmin } from '@/lib/supabase/admin';
import { usuarioAtual } from '@/lib/supabase/servidor';
import type { FichaLinha, RegrasMesa } from '@/lib/supabase/tipos-banco';
import { normalizarPersonagem, resumoFicha } from '@/regras/validacao';
import type { Personagem } from '@/regras/personagem';

import { REGRAS_PADRAO } from './regras-padrao';

export class ErroFicha extends Error {}

/** Interrompe a ação com uma mensagem clara se a operação no banco falhou. */
export function exigir<T extends { error: { message: string } | null }>(r: T, mensagem: string): T {
  if (r.error) {
    console.error(`[fichas] ${mensagem}`, r.error.message);
    throw new ErroFicha(mensagem);
  }
  return r;
}

export interface ContextoMesa {
  usuarioId: string;
  mesaId: string;
  souMestre: boolean;
  regras: RegrasMesa;
}

export async function contextoMesa(mesaId: string): Promise<ContextoMesa> {
  const usuario = await usuarioAtual();
  if (!usuario) throw new ErroFicha('Sua sessão expirou. Entre de novo.');
  const admin = clienteAdmin();
  const [rMembro, rMesa] = await Promise.all([
    admin.from('membros').select('papel').eq('mesa_id', mesaId).eq('usuario_id', usuario.id).maybeSingle(),
    admin.from('mesas').select('regras').eq('id', mesaId).maybeSingle(),
  ]);
  const erroBanco = 'O servidor não conseguiu acessar o banco. Avise quem administra a plataforma.';
  const membro = exigir(rMembro, erroBanco).data;
  const mesa = exigir(rMesa, erroBanco).data;
  if (!membro || !mesa) throw new ErroFicha('Você não faz parte desta mesa.');
  return {
    usuarioId: usuario.id,
    mesaId,
    souMestre: membro.papel === 'mestre',
    regras: { ...REGRAS_PADRAO, ...(mesa.regras ?? {}) },
  };
}

export interface ContextoFicha extends ContextoMesa {
  ficha: FichaLinha;
  p: Personagem;
  souDono: boolean;
}

/** Ficha + permissão. Só o dono e o Mestre passam. */
export async function contextoFicha(fichaId: string): Promise<ContextoFicha> {
  const admin = clienteAdmin();
  const { data: ficha } = exigir(
    await admin.from('fichas').select('*').eq('id', fichaId).maybeSingle(),
    'O servidor não conseguiu acessar o banco. Avise quem administra a plataforma.',
  );
  if (!ficha) throw new ErroFicha('Ficha não encontrada.');
  const ctx = await contextoMesa(ficha.mesa_id);
  const souDono = ficha.dono_id === ctx.usuarioId;
  if (!souDono && !ctx.souMestre) throw new ErroFicha('Só o dono da ficha e o Mestre podem mexer nela.');
  return { ...ctx, ficha, p: normalizarPersonagem(ficha.dados as Personagem), souDono };
}

/** Grava a ficha recalculando o resumo público. */
export async function gravarFicha(fichaId: string, p: Personagem, extra: Partial<FichaLinha> = {}) {
  const { error } = await clienteAdmin()
    .from('fichas')
    .update({ dados: p, resumo: resumoFicha(p), atualizado_em: new Date().toISOString(), ...extra })
    .eq('id', fichaId);
  if (error) throw new ErroFicha('Não foi possível salvar a ficha. Tente de novo.');
}

export async function registrarSorteio(ctx: ContextoFicha, tipo: string, resultado: unknown) {
  const { error } = await clienteAdmin().from('sorteios').insert({
    ficha_id: ctx.ficha.id,
    mesa_id: ctx.mesaId,
    autor_id: ctx.usuarioId,
    tipo,
    resultado,
  });
  if (error) throw new ErroFicha('Não foi possível registrar o sorteio. Tente de novo.');
}

/** O sorteio pode ser feito? Só uma vez, a menos que o Mestre tenha liberado de novo. */
export async function sorteioPermitido(ctx: ContextoFicha, tipo: string): Promise<boolean> {
  if (ctx.ficha.sorteios_liberados.includes(tipo)) return true;
  // se a consulta falhar, exigir() interrompe: nunca liberar um sorteio por erro do banco
  const { count } = exigir(
    await clienteAdmin().from('sorteios').select('id', { count: 'exact', head: true }).eq('ficha_id', ctx.ficha.id).eq('tipo', tipo),
    'Não foi possível conferir os sorteios anteriores. Tente de novo.',
  );
  return !count;
}

export const semLiberacao = (ctx: ContextoFicha, tipo: string) => ctx.ficha.sorteios_liberados.filter((t) => t !== tipo);
