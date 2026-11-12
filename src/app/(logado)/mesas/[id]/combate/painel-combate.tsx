'use client';
/* Rastreador de combate da mesa: ordem de iniciativa, passadas, vez, Pressão e PV dos inimigos.
   O Mestre conduz; quem está na vez pode encerrar o próprio turno. Atualiza ao vivo para todos. */
import { useEffect, useRef, useState, useTransition } from 'react';
import { useEfeitos } from '@/componentes/efeitos/provedor';
import type { FichaPublicoLinha, ResumoFicha } from '@/lib/supabase/tipos-banco';
import { naVez, pressao, sequencia, type Combatente, type EstadoCombate } from '@/regras/combate';
import {
  adicionarCombatenteAcao,
  encerrarCombateAcao,
  iniciarCombateAcao,
  proximaVezAcao,
  pvInimigoAcao,
  reacaoAcao,
  removerCombatenteAcao,
  type NovoInimigo,
  type ResultadoCombate,
} from './acoes';

interface Props {
  mesaId: string;
  estado: EstadoCombate;
  grupo: FichaPublicoLinha[];
  souMestre: boolean;
  usuarioId: string;
}

/** Executa uma ação do combate e mostra o erro ou o que aconteceu. */
function useAcaoCombate() {
  const efeitos = useEfeitos();
  const [ocupado, iniciar] = useTransition();
  const executar = (fn: () => Promise<ResultadoCombate>, sucesso?: () => void) =>
    iniciar(async () => {
      const r = await fn();
      if (r.erro) {
        efeitos.som('falha');
        efeitos.aviso(r.erro, 'perigo');
        return;
      }
      if (r.linhas?.length) efeitos.aviso(`[ COMBATE ] ${r.linhas.join(' ')}`, 'sys');
      sucesso?.();
    });
  return { ocupado, executar };
}

/** Avisa quando chega a vez de um personagem seu. */
export function useAvisoDaVez(estado: EstadoCombate, usuarioId: string) {
  const efeitos = useEfeitos();
  const anterior = useRef<string | null>(null);
  const atual = naVez(estado);
  const chave = estado.vez ? `${estado.rodada}:${estado.vez.uid}:${estado.vez.passada}` : null;
  useEffect(() => {
    if (chave === anterior.current) return;
    const primeira = anterior.current === null;
    anterior.current = chave;
    if (primeira || !atual || atual.donoId !== usuarioId) return;
    efeitos.som('sistema');
    efeitos.aviso(`[ COMBATE ] É a sua vez, ${atual.nome}!${estado.vez!.passada > 1 ? ` (${estado.vez!.passada}ª ação)` : ''}`, 'ouro');
  }, [chave, atual, usuarioId, efeitos, estado.vez]);
}

export function PainelCombate({ mesaId, estado, grupo, souMestre, usuarioId }: Props) {
  useAvisoDaVez(estado, usuarioId);
  if (!estado.ativo) {
    return (
      <section className="caixa flex flex-col gap-3 p-4">
        <h2 className="rotulo">Combate</h2>
        {souMestre ? (
          <NovoCombate mesaId={mesaId} grupo={grupo} />
        ) : (
          <p className="text-sm text-apagado">Nenhum combate em andamento.</p>
        )}
      </section>
    );
  }
  return <CombateAtivo mesaId={mesaId} estado={estado} grupo={grupo} souMestre={souMestre} usuarioId={usuarioId} />;
}

