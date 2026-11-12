'use client';
/* Parte da página da mesa que muda durante o jogo: combate e cartões dos personagens (PV, condições). */
import Link from 'next/link';
import type { EtapaFicha, FichaPublicoLinha, ResumoFicha } from '@/lib/supabase/tipos-banco';
import type { EstadoCombate } from '@/regras/combate';
import { DESP } from '@/regras/dados';
import { useCombate, useGrupo } from './ao-vivo';
import { PainelCombate } from './combate/painel-combate';

const ETAPA_TXT: Record<EtapaFicha, string> = {
  conceito: 'em criação',
  atributos: 'em criação: atributos',
  despertar: 'em criação: Despertar',
  avaliacao: 'em criação: Avaliação',
  pronta: '',
};

export function MesaAoVivo({
  mesaId,
  usuarioId,
  souMestre,
  combate,
  grupo: grupoInicial,
  nomes,
}: {
  mesaId: string;
  usuarioId: string;
  souMestre: boolean;
  combate: EstadoCombate | null;
  grupo: FichaPublicoLinha[];
  /** nome de cada membro, por id */
  nomes: Record<string, string>;
}) {
  const { estado, recarregar } = useCombate(mesaId, combate);
  const grupo = useGrupo(mesaId, grupoInicial);
  const jogadores = grupo.filter((f) => f.tipo === 'jogador');
  const minhas = jogadores.filter((f) => f.dono_id === usuarioId);
  const doGrupo = jogadores.filter((f) => f.ativa && f.dono_id !== usuarioId);

  return (
    <>
      <PainelCombate mesaId={mesaId} estado={estado} recarregar={recarregar} grupo={jogadores} souMestre={souMestre} usuarioId={usuarioId} />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="rotulo">Seus personagens</h2>
          <Link href={`/mesas/${mesaId}/fichas/nova`} className="botao">
            Criar personagem
          </Link>
        </div>
        {minhas.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {minhas.map((f) => (
              <li key={f.id}>
                <CartaoFicha href={`/mesas/${mesaId}/fichas/${f.id}`} resumo={f.resumo} etapa={f.etapa} marca={f.ativa ? 'ativa' : 'guardada'} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-apagado">Você ainda não tem personagem nesta mesa.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="rotulo">{souMestre ? 'Fichas dos jogadores' : 'Grupo'}</h2>
        {doGrupo.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {doGrupo.map((f) => (
              <li key={f.id}>
                <CartaoFicha
                  href={souMestre ? `/mesas/${mesaId}/fichas/${f.id}` : null}
                  resumo={f.resumo}
                  etapa={f.etapa}
                  marca={nomes[f.dono_id] || 'Sem nome'}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-apagado">Ninguém mais tem personagem ativo nesta mesa ainda.</p>
        )}
      </section>
    </>
  );
}

function CartaoFicha({
  href,
  resumo,
  etapa,
  marca,
}: {
  href: string | null;
  resumo: Partial<ResumoFicha>;
  etapa: EtapaFicha;
  marca: string;
}) {
  const pv = resumo.pvMax ? Math.max(0, Math.min(100, ((resumo.pvAtual ?? 0) / resumo.pvMax) * 100)) : 0;
  const pm = resumo.pmMax ? Math.max(0, Math.min(100, ((resumo.pmAtual ?? 0) / resumo.pmMax) * 100)) : 0;
  const conteudo = (
    <div className={`caixa flex flex-col gap-2 p-4 ${href ? 'hover:border-sys' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-lg font-semibold">{resumo.nome || 'Sem nome'}</span>
        <span className="rotulo shrink-0">{marca}</span>
      </div>
      {etapa !== 'pronta' ? (
        <span className="text-sm text-ouro">{ETAPA_TXT[etapa]}</span>
      ) : (
        <>
          <span className="text-sm text-apagado">
            Nível {resumo.nivel} · Rank {resumo.rank}
            {resumo.despertar && DESP[resumo.despertar] ? ` · ${DESP[resumo.despertar].n}` : ''}
          </span>
          <Barra rotulo={`PV ${resumo.pvAtual}/${resumo.pvMax}`} pct={pv} cor="bg-ok" />
          <Barra rotulo={`PM ${resumo.pmAtual}/${resumo.pmMax}`} pct={pm} cor="bg-sys" />
          {resumo.condicoes && <span className="text-xs text-perigo">{resumo.condicoes}</span>}
        </>
      )}
    </div>
  );
  return href ? <Link href={href}>{conteudo}</Link> : conteudo;
}

function Barra({ rotulo, pct, cor }: { rotulo: string; pct: number; cor: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="w-24 shrink-0">{rotulo}</span>
      <span className="h-1.5 flex-1 bg-linha">
        <span className={`block h-full ${cor} transition-[width] duration-500`} style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}
