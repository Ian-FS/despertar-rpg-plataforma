'use client';
/* Rolagens. Dentro de uma mesa (com `mesa`), cada rolagem é feita no servidor e entra no registro
   da mesa, que todos os membros veem ao vivo. Sem `mesa` (página de demonstração), rola no navegador. */
import { createContext, useCallback, useContext, useEffect, useEffectEvent, useMemo, useState, useTransition } from 'react';
import { rolarDados } from '@/app/(logado)/mesas/[id]/fichas/acoes';
import { NumeroGirando } from '@/componentes/efeitos/numero-girando';
import { useAnimar } from '@/componentes/efeitos/preferencias';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import { clienteNavegador } from '@/lib/supabase/navegador';
import type { RolagemLinha } from '@/lib/supabase/tipos-banco';
import { d20Natural, ehCritico, normalizarFormula, rolar, somarDado, somarFixo, type Rolagem } from '@/regras/rolagem';

interface Entrada {
  id: number;
  rotulo: string;
  r: Rolagem;
  margemCritico: number;
}

type Rolar = (rotulo: string, formula: string, opcoes?: { margemCritico?: number }) => void;
type Mostrar = (rotulo: string, r: Rolagem, opcoes?: { margemCritico?: number }) => void;

const Ctx = createContext<{ rolar: Rolar; mostrar: Mostrar }>({ rolar: () => {}, mostrar: () => {} });
/** Rola (no servidor, dentro de uma mesa) e mostra o resultado. */
export const useRolar = () => useContext(Ctx).rolar;
/** Mostra uma rolagem já feita no servidor (poções, poderes, eventos). */
export const useMostrarRolagem = () => useContext(Ctx).mostrar;

/** Mesa onde as rolagens são registradas. */
export interface MesaRolador {
  mesaId: string;
  /** personagem que rola (null = rolagem da pessoa, sem ficha) */
  fichaId: string | null;
  usuarioId: string;
  souMestre: boolean;
}

let seq = 0;
const GIRO = 520;

/** maior total possível (para o número girar numa faixa plausível) */
const maximo = (r: Rolagem) => r.partes.reduce((t, p) => t + (p.tipo === 'dado' ? p.sinal * p.qtd * p.faces : p.sinal * p.valor), 0);

