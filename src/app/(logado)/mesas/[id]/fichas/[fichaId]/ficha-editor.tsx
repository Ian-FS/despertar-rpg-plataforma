'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import { Rolador } from '@/componentes/rolador';
import type { RegrasMesa } from '@/lib/supabase/tipos-banco';
import { HAB } from '@/regras/dados';
import { computarFicha, type FichaCalculada } from '@/regras/ficha';
import type { Personagem } from '@/regras/personagem';
import { ATRIBUTO_IDS } from '@/regras/tipos';
import { mudouProgressao, validarFicha } from '@/regras/validacao';
import { salvarFicha, type MudancaFicha } from '../acoes';
import { AbaFicha } from './aba-ficha';
import { AbaHabilidades } from './aba-habilidades';
import { AbaInventario } from './aba-inventario';
import { AbaNotas } from './aba-notas';

export interface PropsAba {
  p: Personagem;
  f: FichaCalculada;
  /** última versão gravada (o que já foi confirmado) */
  salvo: Personagem;
  /** altera uma cópia do personagem (anotações salvam sozinhas; pontos pedem confirmação) */
  alterar: (fn: (rascunho: Personagem) => void) => void;
  /** aplica uma mudança feita pelo servidor (poção, PM) sem perder o rascunho */
  aplicarMudanca: (m: MudancaFicha) => void;
  podeEditar: boolean;
  souMestre: boolean;
  regras: RegrasMesa;
  fichaId: string;
}

const ABAS = [
  { id: 'ficha', nome: 'Ficha' },
  { id: 'habilidades', nome: 'Habilidades' },
  { id: 'inventario', nome: 'Inventário' },
  { id: 'notas', nome: 'Notas' },
] as const;
type Aba = (typeof ABAS)[number]['id'];

type Estado = 'salvo' | 'pendente' | 'salvando' | 'invalido' | 'erro';

/** Campos de progressão (pedem confirmação do jogador). */
const comProgressaoDe = (p: Personagem, de: Personagem): Personagem => ({
  ...p,
  atr: de.atr,
  statusPend: de.statusPend,
  habs: de.habs,
  despertar: de.despertar,
  pericias: de.pericias,
});

