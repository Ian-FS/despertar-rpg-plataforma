import { describe, expect, it } from 'vitest';
import {
  aplicarAtributos,
  aplicarAvaliacao,
  aplicarDespertar,
  aplicarSubidaNivel,
  atributosMetodoPadrao,
  d6ComBencao,
  despertarDoD100,
  exigeProvacao,
  podeSubirNivel,
  potencialDoD6,
  sortearAtributos,
  sortearAvaliacao,
  sortearSubidaNivel,
  validarMetodoPadrao,
} from './criacao';
import { HAB } from './dados';
import { phRecebidos } from './ficha';
import { novoPersonagem } from './personagem';
import type { Sorteio } from './rolagem';

const fixo = (...valores: number[]): Sorteio => {
  let i = 0;
  return () => valores[i++ % valores.length];
};

describe('Potencial e atributos', () => {
  it('d6 do Potencial: 1–2 Fraco, 3–4 Normal, 5–6 Forte', () => {
    expect([1, 2, 3, 4, 5, 6].map((d) => potencialDoD6(d).n)).toEqual(['Fraco', 'Fraco', 'Normal', 'Normal', 'Forte', 'Forte']);
  });

  it('exemplo da Rafa: Normal (base 8) + 2d6 em ordem', () => {
    // d6=3 → Normal; depois FOR 3+4, AGI 5+5, VIT 2+4, INT 1+4, PER 4+5, PRE 2+2
    const r = sortearAtributos(fixo(3, 3, 4, 5, 5, 2, 4, 1, 4, 4, 5, 2, 2));
    expect(r.potencial.n).toBe('Normal');
    expect(r.atr).toEqual({ FOR: 15, AGI: 18, VIT: 14, INT: 13, PER: 17, PRE: 12 });
    const p = novoPersonagem();
    aplicarAtributos(p, r.atr, { ph: r.potencial.ph, st: r.potencial.st }, r.potencial.n);
    expect(p.statusPend).toBe(3);
    expect(p.atrBase).toEqual(r.atr);
    expect(phRecebidos(p)).toBe(4);
  });

  it('refazer o sorteio troca a compensação em vez de somar', () => {
    const p = novoPersonagem();
    aplicarAtributos(p, p.atr, { ph: 2, st: 6 }, 'Fraco');
    aplicarAtributos(p, p.atr, { ph: 0, st: 0 }, 'Forte');
    expect(p.statusPend).toBe(0);
    expect(p.compPot).toEqual({ ph: 0, st: 0 });
  });

  it('Método Padrão: exige exatamente 7, 7, 6, 6, 5 e 4 sobre base 8', () => {
    const ok = { FOR: 4, AGI: 7, VIT: 6, INT: 5, PER: 7, PRE: 6 };
    expect(validarMetodoPadrao(ok)).toBe(true);
    expect(validarMetodoPadrao({ ...ok, FOR: 5 })).toBe(false);
    expect(atributosMetodoPadrao(ok)).toEqual({ FOR: 12, AGI: 15, VIT: 14, INT: 13, PER: 15, PRE: 14 });
  });
});

describe('Despertar', () => {
  it('d100 cai na faixa certa', () => {
    expect(despertarDoD100(1).n).toBe('Corpo Endurecido');
    expect(despertarDoD100(85).n).toBe('Passo Espacial');
    expect(despertarDoD100(100).n).toBe('Herdeiro das Sombras');
  });

  it('compensação por raridade, sem acumular ao trocar', () => {
    const p = novoPersonagem();
    aplicarDespertar(p, despertarDoD100(1).id); // Comum: +2 PH, +4 Status
    expect([p.compDesp.ph, p.statusPend]).toEqual([2, 4]);
    aplicarDespertar(p, despertarDoD100(85).id); // Épico: nada
    expect([p.compDesp.ph, p.statusPend]).toEqual([0, 0]);
  });
});

describe('Avaliação do Sistema', () => {
  it('sorteia 3 habilidades distintas do Rank, sem repetir as que já tem', () => {
    const p = novoPersonagem();
    p.habs = [{ id: 'lam1', nv: 1, gratis: false }];
    const ops = sortearAvaliacao(fixo(1), 'E', p);
    expect(ops).toHaveLength(3);
    expect(new Set(ops.map((h) => h.id)).size).toBe(3);
    expect(ops.every((h) => h.r === 'E' && h.id !== 'lam1')).toBe(true);
  });

  it('a escolhida entra de graça', () => {
    const p = novoPersonagem();
    aplicarAvaliacao(p, 'vul2');
    expect(p.habs).toEqual([{ id: 'vul2', nv: 1, gratis: true }]);
    expect(HAB.vul2.n).toBe('Golpe Furtivo');
  });
});

describe('subir de nível', () => {
  it('Bênção do Sistema: 1 no d6 rola de novo uma vez', () => {
    expect(d6ComBencao(fixo(4))).toEqual({ rolagens: [4], valor: 4 });
    expect(d6ComBencao(fixo(1, 1))).toEqual({ rolagens: [1, 1], valor: 1 });
    expect(d6ComBencao(fixo(1, 5))).toEqual({ rolagens: [1, 5], valor: 5 });
  });

  it('precisa de Nível × 10 XP, a menos que a mesa use Marcos', () => {
    const p = novoPersonagem();
    p.xp = 9;
    expect(podeSubirNivel(p, {})).toBe(false);
    expect(podeSubirNivel(p, { marcos: true })).toBe(true);
    p.xp = 10;
    expect(podeSubirNivel(p, {})).toBe(true);
  });

  it('aplica Status (sempre 2), PH (1d6) e consome a XP', () => {
    const p = novoPersonagem();
    p.xp = 12;
    const r = sortearSubidaNivel(fixo(6), p);
    expect(r).toMatchObject({ novoNivel: 2, novoRank: null, avaliacao: [] });
    aplicarSubidaNivel(p, r, {});
    expect([p.nivel, p.statusPend, p.phNiveis, p.xp]).toEqual([2, 2, 6, 2]);
  });

  it('no nível 5 libera o Rank D e sorteia a Avaliação dele', () => {
    const p = novoPersonagem();
    p.nivel = 4;
    const r = sortearSubidaNivel(fixo(2), p);
    expect(r.novoRank).toBe('D');
    expect(r.avaliacao).toHaveLength(3);
    expect(r.avaliacao.every((id) => HAB[id].r === 'D')).toBe(true);
  });

  it('Provação de Ascensão trava 19→20 e 29→30 quando ligada', () => {
    expect(exigeProvacao(19, { provacao: true })).toBe(true);
    expect(exigeProvacao(29, { provacao: true })).toBe(true);
    expect(exigeProvacao(18, { provacao: true })).toBe(false);
    expect(exigeProvacao(19, {})).toBe(false);
  });
});