function CombateAtivo({ mesaId, estado, grupo, souMestre, usuarioId }: Props) {
  const { ocupado, executar } = useAcaoCombate();
  const [adicionando, setAdicionando] = useState(false);
  const atual = naVez(estado);
  const seq = sequencia(estado);
  const passadas = Math.max(1, ...seq.map((v) => v.passada));
  const minhaVez = !!atual && atual.donoId === usuarioId;
  const resumoDe = (c: Combatente) => grupo.find((g) => g.id === c.fichaId)?.resumo as Partial<ResumoFicha> | undefined;
  const idxAtual = estado.vez ? seq.findIndex((v) => v.uid === estado.vez!.uid && v.passada === estado.vez!.passada) : -1;
  const faltam = idxAtual >= 0 ? seq.length - 1 - idxAtual : 0;
  // a rodada inteira, ação por ação (quem tem 3 ações aparece 3 vezes); Surpreso fica no fim, sem agir
  const porUid = new Map(estado.combatentes.map((c) => [c.uid, c]));
  const slots = [
    ...seq.map((v) => ({ c: porUid.get(v.uid)!, passada: v.passada })),
    ...estado.combatentes.filter((c) => !seq.some((v) => v.uid === c.uid)).map((c) => ({ c, passada: 1 })),
  ];

  return (
    <section className="janela flex flex-col gap-3 p-4" aria-label="Combate em andamento">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="rotulo text-perigo">⚔ Combate · Rodada {estado.rodada}</h2>
        <span className="font-mono text-xs text-apagado">
          {estado.vez && passadas > 1 ? `${estado.vez.passada}ª passada de ${passadas} · ` : ''}
          {faltam > 0 ? `faltam ${faltam} na rodada` : 'último da rodada'}
        </span>
      </div>

      <FilaTurnos estado={estado} usuarioId={usuarioId} />

      <ol className="flex flex-col gap-1.5">
        {slots.map(({ c, passada }, i) => {
          const naVezAgora = i === idxAtual;
          const passou = idxAtual >= 0 && i < idxAtual;
          const meu = c.donoId === usuarioId;
          const cor = c.tipo === 'inimigo' ? 'text-perigo' : meu ? 'text-sys' : '';
          const borda = naVezAgora ? 'border-ouro bg-ouro/10' : 'border-linha bg-painel-2';
          // ações seguintes da mesma pessoa: linha curta, para mostrar que ela age de novo
          if (passada > 1)
            return (
              <li key={`${c.uid}:${passada}`} className={`flex items-center gap-3 border px-2 py-1 text-sm ${borda} ${passou ? 'opacity-45' : ''}`}>
                <span className="w-8 shrink-0 text-center font-mono text-xs text-apagado">{i + 1}º</span>
                <span className={`min-w-0 flex-1 truncate font-semibold ${cor}`}>
                  {naVezAgora && '▶ '}
                  {c.nome}
                </span>
                <span className="font-mono text-xs text-apagado">{passada}ª ação</span>
              </li>
            );
          const r = resumoDe(c);
          const podeReagir = souMestre || meu;
          const pen = pressao(c);
          const fora = c.surpreso && estado.rodada === 1;
          return (
            <li
              key={`${c.uid}:${passada}`}
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 border px-2 py-1.5 text-sm ${borda} ${passou || fora ? 'opacity-60' : ''}`}
            >
              <span className="w-8 shrink-0 text-center font-mono text-lg font-bold text-sys" title={`Iniciativa ${c.iniciativa}`}>
                {c.iniciativa}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate font-semibold ${cor}`}>
                  {naVezAgora && '▶ '}
                  {c.nome}
                  {fora && <span className="ml-2 text-xs font-normal text-ouro">Surpreso: não age nesta rodada</span>}
                </span>
                <span className="block font-mono text-xs text-apagado">
                  {c.acoes > 1 ? `${c.acoes} ações · 1ª ação` : '1 ação'}
                  {c.tipo === 'ficha' && r?.pvMax ? ` · PV ${r.pvAtual}/${r.pvMax} · PM ${r.pmAtual}/${r.pmMax}` : ''}
                  {c.tipo === 'ficha' && r?.condicoes ? ` · ${r.condicoes}` : ''}
                </span>
                {c.tipo === 'inimigo' && <BarraPV pv={c.pv ?? 0} max={c.pvMax ?? 1} numeros={souMestre} />}
              </span>
              <span className="flex items-center gap-1 text-xs" title="Pressão: cada Defender ou Esquivar depois do primeiro na rodada sofre −2 (no máximo −6). Zera no início do turno.">
                <span className={pen < 0 ? 'text-perigo' : 'text-apagado'}>
                  {c.reacoes ? `${c.reacoes} reaç${c.reacoes > 1 ? 'ões' : 'ão'} · próxima ${pen || '±0'}` : 'Pressão 0'}
                </span>
                {podeReagir && (
                  <>
                    <button
                      className="border border-linha px-1.5 hover:border-sys disabled:opacity-40"
                      disabled={ocupado || !c.reacoes}
                      onClick={() => executar(() => reacaoAcao(mesaId, c.uid, -1))}
                      aria-label={`Desfazer Reação de ${c.nome}`}
                    >
                      −
                    </button>
                    <button
                      className="border border-linha px-1.5 hover:border-sys disabled:opacity-40"
                      disabled={ocupado}
                      onClick={() => executar(() => reacaoAcao(mesaId, c.uid, 1))}
                      title="Marcar uma Reação (Defender/Esquivar)"
                      aria-label={`Marcar Reação de ${c.nome}`}
                    >
                      +R
                    </button>
                  </>
                )}
              </span>
              {souMestre && c.tipo === 'inimigo' && <AjustePV mesaId={mesaId} c={c} />}
              {souMestre && (
                <button
                  className="text-apagado hover:text-perigo"
                  disabled={ocupado}
                  onClick={() => executar(() => removerCombatenteAcao(mesaId, c.uid))}
                  title="Tirar do combate (derrotado, fugiu)"
                  aria-label={`Tirar ${c.nome} do combate`}
                >
                  ✕
                </button>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-2">
        {(souMestre || minhaVez) && (
          <button className="botao" disabled={ocupado} onClick={() => executar(() => proximaVezAcao(mesaId, estado.vez))}>
            {minhaVez && !souMestre ? 'Encerrar meu turno' : 'Próximo ▶'}
          </button>
        )}
        {souMestre && (
          <>
            <button className="botao botao-discreto" onClick={() => setAdicionando((a) => !a)}>
              + Adicionar
            </button>
            <button
              className="botao botao-discreto ml-auto text-perigo"
              disabled={ocupado}
              onClick={() => {
                if (confirm('Encerrar o combate? Os efeitos ativos terminam e os usos "por combate" voltam.')) executar(() => encerrarCombateAcao(mesaId));
              }}
            >
              Encerrar combate
            </button>
          </>
        )}
      </div>
      {souMestre && adicionando && (
        <Adicionar mesaId={mesaId} grupo={grupo.filter((g) => g.ativa && g.etapa === 'pronta' && !estado.combatentes.some((c) => c.fichaId === g.id))} onFim={() => setAdicionando(false)} />
      )}
      <p className="text-xs text-apagado">
        O Início do turno (passivas, venenos, duração dos efeitos) é aplicado sozinho quando chega a vez de cada personagem, na 1ª passada.
      </p>
    </section>
  );
}

/** Fila da rodada, estilo videogame: um quadradinho por ação, na ordem; quem tem 3 ações aparece 3 vezes. */
export function FilaTurnos({ estado, usuarioId, max }: { estado: EstadoCombate; usuarioId: string; max?: number }) {
  const seq = sequencia(estado);
  const idx = estado.vez ? seq.findIndex((v) => v.uid === estado.vez!.uid && v.passada === estado.vez!.passada) : -1;
  const porUid = new Map(estado.combatentes.map((c) => [c.uid, c]));
  // na faixa curta (ficha) mostra só a vez atual e as próximas
  const inicio = max ? Math.max(0, idx) : 0;
  const visiveis = max ? seq.slice(inicio, inicio + max) : seq;
  return (
    <ol className="flex gap-1 overflow-x-auto pb-1" aria-label="Ordem das ações nesta rodada">
      {visiveis.map((v, k) => {
        const i = inicio + k;
        const c = porUid.get(v.uid);
        if (!c) return null;
        const atual = i === idx;
        const iniciais = c.nome
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => (/^\d+$/.test(p) ? p : p[0].toUpperCase()))
          .join('');
        const cor = c.tipo === 'inimigo' ? 'border-perigo/70 text-perigo' : c.donoId === usuarioId ? 'border-sys text-sys' : 'border-linha text-texto';
        return (
          <li
            key={`${v.uid}:${v.passada}`}
            title={`${c.nome}${v.passada > 1 ? ` · ${v.passada}ª ação` : ''}`}
            className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center border bg-painel-2 font-mono ${cor} ${
              atual ? 'border-2 border-ouro bg-ouro/15 text-ouro' : i < idx ? 'opacity-35' : ''
            }`}
          >
            <span className="text-sm leading-none font-bold">{iniciais}</span>
            {v.passada > 1 && <span className="text-[10px] leading-none text-apagado">{v.passada}ª</span>}
          </li>
        );
      })}
    </ol>
  );
}

function BarraPV({ pv, max, numeros }: { pv: number; max: number; numeros: boolean }) {
  const pct = Math.max(0, Math.min(100, (pv / max) * 100));
  const cor = pct > 50 ? 'bg-ok' : pct > 25 ? 'bg-ouro' : 'bg-perigo';
  return (
    <span className="mt-0.5 flex items-center gap-2 font-mono text-xs">
      <span className="h-1.5 w-24 bg-linha sm:w-32">
        <span className={`block h-full ${cor}`} style={{ width: `${pct}%` }} />
      </span>
      {numeros ? `${pv}/${max}` : pv <= 0 ? 'caído' : pct <= 50 ? 'ferido' : ''}
    </span>
  );
}

function AjustePV({ mesaId, c }: { mesaId: string; c: Combatente }) {
  const { ocupado, executar } = useAcaoCombate();
  const [valor, setValor] = useState('');
  const n = Math.trunc(Number(valor));
  const aplicar = (sinal: 1 | -1) => n > 0 && executar(() => pvInimigoAcao(mesaId, c.uid, sinal * n), () => setValor(''));
  return (
    <span className="flex items-center gap-1 text-xs">
      <input
        className="campo w-14 px-1 py-0.5 text-xs"
        inputMode="numeric"
        value={valor}
        onChange={(e) => setValor(e.target.value.replace(/\D/g, ''))}
        placeholder="PV"
        aria-label={`PV para ${c.nome}`}
      />
      <button className="border border-perigo/60 px-1.5 text-perigo disabled:opacity-40" disabled={ocupado || !(n > 0)} onClick={() => aplicar(-1)}>
        Dano
      </button>
      <button className="border border-ok/60 px-1.5 text-ok disabled:opacity-40" disabled={ocupado || !(n > 0)} onClick={() => aplicar(1)}>
        Cura
      </button>
    </span>
  );
}

const inimigoVazio = (): NovoInimigo => ({ nome: '', ini: 0, pv: 10, acoes: 1, qtd: 1, surpreso: false });

/** Linha de cadastro rápido de inimigo (nome, bônus de iniciativa, PV, ações, quantidade). */
function LinhaInimigo({ v, onChange, onRemover }: { v: NovoInimigo; onChange: (v: NovoInimigo) => void; onRemover?: () => void }) {
  // guarda o texto como foi digitado ("-", "") e o servidor converte; assim dá para digitar negativos
  const num = (k: keyof NovoInimigo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...v, [k]: e.target.value.replace(/[^\d-]/g, '') as unknown as number });
  return (
    <div className="flex flex-wrap items-end gap-2 text-xs">
      <label className="flex flex-col gap-1">
        Nome
        <input className="campo w-32" value={v.nome} onChange={(e) => onChange({ ...v, nome: e.target.value })} placeholder="Orc" />
      </label>
      <label className="flex flex-col gap-1">
        Inic. (bônus)
        <input className="campo w-16" inputMode="numeric" value={v.ini} onChange={num('ini')} />
      </label>
      <label className="flex flex-col gap-1">
        PV
        <input className="campo w-16" inputMode="numeric" value={v.pv} onChange={num('pv')} />
      </label>
      <label className="flex flex-col gap-1">
        Ações
        <input className="campo w-14" inputMode="numeric" value={v.acoes} onChange={num('acoes')} />
      </label>
      <label className="flex flex-col gap-1">
        Qtd.
        <input className="campo w-14" inputMode="numeric" value={v.qtd} onChange={num('qtd')} />
      </label>
      <label className="flex items-center gap-1 pb-2">
        <input type="checkbox" checked={!!v.surpreso} onChange={(e) => onChange({ ...v, surpreso: e.target.checked })} />
        Surpreso
      </label>
      {onRemover && (
        <button className="pb-2 text-apagado hover:text-perigo" onClick={onRemover} aria-label="Tirar inimigo da lista">
          ✕
        </button>
      )}
    </div>
  );
}

function NovoCombate({ mesaId, grupo }: { mesaId: string; grupo: FichaPublicoLinha[] }) {
  const { ocupado, executar } = useAcaoCombate();
  const prontas = grupo.filter((g) => g.ativa && g.etapa === 'pronta' && g.tipo === 'jogador');
  const [escolhidas, setEscolhidas] = useState<Record<string, { on: boolean; surpreso: boolean }>>({});
  const [inimigos, setInimigos] = useState<NovoInimigo[]>([inimigoVazio()]);
  const [aberto, setAberto] = useState(false);
  const marcada = (id: string) => escolhidas[id]?.on ?? true;

  if (!aberto)
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-apagado">Nenhum combate em andamento.</p>
        <button className="botao" onClick={() => setAberto(true)}>
          ⚔ Preparar combate
        </button>
      </div>
    );

  const iniciar = () =>
    executar(
      () =>
        iniciarCombateAcao(mesaId, {
          fichas: prontas.filter((g) => marcada(g.id)).map((g) => ({ id: g.id, surpreso: !!escolhidas[g.id]?.surpreso })),
          inimigos: inimigos.filter((i) => String(i.nome).trim()),
        }),
      () => setAberto(false),
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="rotulo">Personagens</span>
        {!prontas.length && <span className="text-xs text-apagado">Nenhum personagem pronto nesta mesa.</span>}
        {prontas.map((g) => (
          <label key={g.id} className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marcada(g.id)}
                onChange={(e) => setEscolhidas((s) => ({ ...s, [g.id]: { on: e.target.checked, surpreso: !!s[g.id]?.surpreso } }))}
              />
              {(g.resumo as Partial<ResumoFicha>).nome || 'Sem nome'}
            </span>
            <span className="flex items-center gap-1 text-xs text-apagado">
              <input
                type="checkbox"
                checked={!!escolhidas[g.id]?.surpreso}
                onChange={(e) => setEscolhidas((s) => ({ ...s, [g.id]: { on: marcada(g.id), surpreso: e.target.checked } }))}
              />
              Surpreso
            </span>
          </label>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="rotulo">Inimigos</span>
        {inimigos.map((v, i) => (
          <LinhaInimigo
            key={i}
            v={v}
            onChange={(n) => setInimigos((l) => l.map((x, j) => (j === i ? n : x)))}
            onRemover={inimigos.length > 1 ? () => setInimigos((l) => l.filter((_, j) => j !== i)) : undefined}
          />
        ))}
        <button className="self-start text-xs text-sys hover:underline" onClick={() => setInimigos((l) => [...l, inimigoVazio()])}>
          + Outro tipo de inimigo
        </button>
        <span className="text-xs text-apagado">Inimigo sem nome fica de fora. Iniciativa = 1d20 + bônus, rolada no registro da mesa.</span>
      </div>
      <div className="flex gap-2">
        <button className="botao" disabled={ocupado} onClick={iniciar}>
          {ocupado ? 'Rolando iniciativa…' : '⚔ Rolar iniciativa e começar'}
        </button>
        <button className="botao botao-discreto" onClick={() => setAberto(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function Adicionar({ mesaId, grupo, onFim }: { mesaId: string; grupo: FichaPublicoLinha[]; onFim: () => void }) {
  const { ocupado, executar } = useAcaoCombate();
  const [inimigo, setInimigo] = useState<NovoInimigo>(inimigoVazio());
  return (
    <div className="flex flex-col gap-2 border border-sys/60 p-2">
      {grupo.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rotulo">Personagem:</span>
          {grupo.map((g) => (
            <button
              key={g.id}
              className="border border-linha px-2 py-0.5 hover:border-sys"
              disabled={ocupado}
              onClick={() => executar(() => adicionarCombatenteAcao(mesaId, { fichaId: g.id }), onFim)}
            >
              {(g.resumo as Partial<ResumoFicha>).nome || 'Sem nome'}
            </button>
          ))}
        </div>
      )}
      <LinhaInimigo v={inimigo} onChange={setInimigo} />
      <div className="flex gap-2">
        <button
          className="botao px-2 py-0.5 text-xs"
          disabled={ocupado || !String(inimigo.nome).trim()}
          onClick={() => executar(() => adicionarCombatenteAcao(mesaId, { inimigo }), onFim)}
        >
          Adicionar inimigo
        </button>
        <button className="botao botao-discreto px-2 py-0.5 text-xs" onClick={onFim}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
