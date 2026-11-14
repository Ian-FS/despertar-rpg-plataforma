/* Integridade dos dados portados do data.js. */
import { describe, expect, it } from 'vitest';
import { gerarEncontro, statsAmeaca } from './ameacas';
import { ARV, ARVORES, BESTIARIO, DESP, DESPERTARES, HAB, HABILIDADES, PERICIAS, TITULOS } from './dados';
import { EFEITOS_DESP, EFEITOS_HAB } from './efeitos';

describe('habilidades', () => {
  it('10 árvores, cada uma com a base E, E, D, D, C, B, A, S (a revisão 2 trouxe 5 extras)', () => {
    expect(ARVORES).toHaveLength(10);
    expect(HABILIDADES).toHaveLength(85);
    for (const a of ARVORES) {
      const hs = HABILIDADES.filter((h) => h.t === a.id);
      expect(hs.length, a.nome).toBeGreaterThanOrEqual(8);
      for (const r of ['E', 'D', 'C', 'B', 'A', 'S']) expect(hs.some((h) => h.r === r), `${a.nome} ${r}`).toBe(true);
    }
  });

  it('ids únicos e pré-requisitos existentes', () => {
    expect(new Set(HABILIDADES.map((h) => h.id)).size).toBe(HABILIDADES.length);
    for (const h of HABILIDADES) for (const [id] of h.pre) expect(HAB[id], `${h.n} → ${id}`).toBeDefined();
  });

  it('efeitos automáticos apontam para habilidades e Despertares existentes', () => {
    for (const id of Object.keys(EFEITOS_HAB)) expect(HAB[id], id).toBeDefined();
    for (const id of Object.keys(EFEITOS_DESP)) expect(DESP[id], id).toBeDefined();
  });
});

describe('despertares', () => {
  it('cobrem o d100 de 1 a 100 sem buracos nem sobreposição', () => {
    const faixas = [...DESPERTARES].sort((a, b) => a.d[0] - b.d[0]);
    let esperado = 1;
    for (const x of faixas) {
      expect(x.d[0], x.n).toBe(esperado);
      esperado = x.d[1] + 1;
    }
    expect(esperado).toBe(101);
  });

  it('afinidades são árvores válidas', () => {
    for (const x of DESPERTARES) {
      expect(x.afin).toHaveLength(2);
      for (const a of x.afin) expect(ARV[a], `${x.n} → ${a}`).toBeDefined();
    }
  });
});

describe('outros dados', () => {
  it('15 perícias e 12 títulos', () => {
    expect(PERICIAS).toHaveLength(15);
    expect(TITULOS).toHaveLength(12);
  });
});

describe('ameaças (capítulo 13)', () => {
  it('nível 5 (revisão 2: +2 × Bônus de Rank no ataque e na Reação; Chefe 50 + 35 × nível PV)', () => {
    expect(statsAmeaca(5, 'Lacaio')).toMatchObject({ pv: 14, atk: 11, reac: 10, defFixa: 20, dano: '1d6+5', cd: 16, res: 7 });
    expect(statsAmeaca(5, 'Soldado')).toMatchObject({ pv: 40, dano: '1d8+7', acoes: 1, rd: 0 });
    expect(statsAmeaca(5, 'Elite')).toMatchObject({ pv: 80, dano: '2d8+7', acoes: 1, rd: 1 });
    expect(statsAmeaca(5, 'Chefe')).toMatchObject({ pv: 225, dano: '3d8+10', acoes: 2, rd: 1 });
    // nível 1–4 não tem Bônus de Rank: igual ao livro antigo
    expect(statsAmeaca(1, 'Lacaio')).toMatchObject({ pv: 6, atk: 3, reac: 2, defFixa: 12, cd: 11, res: 1 });
  });

  it('bestiário: Orc Berserker e Dragão Ancião', () => {
    const orc = BESTIARIO.find((b) => b.n === 'Orc Berserker')!;
    expect(statsAmeaca(orc.L, orc.cat)).toMatchObject({ pv: 116, atk: 16, reac: 15, dano: '2d8+12', acoes: 2, rd: 1, cd: 20, res: 12 });
    const dragao = BESTIARIO.find((b) => b.n === 'Dragão Ancião')!;
    expect(statsAmeaca(dragao.L, dragao.cat)).toMatchObject({ pv: 1100, atk: 59, reac: 58, dano: '3d8+60', acoes: 7, rd: 7, cd: 50, res: 45 });
  });

  it('encontros do livro para 4 Jogadores, ajustando 1 inimigo por Jogador a mais ou a menos', () => {
    expect(gerarEncontro('Médio', 5)).toEqual([
      { cat: 'Soldado', nivel: 5, qtd: 3 },
      { cat: 'Lacaio', nivel: 5, qtd: 4 },
    ]);
    expect(gerarEncontro('Chefe', 5, 3)).toEqual([
      { cat: 'Chefe', nivel: 7, qtd: 1 },
      { cat: 'Elite', nivel: 5, qtd: 1 },
    ]);
    expect(gerarEncontro('Fácil', 30, 6)[0]).toEqual({ cat: 'Lacaio', nivel: 30, qtd: 8 });
    expect(gerarEncontro('Difícil', 30)[0].nivel).toBe(30); // não passa do 30
  });
});
