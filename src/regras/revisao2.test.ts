/* Regras que mudaram na revisão 2 do sistema (site do Maickon, 12/11/2026). */
import { describe, expect, it } from 'vitest';
import { STATUS_POR_NIVEL } from './criacao';
import { custoEmPV, pagarPM } from './custo';
import { computarFicha } from './ficha';
import { aoMudarPV, aplicarEvento, ativarEfeito } from './gatilhos';
import { montarItem } from './loja';
import { itemBase, novoPersonagem } from './personagem';
import { chavesDespertar, chavesHabilidade, efeitoDespertar, efeitoHabilidade, previaPoder, resolverPoder } from './poderes';

const fixo = (v: number) => () => v;

describe('revisão 2', () => {
  it('Pontos de Status: sempre 2 por nível', () => {
    expect(STATUS_POR_NIVEL).toBe(2);
  });

  it('Exaustão de Mana: gasta os PM que tem e paga só a diferença em dobro (sem chegar a 0 PV)', () => {
    const p = novoPersonagem();
    p.pmAtual = 4;
    p.pvAtual = 20;
    expect(custoEmPV(p, 10)).toEqual({ pm: 4, pv: 12, hemomancia: false });
    expect(pagarPM(p, 'Teste', 10, true).mensagem).toMatch(/4 PM e 12 PV/);
    expect([p.pmAtual, p.pvAtual, p.condicoes]).toEqual([0, 8, 'Exausto']);
    // 8 PV: pagar 6 de diferença custaria 12 PV, e sobraria menos de 1
    expect(custoEmPV(p, 6)).toBeNull();
    expect(pagarPM(p, 'Teste', 6, true).erro).toMatch(/PV insuficientes/);
  });

  it('Hemomancia: paga o custo inteiro em PV, sem Exaustão', () => {
    const p = novoPersonagem();
    p.despertar = { id: 'd28', nv: 1 };
    p.pmAtual = 0;
    p.pvAtual = 10;
    expect(pagarPM(p, 'Teste', 3, true).mensagem).toMatch(/Hemomancia/);
    expect([p.pvAtual, p.condicoes]).toEqual([7, '']);
  });

  it('No Limite: a 0 PV cai Derrubado e fica com 1 Ação Principal; morre em −PV máximos', () => {
    const p = novoPersonagem();
    p.nivel = 10;
    const f0 = computarFicha(p);
    expect(f0.acoes).toBe(3);
    p.pvAtual = -5;
    expect(aoMudarPV(p, 3).join(' ')).toMatch(/No Limite/);
    expect(p.condicoes).toBe('Derrubado');
    const f = computarFicha(p);
    expect([f.noLimite, f.acoes, f.pvMorte]).toEqual([true, 1, -f.pvMax]);
  });

  it('No Limite: Fortaleza Viva nv3 mantém as Ações; Corpo Imortal morre só em −2× PV', () => {
    const p = novoPersonagem();
    p.nivel = 10;
    p.pvAtual = -1;
    p.habs = [{ id: 'bas6', nv: 3, gratis: false }];
    expect(computarFicha(p).acoes).toBe(3);
    p.habs = [];
    p.despertar = { id: 'd30', nv: 1 };
    const f = computarFicha(p);
    expect(f.pvMorte).toBe(-2 * f.pvMax);
  });

  it('veneno que leva a 0 PV no início do turno deixa No Limite; fim do combate No Limite desmaia', () => {
    const p = novoPersonagem();
    p.pvAtual = 2;
    ativarEfeito(p, 'mestre', { nome: 'Veneno', rodadas: 3, condicao: 'Envenenado', porTurno: { formula: '5' } });
    const r = aplicarEvento(p, 'inicioTurno', fixo(1));
    expect(r.linhas.join(' ')).toMatch(/No Limite/);
    expect(p.condicoes).toContain('Derrubado');
    expect(aplicarEvento(p, 'fimCombate').linhas.join(' ')).toMatch(/Inconsciente/);
    aplicarEvento(p, 'descansoLongo');
    expect(p.condicoes).not.toContain('Inconsciente');
  });

  it('Imortal Menor (Sangue Fervente, Forma): volta a 25% dos PV, 1× por dia', () => {
    const p = novoPersonagem();
    p.nivel = 20;
    p.despertar = { id: 'd12', nv: 5 };
    const max = computarFicha(p).pvMax;
    p.pvAtual = -3;
    expect(aoMudarPV(p, 4).join(' ')).toMatch(/Imortal Menor/);
    expect(p.pvAtual).toBe(Math.floor(max / 4));
    p.pvAtual = -3;
    expect(aoMudarPV(p, 4).join(' ')).toMatch(/No Limite/);
  });

  it('escudo: Refino dá RD, não Defender', () => {
    const p = novoPersonagem();
    const sem = computarFicha(p);
    p.itens = [...p.itens.filter((i) => i.cat !== 'escudo'), itemBase('escudo', 'Escudo', { equip: true, refino: 3 })];
    const f = computarFicha(p);
    expect(f.def - sem.def).toBe(2); // +2 do escudo (Rank E: Bônus de Rank 0)
    expect(f.rd - sem.rd).toBe(3);
  });

  it('afixo repetido em dois itens não soma: vale o maior', () => {
    const p = novoPersonagem();
    const anel = (rank: 'E' | 'C') => ({ ...montarItem({ cat: 'acessorio', base: 'Anel', rank, rar: 'Comum', afixos: ['Forte'] }), equip: true });
    p.itens = [anel('E')];
    const um = computarFicha(p).atr.FOR;
    p.itens = [anel('E'), anel('C')];
    const dois = computarFicha(p).atr.FOR;
    p.itens = [anel('C')];
    expect(dois).toBe(computarFicha(p).atr.FOR);
    expect(dois).toBeGreaterThan(um);
  });

  it('poderes de área somam mod + metade do Nível, como o texto novo escreve', () => {
    const p = novoPersonagem();
    p.nivel = 10;
    p.atr.INT = 16; // mod +3
    p.habs = [{ id: 'ele3', nv: 1, gratis: false }];
    expect(previaPoder(p, efeitoHabilidade(p, 'ele3')!, chavesHabilidade('ele3')).dano).toBe('Dano 3d6+8');
    p.despertar = { id: 'd29', nv: 1 };
    p.atr.VIT = 18; // mod +4: o sopro usa VIT
    expect(previaPoder(p, efeitoDespertar(p, 'sopro')!, chavesDespertar('d29')).dano).toBe('Dano 4d10+9');
  });

  it('1 natural no ataque erra sempre: não rola dano', () => {
    const p = novoPersonagem();
    p.habs = [{ id: 'ele1', nv: 1, gratis: false }];
    const r = resolverPoder(p, efeitoHabilidade(p, 'ele1')!, chavesHabilidade('ele1'), fixo(1));
    expect(r.rolagens.map((x) => x.tipo)).toEqual(['ataque']);
    expect(r.rolagens[0].rotulo).toMatch(/1 natural/);
  });
});