export function FichaEditor({
  fichaId,
  inicial,
  souMestre,
  regras,
  podeEditar,
}: {
  fichaId: string;
  inicial: Personagem;
  souMestre: boolean;
  regras: RegrasMesa;
  podeEditar: boolean;
}) {
  const [p, setP] = useState(inicial);
  const [salvo, setSalvo] = useState(inicial);
  const [aba, setAba] = useState<Aba>('ficha');
  const [estado, setEstado] = useState<Estado>('salvo');
  const [errosServidor, setErrosServidor] = useState<string[]>([]);
  const [confirmando, iniciarConfirmacao] = useTransition();
  const [, iniciar] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const efeitos = useEfeitos();

  const f = useMemo(() => computarFicha(p), [p]);
  const erros = useMemo(() => (souMestre ? [] : validarFicha(salvo, p)), [souMestre, salvo, p]);
  // o Mestre salva tudo direto; o jogador confirma os pontos
  const rascunho = !souMestre && mudouProgressao(salvo, p);

  const alterar = (fn: (r: Personagem) => void) => {
    if (!podeEditar) return;
    const copia: Personagem = structuredClone(p);
    fn(copia);
    setP(copia);
    setEstado('pendente');
  };

  const aplicarMudanca = (m: MudancaFicha) => {
    setP((atual) => ({ ...atual, ...m }));
    setSalvo((atual) => ({ ...atual, ...m }));
  };

  // salvamento automático do que não é progressão (anotações, equipamento, Título; tudo, se for o Mestre)
  useEffect(() => {
    const paraSalvar = souMestre ? p : comProgressaoDe(p, salvo);
    if (JSON.stringify(paraSalvar) === JSON.stringify(salvo)) return;
    if (!souMestre && validarFicha(salvo, paraSalvar).length) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setEstado('salvando');
      iniciar(async () => {
        const r = await salvarFicha(fichaId, paraSalvar);
        if (r.erro || r.erros?.length) {
          setErrosServidor(r.erros ?? [r.erro!]);
          setEstado('erro');
        } else {
          setErrosServidor([]);
          setSalvo(paraSalvar);
          setEstado('salvo');
        }
      });
    }, 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [p, salvo, fichaId, souMestre]);

  function confirmar() {
    iniciarConfirmacao(async () => {
      const r = await salvarFicha(fichaId, p);
      if (r.erro || r.erros?.length) {
        setErrosServidor(r.erros ?? [r.erro!]);
        efeitos.som('falha');
        return;
      }
      setErrosServidor([]);
      setSalvo(p);
      setEstado('salvo');
      efeitos.som('sistema');
      efeitos.aviso('[ SISTEMA ] Alterações confirmadas.', 'ok');
    });
  }

  const props: PropsAba = { p, f, salvo, alterar, aplicarMudanca, podeEditar, souMestre, regras, fichaId };
  const listaErros = erros.length ? erros : errosServidor;

  return (
    <Rolador>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Seções da ficha" className="flex flex-wrap gap-1">
            {ABAS.map((a) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={aba === a.id}
                onClick={() => setAba(a.id)}
                className={`border px-3 py-1.5 text-sm font-semibold ${
                  aba === a.id ? 'border-sys bg-sys/10 text-sys' : 'border-transparent text-apagado hover:text-texto'
                }`}
              >
                {a.nome}
              </button>
            ))}
          </div>
          {podeEditar && <IndicadorSalvo estado={rascunho ? 'pendente' : erros.length && p !== salvo ? 'invalido' : estado} />}
        </div>

        {listaErros.length > 0 && (
          <div role="alert" className="caixa border-perigo/60 p-3 text-sm">
            <p className="font-semibold text-perigo">Corrija para salvar:</p>
            <ul className="list-disc pl-5 text-perigo">
              {listaErros.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {aba === 'ficha' && <AbaFicha {...props} />}
        {aba === 'habilidades' && <AbaHabilidades {...props} />}
        {aba === 'inventario' && <AbaInventario {...props} />}
        {aba === 'notas' && <AbaNotas {...props} />}

        {rascunho && (
          <BarraConfirmar
            antes={salvo}
            depois={p}
            ocupado={confirmando}
            bloqueado={erros.length > 0}
            onDesfazer={() => (setP(comProgressaoDe(p, salvo)), setErrosServidor([]))}
            onConfirmar={confirmar}
          />
        )}
      </div>
    </Rolador>
  );
}

/** Barra fixa com o resumo dos pontos alocados e os botões Desfazer / Confirmar. */
function BarraConfirmar({
  antes,
  depois,
  ocupado,
  bloqueado,
  onDesfazer,
  onConfirmar,
}: {
  antes: Personagem;
  depois: Personagem;
  ocupado: boolean;
  bloqueado: boolean;
  onDesfazer: () => void;
  onConfirmar: () => void;
}) {
  const itens: string[] = [];
  for (const a of ATRIBUTO_IDS) if (depois.atr[a] !== antes.atr[a]) itens.push(`${a} ${antes.atr[a]} → ${depois.atr[a]}`);
  for (const h of depois.habs) {
    const x = antes.habs.find((y) => y.id === h.id);
    if (!x) itens.push(`${HAB[h.id].n} (nova)`);
    else if (x.nv !== h.nv) itens.push(`${HAB[h.id].n} nv ${x.nv} → ${h.nv}`);
  }
  if (depois.despertar.nv !== antes.despertar.nv) itens.push(`Despertar nv ${antes.despertar.nv} → ${depois.despertar.nv}`);
  for (const [n, g] of Object.entries(depois.pericias)) if ((antes.pericias[n] ?? 0) !== g) itens.push(`${n} ${antes.pericias[n] ?? 0} → ${g}`);

  return (
    <div
      className="sticky bottom-0 z-30 -mx-4 border-t border-sys bg-painel/95 px-4 py-3 backdrop-blur"
      style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs tracking-[0.2em] text-sys">[ SISTEMA ] PONTOS ALOCADOS</p>
          <p className="truncate text-sm text-apagado" title={itens.join(' · ')}>
            {itens.join(' · ') || 'Alterações nos pontos'}
          </p>
        </div>
        <button className="botao botao-discreto" onClick={onDesfazer} disabled={ocupado}>
          Desfazer
        </button>
        <button className="botao" onClick={onConfirmar} disabled={ocupado || bloqueado} title={bloqueado ? 'Corrija os erros acima' : 'Depois de confirmar, só o Mestre desfaz'}>
          {ocupado ? 'Confirmando…' : '[ CONFIRMAR ]'}
        </button>
      </div>
    </div>
  );
}

function IndicadorSalvo({ estado }: { estado: Estado }) {
  const txt: Record<Estado, string> = {
    salvo: '✓ sincronizado com o Sistema',
    pendente: 'alterado…',
    salvando: 'salvando…',
    invalido: 'não salvo: corrija os erros',
    erro: 'não salvo',
  };
  const cor = estado === 'salvo' ? 'text-ok' : estado === 'invalido' || estado === 'erro' ? 'text-perigo' : 'text-apagado';
  return <span className={`font-mono text-xs ${cor}`}>{txt[estado]}</span>;
}
