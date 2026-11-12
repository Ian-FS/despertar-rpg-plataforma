/* Rolagem de dados a partir de fórmulas como "1d20+6", "2d8+5", "4d6-1d4+2".
   O sorteio é injetável: os testes passam um gerador fixo; o servidor usa o padrão (crypto). */

/** Devolve um inteiro de 1 a `faces`. */
export type Sorteio = (faces: number) => number;

export const sortearCrypto: Sorteio = (faces) => {
  // amostragem por rejeição para não favorecer nenhum lado do dado
  const limite = Math.floor(0x100000000 / faces) * faces;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    globalThis.crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limite);
  return (x % faces) + 1;
};

export type ParteRolagem =
  | { tipo: 'dado'; sinal: 1 | -1; qtd: number; faces: number; resultados: number[] }
  | { tipo: 'fixo'; sinal: 1 | -1; valor: number };

export interface Rolagem {
  formula: string;
  partes: ParteRolagem[];
  total: number;
  /** ex.: "2d8[3,7] +5" */
  texto: string;
}

const MAX_DADOS = 200;
const FORMULA = /^[+-]?(\d*d\d+|\d+)([+-](\d*d\d+|\d+))*$/;

/** Normaliza a fórmula (minúsculas, sem espaços, "−" vira "-"). Devolve null se for inválida. */
export function normalizarFormula(formula: string): string | null {
  const limpa = String(formula).toLowerCase().replace(/\s+/g, '').replace(/−/g, '-');
  return FORMULA.test(limpa) ? limpa : null;
}

export function rolar(formula: string, sortear: Sorteio = sortearCrypto): Rolagem | null {
  const limpa = normalizarFormula(formula);
  if (!limpa) return null;
  const partes: ParteRolagem[] = [];
  let total = 0;
  for (const termo of limpa.match(/[+-]?[^+-]+/g) ?? []) {
    const sinal = termo[0] === '-' ? -1 : 1;
    const corpo = termo.replace(/^[+-]/, '');
    if (corpo.includes('d')) {
      const [q, f] = corpo.split('d');
      const qtd = Number(q || 1);
      const faces = Number(f);
      if (qtd < 1 || qtd > MAX_DADOS || faces < 1) return null;
      const resultados = Array.from({ length: qtd }, () => sortear(faces));
      total += sinal * resultados.reduce((a, b) => a + b, 0);
      partes.push({ tipo: 'dado', sinal, qtd, faces, resultados });
    } else {
      const valor = Number(corpo);
      total += sinal * valor;
      partes.push({ tipo: 'fixo', sinal, valor });
    }
  }
  return { formula: limpa, partes, total, texto: textoRolagem(partes) };
}

export function textoRolagem(partes: ParteRolagem[]): string {
  return partes
    .map((p, i) => {
      const s = p.sinal < 0 ? '−' : i === 0 ? '' : '+';
      return p.tipo === 'dado' ? `${s}${p.qtd}d${p.faces}[${p.resultados.join(',')}]` : `${s}${p.valor}`;
    })
    .join(' ');
}

/** Valor natural do d20 quando a rolagem tem exatamente um d20 (para 20 e 1 naturais). */
export function d20Natural(r: Rolagem): number | null {
  const d20 = r.partes.filter((p) => p.tipo === 'dado' && p.faces === 20);
  if (d20.length !== 1) return null;
  const p = d20[0];
  return p.tipo === 'dado' && p.qtd === 1 ? p.resultados[0] : null;
}

/** O ataque é crítico se o d20 natural estiver na margem (ex.: margem 19 → 19 ou 20). */
export function ehCritico(r: Rolagem, margem = 20): boolean {
  const nat = d20Natural(r);
  return nat !== null && nat >= margem;
}

/** Média de uma expressão de dado simples ("2d8" → 9). */
export function mediaDado(expr: string | undefined): number {
  const m = /^(\d*)d(\d+)/.exec(expr ?? '');
  return m ? (Number(m[1] || 1) * (Number(m[2]) + 1)) / 2 : 0;
}

/* ---------------- bandeja de dados (monta a fórmula clicando) ---------------- */

interface Termos {
  dados: { sinal: 1 | -1; qtd: number; faces: number }[];
  fixo: number;
}

function termos(formula: string): Termos {
  const limpa = normalizarFormula(formula) ?? '';
  const t: Termos = { dados: [], fixo: 0 };
  for (const termo of limpa.match(/[+-]?[^+-]+/g) ?? []) {
    const sinal = termo[0] === '-' ? -1 : 1;
    const corpo = termo.replace(/^[+-]/, '');
    if (corpo.includes('d')) {
      const [q, f] = corpo.split('d');
      t.dados.push({ sinal, qtd: Number(q || 1), faces: Number(f) });
    } else t.fixo += sinal * Number(corpo);
  }
  return t;
}

function montar(t: Termos): string {
  const partes = t.dados.filter((d) => d.qtd > 0).map((d, i) => `${d.sinal < 0 ? '-' : i ? '+' : ''}${d.qtd}d${d.faces}`);
  if (t.fixo) partes.push(t.fixo < 0 ? `${t.fixo}` : partes.length ? `+${t.fixo}` : `${t.fixo}`);
  return partes.join('');
}

/** Soma um dado à fórmula: "" + d6 → "1d6"; "1d6+2" + d6 → "2d6+2"; "2d6" + d20 → "2d6+1d20". */
export function somarDado(formula: string, faces: number): string {
  const t = termos(formula);
  const igual = t.dados.find((d) => d.faces === faces && d.sinal > 0);
  if (igual) igual.qtd = Math.min(igual.qtd + 1, 99);
  else t.dados.push({ sinal: 1, qtd: 1, faces });
  return montar(t);
}

/** Ajusta o modificador fixo: "2d6" +1 → "2d6+1"; "2d6+1" −1 → "2d6". */
export function somarFixo(formula: string, delta: number): string {
  const t = termos(formula);
  t.fixo += delta;
  return montar(t);
}
