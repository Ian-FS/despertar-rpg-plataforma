import { describe, expect, it } from 'vitest';
import { d20Natural, ehCritico, mediaDado, normalizarFormula, rolar, sortearCrypto, type Sorteio } from './rolagem';

/** Sorteio previsível: devolve os valores em sequência. */
const fixo = (...valores: number[]): Sorteio => {
  let i = 0;
  return () => valores[i++ % valores.length];
};

describe('rolar', () => {
  it('soma dados e modificadores', () => {
    const r = rolar('1d20+6', fixo(12))!;
    expect(r.total).toBe(18);
    expect(r.texto).toBe('1d20[12] +6');
  });

  it('aceita vários termos, subtração e o sinal "−"', () => {
    const r = rolar('2d8 + 5 − 1d4', fixo(3, 7, 2))!;
    expect(r.total).toBe(3 + 7 + 5 - 2);
    expect(r.texto).toBe('2d8[3,7] +5 −1d4[2]');
  });

  it('"d20" sem quantidade vale 1d20', () => {
    expect(rolar('d20', fixo(5))!.total).toBe(5);
  });

  it('recusa fórmulas inválidas ou exageradas', () => {
    expect(rolar('abc')).toBeNull();
    expect(rolar('1d')).toBeNull();
    expect(rolar('201d6')).toBeNull();
    expect(rolar('1d0')).toBeNull();
    expect(normalizarFormula('2D8 + 5')).toBe('2d8+5');
  });

  it('identifica 20 e 1 naturais só com um d20', () => {
    expect(d20Natural(rolar('1d20+3', fixo(20))!)).toBe(20);
    expect(d20Natural(rolar('2d20', fixo(20, 1))!)).toBeNull();
    expect(d20Natural(rolar('1d8', fixo(8))!)).toBeNull();
  });
});

describe('ehCritico', () => {
  it('respeita a margem', () => {
    expect(ehCritico(rolar('1d20+5', fixo(20))!)).toBe(true);
    expect(ehCritico(rolar('1d20+5', fixo(19))!)).toBe(false);
    expect(ehCritico(rolar('1d20+5', fixo(19))!, 19)).toBe(true);
    expect(ehCritico(rolar('1d20+5', fixo(18))!, 19)).toBe(false);
  });
});

describe('sortearCrypto', () => {
  it('fica sempre entre 1 e o número de faces', () => {
    for (let i = 0; i < 2000; i++) {
      const v = sortearCrypto(20);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(20);
    }
  });
});

describe('mediaDado', () => {
  it('calcula a média', () => {
    expect(mediaDado('2d8')).toBe(9);
    expect(mediaDado('1d4')).toBe(2.5);
    expect(mediaDado(undefined)).toBe(0);
  });
});

describe('bandeja de dados', () => {
  it('monta a fórmula clicando nos dados e no modificador', async () => {
    const { somarDado, somarFixo } = await import('./rolagem');
    let f = somarDado('', 6);
    expect(f).toBe('1d6');
    f = somarDado(f, 6);
    expect(f).toBe('2d6');
    f = somarFixo(f, 1);
    f = somarFixo(f, 1);
    expect(f).toBe('2d6+2');
    f = somarDado(f, 20);
    expect(f).toBe('2d6+1d20+2');
    expect(somarFixo('2d6+1', -1)).toBe('2d6');
    expect(somarFixo('', -1)).toBe('-1');
    expect(somarDado('1d8 + 3', 8)).toBe('2d8+3');
  });
});