export function Rolador({ children, mesa }: { children: React.ReactNode; mesa?: MesaRolador }) {
  const [lista, setLista] = useState<Entrada[]>([]);
  const [secreta, setSecreta] = useState(false);
  const efeitos = useEfeitos();
  const animar = useAnimar();

  const mostrar = useCallback<Mostrar>(
    (rotulo, r, opcoes) => {
      const margemCritico = opcoes?.margemCritico ?? 20;
      setLista((l) => [{ id: ++seq, rotulo, r, margemCritico }, ...l].slice(0, 4));
      efeitos.som('dado');
      const nat = d20Natural(r);
      const especial = ehCritico(r, margemCritico) ? 'critico' : nat === 1 ? 'falha' : null;
      if (especial) setTimeout(() => efeitos.som(especial), animar ? GIRO : 0);
    },
    [efeitos, animar],
  );

  const rolarFn = useCallback<Rolar>(
    (rotulo, formula, opcoes) => {
      if (!mesa) {
        const r = rolar(formula);
        if (r) mostrar(rotulo, r, opcoes);
        return;
      }
      rolarDados({ mesaId: mesa.mesaId, fichaId: mesa.fichaId }, rotulo, formula, { ...opcoes, secreta }).then((res) => {
        if (res.rolagem) mostrar(secreta ? `${rotulo} (secreta)` : rotulo, res.rolagem, opcoes);
        else {
          efeitos.som('falha');
          efeitos.aviso(res.erro ?? 'Não foi possível rolar.', 'perigo');
        }
      });
    },
    [mesa, secreta, mostrar, efeitos],
  );
  const valor = useMemo(() => ({ rolar: rolarFn, mostrar }), [rolarFn, mostrar]);

  return (
    <Ctx.Provider value={valor}>
      {children}
      {mesa && <RegistroMesa mesa={mesa} secreta={secreta} setSecreta={setSecreta} mostrar={mostrar} />}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-0 bottom-0 z-40 flex w-full max-w-xs flex-col gap-2"
        style={{
          paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
          paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {lista.map((e, i) => {
          const nat = d20Natural(e.r);
          const crit = ehCritico(e.r, e.margemCritico);
          const efeito = crit ? 'rolagem-critico' : nat === 1 ? 'rolagem-falha' : '';
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => setLista((l) => l.filter((x) => x.id !== e.id))}
              className={`janela pointer-events-auto flex flex-col p-3 text-left ${i > 0 ? 'opacity-70' : efeito || 'aparecer'}`}
              style={i === 0 && efeito && animar ? { animationDelay: `${GIRO}ms` } : undefined}
              title="Fechar"
            >
              <span className="rotulo">{e.rotulo}</span>
              <span className={`text-3xl font-bold ${crit ? 'text-ouro' : nat === 1 ? 'text-perigo' : 'text-sys'}`}>
                {i === 0 ? <NumeroGirando final={e.r.total} faces={Math.max(6, maximo(e.r))} duracao={GIRO} /> : e.r.total}
              </span>
              <span className="font-mono text-xs text-apagado">
                {e.r.texto}
                {crit ? (nat === 20 ? ' · 20 natural!' : ` · crítico (${e.margemCritico}+)`) : nat === 1 ? ' · 1 natural' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

const hora = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

/** Registro de rolagens da mesa, ao vivo. Rolagens dos outros também aparecem no canto da tela. */
function RegistroMesa({
  mesa,
  secreta,
  setSecreta,
  mostrar,
}: {
  mesa: MesaRolador;
  secreta: boolean;
  setSecreta: (v: boolean) => void;
  mostrar: Mostrar;
}) {
  const [linhas, setLinhas] = useState<RolagemLinha[]>([]);
  const [aberto, setAberto] = useState(false);
  const [naoVistas, setNaoVistas] = useState(0);
  const [conectado, setConectado] = useState(false);
  const { mesaId, usuarioId } = mesa;

  const chegou = useEffectEvent((nova: RolagemLinha) => {
    setLinhas((atual) => (atual.some((x) => x.id === nova.id) ? atual : [nova, ...atual].slice(0, 50)));
    if (nova.autor_id === usuarioId) return; // a sua já apareceu quando você rolou
    mostrar(`${nova.quem}: ${nova.rotulo}${nova.secreta ? ' (secreta)' : ''}`, nova.resultado, { margemCritico: nova.margem_critico });
    if (!aberto) setNaoVistas((n) => n + 1);
  });

  useEffect(() => {
    const sb = clienteNavegador();
    let ativo = true;
    sb.from('rolagens')
      .select('*')
      .eq('mesa_id', mesaId)
      .order('criado_em', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!ativo || !data) return;
        // junta com o que já chegou ao vivo enquanto a lista carregava
        setLinhas((atual) => {
          const ids = new Set(atual.map((x) => x.id));
          return [...atual, ...data.filter((x) => !ids.has(x.id))].slice(0, 50);
        });
      });
    const canal = sb
      .channel(`rolagens:${mesaId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rolagens', filter: `mesa_id=eq.${mesaId}` },
        (payload) => chegou(payload.new as RolagemLinha),
      )
      .subscribe((status) => setConectado(status === 'SUBSCRIBED'));
    return () => {
      ativo = false;
      sb.removeChannel(canal);
    };
  }, [mesaId]);

  const abrir = () => {
    setAberto((a) => !a);
    setNaoVistas(0);
  };

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-expanded={aberto}
        className="fixed bottom-0 left-0 z-40 m-4 flex items-center gap-2 border border-sys bg-painel/95 px-3 py-2 font-mono text-xs text-sys backdrop-blur hover:bg-sys/10"
        style={{ marginBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        title={conectado ? 'Rolagens da mesa, ao vivo' : 'Conectando ao registro da mesa…'}
      >
        <span className={`h-2 w-2 rounded-full ${conectado ? 'bg-ok' : 'bg-apagado'}`} aria-hidden />
        REGISTRO
        {naoVistas > 0 && !aberto && <span className="bg-sys px-1.5 text-fundo">{naoVistas}</span>}
      </button>
      {aberto && (
        <aside
          className="janela fixed bottom-0 left-0 z-40 m-4 flex max-h-[70vh] w-[calc(100%-32px)] max-w-sm flex-col"
          style={{ marginBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
          aria-label="Registro de rolagens da mesa"
        >
          <div className="flex items-center justify-between border-b border-linha px-3 py-2">
            <span className="rotulo">Rolagens da mesa</span>
            <button className="text-apagado hover:text-texto" onClick={() => setAberto(false)} aria-label="Fechar registro">
              ✕
            </button>
          </div>
          <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
            {!linhas.length && <li className="p-2 text-xs text-apagado">Nenhuma rolagem ainda.</li>}
            {linhas.map((x) => {
              const crit = ehCritico(x.resultado, x.margem_critico);
              const nat = d20Natural(x.resultado);
              return (
                <li key={x.id} className="flex items-start gap-2 border border-linha bg-painel-2 px-2 py-1.5 text-xs">
                  <span className="min-w-0 flex-1">
                    <span className="block text-apagado">
                      <b className={x.autor_id === usuarioId ? 'text-sys' : 'text-texto'}>{x.quem}</b> · {hora(x.criado_em)}
                      {x.secreta && <span className="text-ouro"> · secreta</span>}
                    </span>
                    <span className="block break-words">{x.rotulo}</span>
                    <span className="block font-mono text-apagado">{x.resultado.texto}</span>
                  </span>
                  <span className={`shrink-0 text-xl font-bold ${crit ? 'text-ouro' : nat === 1 ? 'text-perigo' : 'text-sys'}`}>
                    {x.resultado.total}
                  </span>
                </li>
              );
            })}
          </ul>
          <CampoFormula secreta={secreta} setSecreta={setSecreta} souMestre={mesa.souMestre} />
        </aside>
      )}
    </>
  );
}

const FACES = [4, 6, 8, 10, 12, 20, 100];

/** Bandeja de dados: clicar nos dados monta a fórmula (ou digite: 2d6+3). O Mestre pode rolar em segredo. */
function CampoFormula({ secreta, setSecreta, souMestre }: { secreta: boolean; setSecreta: (v: boolean) => void; souMestre: boolean }) {
  const rolarFn = useRolar();
  const [formula, setFormula] = useState('');
  const [rotulo, setRotulo] = useState('');
  const [, iniciar] = useTransition();
  const ok = !!normalizarFormula(formula);
  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    iniciar(() => rolarFn(rotulo.trim() || formula, formula));
  };
  return (
    <form onSubmit={enviar} className="flex flex-col gap-2 border-t border-linha p-2">
      <div className="flex flex-wrap gap-1" role="group" aria-label="Dados">
        {FACES.map((n) => (
          <button
            key={n}
            type="button"
            className="min-w-10 flex-1 border border-linha bg-painel-2 px-1 py-1.5 font-mono text-xs hover:border-sys hover:text-sys"
            onClick={() => setFormula((f) => somarDado(f, n))}
            title={`Somar 1d${n}`}
          >
            d{n}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            className="border border-linha bg-painel-2 px-2 py-1 font-mono text-xs hover:border-sys"
            onClick={() => setFormula((f) => somarFixo(f, d))}
            title={d > 0 ? 'Somar 1 ao modificador' : 'Tirar 1 do modificador'}
          >
            {d > 0 ? '+1' : '−1'}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto px-2 py-1 text-xs text-apagado hover:text-texto disabled:opacity-40"
          onClick={() => setFormula('')}
          disabled={!formula}
        >
          Limpar
        </button>
      </div>
      <div className="flex gap-2">
        <input
          className={`campo w-24 font-mono ${formula && !ok ? 'border-perigo' : ''}`}
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="2d6+3"
          aria-label="Fórmula"
        />
        <input className="campo min-w-0 flex-1" value={rotulo} onChange={(e) => setRotulo(e.target.value)} placeholder="Para quê? (opcional)" aria-label="Rótulo" />
        <button className="botao px-3 py-1 text-sm" disabled={!ok}>
          Rolar
        </button>
      </div>
      {souMestre && (
        <label className="flex items-center gap-2 text-xs text-apagado">
          <input type="checkbox" checked={secreta} onChange={(e) => setSecreta(e.target.checked)} />
          Rolagens secretas (só você vê). Vale para todos os botões de rolar enquanto estiver marcado.
        </label>
      )}
    </form>
  );
}

/** Formata bônus: 3 → "+3", −2 → "−2". */
export const sinal = (n: number) => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);

/** Fórmula de d20 + bônus. */
export const d20 = (bonus: number) => (bonus >= 0 ? `1d20+${bonus}` : `1d20-${Math.abs(bonus)}`);
