import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Carregando } from '@/componentes/efeitos/carregando';
import { Rolador } from '@/componentes/rolador';
import { webhookDaMesa } from '@/lib/discord';
import { clienteServidor, usuarioAtual } from '@/lib/supabase/servidor';
import type { RegrasMesa } from '@/lib/supabase/tipos-banco';
import { REGRAS_PADRAO } from '@/lib/fichas/regras-padrao';
import { BotaoSair, PainelConvite } from './controles';
import { MesaAoVivo } from './mesa-ao-vivo';
import { PainelDiscord } from './painel-discord';
import { PainelRegras } from './painel-regras';

export default function PaginaMesa({ params }: PageProps<'/mesas/[id]'>) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <Link href="/mesas" className="text-sm text-apagado hover:text-texto">
        ← Suas mesas
      </Link>
      <Suspense fallback={<Carregando texto="Sincronizando com o Sistema" />}>
        <DetalheMesa params={params} />
      </Suspense>
    </main>
  );
}

async function DetalheMesa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await usuarioAtual();
  if (!usuario) return null;
  const supabase = await clienteServidor();

  const [{ data: mesa }, { data: membros }, { data: grupo }, { data: combate }] = await Promise.all([
    supabase.from('mesas').select('id, nome, codigo_convite, regras').eq('id', id).maybeSingle(),
    supabase.from('membros').select('usuario_id, papel, perfis(nome, avatar_url)').eq('mesa_id', id).order('entrou_em'),
    // resumo público (espelhado das fichas): é o que atualiza ao vivo para todos
    supabase.from('fichas_publico').select('*').eq('mesa_id', id).order('atualizado_em'),
    supabase.from('combates').select('estado').eq('mesa_id', id).maybeSingle(),
  ]);
  // sem acesso (não é membro) ou inexistente: a RLS devolve vazio
  if (!mesa) notFound();

  const eu = membros?.find((m) => m.usuario_id === usuario.id);
  const souMestre = eu?.papel === 'mestre';
  const nomes = Object.fromEntries((membros ?? []).map((m) => [m.usuario_id, m.perfis?.nome || 'Sem nome']));
  const minhas = (grupo ?? []).filter((f) => f.dono_id === usuario.id && f.tipo === 'jogador');
  const regras: RegrasMesa = { ...REGRAS_PADRAO, ...(mesa.regras ?? {}) };
  // só o Mestre pergunta (pelo servidor) se há webhook; a URL em si não sai daqui
  const discordLigado = souMestre ? !!(await webhookDaMesa(mesa.id)) : false;
  // rolagens feitas aqui saem no nome do seu personagem ativo (se houver)
  const ativa = minhas.find((f) => f.ativa && f.tipo === 'jogador' && f.etapa === 'pronta');

  return (
    <Rolador mesa={{ mesaId: mesa.id, fichaId: ativa?.id ?? null, usuarioId: usuario.id, souMestre }}>
      <div className="flex flex-col gap-2">
        <span className={`rotulo ${souMestre ? 'text-ouro' : ''}`}>Você é {souMestre ? 'o Mestre' : 'Jogador'}</span>
        <h1 className="text-3xl font-bold break-words">{mesa.nome}</h1>
      </div>

      <MesaAoVivo
        mesaId={mesa.id}
        usuarioId={usuario.id}
        souMestre={souMestre}
        combate={combate?.estado ?? null}
        grupo={grupo ?? []}
        nomes={nomes}
      />

      {souMestre && <PainelConvite mesaId={mesa.id} codigo={mesa.codigo_convite} />}
      {souMestre && <PainelRegras mesaId={mesa.id} regras={regras} />}
      {souMestre && <PainelDiscord mesaId={mesa.id} configurado={discordLigado} />}

      <section className="caixa flex flex-col gap-3 p-4">
        <h2 className="rotulo">Membros · {membros?.length ?? 0}</h2>
        <ul className="flex flex-col gap-2">
          {membros?.map((m) => (
            <li key={m.usuario_id} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                {m.perfis?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.perfis.avatar_url} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="h-8 w-8 rounded-full bg-linha" aria-hidden />
                )}
                <span className="truncate">{m.perfis?.nome || 'Sem nome'}</span>
              </span>
              <span className={`rotulo shrink-0 ${m.papel === 'mestre' ? 'text-ouro' : ''}`}>{m.papel}</span>
            </li>
          ))}
        </ul>
      </section>

      {!souMestre && <BotaoSair mesaId={mesa.id} />}
    </Rolador>
  );
}
