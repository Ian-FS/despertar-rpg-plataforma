'use server';
/* Ações do servidor para mesas e convites. Toda permissão é conferida no banco (RLS e funções). */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clienteServidor, usuarioAtual } from '@/lib/supabase/servidor';

export interface EstadoFormulario {
  erro?: string;
}

export async function criarMesa(_anterior: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  const nome = String(form.get('nome') ?? '').trim();
  if (!nome) return { erro: 'Dê um nome para a mesa.' };
  if (nome.length > 80) return { erro: 'O nome pode ter no máximo 80 caracteres.' };

  const supabase = await clienteServidor();
  const { data, error } = await supabase.rpc('criar_mesa', { p_nome: nome });
  if (error || !data) return { erro: 'Não foi possível criar a mesa. Tente de novo.' };
  redirect(`/mesas/${data}`);
}

export async function aceitarConvite(codigo: string): Promise<EstadoFormulario> {
  const supabase = await clienteServidor();
  const { data, error } = await supabase.rpc('entrar_na_mesa', { p_codigo: codigo });
  if (error || !data) return { erro: 'Este convite não vale mais. Peça um link novo ao Mestre.' };
  redirect(`/mesas/${data}`);
}

export async function gerarNovoConvite(mesaId: string): Promise<EstadoFormulario> {
  const supabase = await clienteServidor();
  const { error } = await supabase.rpc('novo_convite', { p_mesa: mesaId });
  if (error) return { erro: 'Só o Mestre pode gerar um novo convite.' };
  revalidatePath(`/mesas/${mesaId}`);
  return {};
}

export async function sairDaMesa(mesaId: string): Promise<EstadoFormulario> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect('/entrar');
  const supabase = await clienteServidor();
  const { error } = await supabase.from('membros').delete().eq('mesa_id', mesaId).eq('usuario_id', usuario.id);
  if (error) return { erro: 'Não foi possível sair da mesa. Tente de novo.' };
  redirect('/mesas');
}
