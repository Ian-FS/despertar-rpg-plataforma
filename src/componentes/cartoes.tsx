/* Cartões de habilidade e de Despertar, no formato do livro. */
import { ARV, RANKS, RARIDADE_DESPERTAR } from '@/regras/dados';
import type { Despertar, Habilidade } from '@/regras/tipos';

export const COR_RANK: Record<string, string> = {
  E: '#9aa5b1',
  D: '#5ad17a',
  C: '#4aa8ff',
  B: '#b06cff',
  A: '#ffb340',
  S: '#ff4d6d',
};

export function CartaoHabilidade({ h, rodape }: { h: Habilidade; rodape?: React.ReactNode }) {
  const a = ARV[h.t];
  return (
    <article className="caixa flex flex-col gap-2 p-4 text-sm" style={{ borderTopColor: a.cor, borderTopWidth: 3 }}>
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono font-bold" style={{ color: COR_RANK[h.r] }}>
          {h.r}
        </span>
        <strong className="text-base">{h.n}</strong>
        <span className="text-xs text-apagado">
          {h.tipo}
          {h.acao !== '—' ? ` · ${h.acao}` : ''}
          {h.pm ? ` · ${h.pm} PM` : ''}
        </span>
      </header>
      <p className="text-xs text-apagado">
        {a.icone} {a.nome} · Adquirir {RANKS[h.r].custo} PH · {h.attr.split('/').join(' ou ')} {RANKS[h.r].attr} · Nível{' '}
        {RANKS[h.r].nivel}
      </p>
      <p className="text-xs text-apagado">
        Alcance: {h.alc} · Duração: {h.dur}
        {h.freq ? ` · ${h.freq}` : ''}
      </p>
      <p>
        <b>Efeito:</b> {h.ef}
      </p>
      <p>
        <b>Por nível:</b> {h.esc}
      </p>
      <p>
        <b>Nível 3:</b> {h.m3}
      </p>
      <p>
        <b>Nível 5:</b> {h.m5}
      </p>
      {rodape}
    </article>
  );
}

export function CartaoDespertar({ x, rodape }: { x: Despertar; rodape?: React.ReactNode }) {
  const r = RARIDADE_DESPERTAR[x.rar];
  const faixa = x.d[0] === x.d[1] ? String(x.d[0]).padStart(2, '0') : `${String(x.d[0]).padStart(2, '0')}–${String(x.d[1]).padStart(2, '0')}`;
  return (
    <article className="caixa flex flex-col gap-2 p-4 text-sm" style={{ borderTopColor: r.cor, borderTopWidth: 3 }}>
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-xs text-apagado">{faixa}</span>
        <strong className="text-base">{x.n}</strong>
        <span className="text-xs font-semibold" style={{ color: r.cor }}>
          {x.rar}
        </span>
      </header>
      <p className="text-xs text-apagado">
        Afinidades: {x.afin.map((a) => `${ARV[a].icone} ${ARV[a].nome}`).join(' · ')} (−1 PH para adquirir)
      </p>
      <p className="italic text-apagado">{x.desc}</p>
      <p>
        <b>Efeito:</b> {x.ef}
      </p>
      <p>
        <b>Por nível:</b> {x.esc}
      </p>
      <p>
        <b>Nível 3:</b> {x.m3}
      </p>
      <p>
        <b>Nível 5:</b> {x.m5}
      </p>
      <p>
        <b>Forma Evoluída:</b> {x.forma}
      </p>
      <p className="text-xs text-apagado">{r.txt}</p>
      {rodape}
    </article>
  );
}
