import { describe, expect, it } from 'vitest';
import { DESP, HAB } from './dados';
import { USOS_DESPERTAR } from './despertar-usos';
import { computarFicha } from './ficha';
import {
  aoZerarPM,
  aplicarEvento,
  ativarEfeito,
  erroLimite,
  limiteDespertar,
  limiteHabilidade,
  registrarUso,
} from './gatilhos';
import { novoPersonagem } from './personagem';
import { efeitoDespertar, efeitoHabilidade } from './poderes';

const fixo = (v: number) => () => v;
const hab = (id: string, nv: number) => ({ id, nv, gratis: false });

describe('limites de uso', () => {
  it('lê a frequência do livro e as melhorias por nível', () => {
    expect(limiteHabilidade('lam8', 1)).toMatchObject({ por: 'combate', max: 1 });
    expect(limiteHabilidade('lam8', 5)).toMatchObject({ por: 'combate', max: 2 });
    expect(limiteHabilidade('ele8', 1)).toMatchObject({ por: 'dia', max: 1 });
    expect(limiteHabilidade('ele8', 5)).toMatchObject({ por: 'combate', max: 1 });
    expect(limiteHabilidade('sen8', 3)?.max).toBe(2);
    expect(limiteHabilidade('lam2', 1)).toBeNull();
    const forma = USOS_DESPERTAR.d01.find((u) => u.forma)!;
    expect(limiteDespertar('d01', forma)).toMatchObject({ por: 'combate', max: 1 });
  });

  it('toda habilidade com "1× por" no livro tem limite', () => {
    for (const h of Object.values(HAB)) if (/1× por (combate|dia)/.test(h.freq ?? '')) expect(limiteHabilidade(h.id, 1), h.id).not.toBeNull();
  });

  it('esgota e libera no fim do combate; "por dia" só no descanso longo', () => {
    const p = novoPersonagem();
    const combate = limiteHabilidade('lam8', 1)!;
    const dia = limiteHabilidade('ele8', 1)!;
    registrarUso(p, combate);
    registrarUso(p, dia);
    expect(erroLimite(p, 'Corte', combate)).toMatch(/já usado/);
    aplicarEvento(p, 'fimCombate');
    expect(erroLimite(p, 'Corte', combate)).toBeNull();
    expect(erroLimite(p, 'Cataclismo', dia)).toMatch(/dia/);
    aplicarEvento(p, 'descansoLongo');
    expect(erroLimite(p, 'Cataclismo', dia)).toBeNull();
  });
});

describe('efeitos ativos', () => {
  it('Fúria soma na ficha, dura 10 turnos e acaba sozinha', () => {
    const p = novoPersonagem();
    p.despertar = { id: 'd09', nv: 1 };
    const antes = computarFicha(p);
    const ef = efeitoDespertar(p, 'furia')!.ativo!;
    ativarEfeito(p, 'desp:d09.furia', ef);
    const f = computarFicha(p);
    expect(f.rd).toBe(antes.rd + 2);
    expect(f.esq).toBe(antes.esq - 2);
    expect(f.ataques[1].bonus).toBe(antes.ataques[1].bonus + 2);
    for (let i = 0; i < 9; i++) aplicarEvento(p, 'inicioTurno');
    expect(p.efeitosAtivos).toHaveLength(1);
    const r = aplicarEvento(p, 'inicioTurno');
    expect(p.efeitosAtivos).toHaveLength(0);
    expect(r.linhas).toContain('Fúria terminou.');
  });

  it('usar de novo renova em vez de acumular', () => {
    const p = novoPersonagem();
    p.habs = [hab('aur1', 1)];
    const ef = efeitoHabilidade(p, 'aur1')!.ativo!;
    ativarEfeito(p, 'hab:aur1', ef);
    ativarEfeito(p, 'hab:aur1', ef);
    expect(p.efeitosAtivos).toHaveLength(1);
  });

  it('Modo Limite deixa Exausto ao terminar (e o fim do combate também encerra)', () => {
    const p = novoPersonagem();
    p.habs = [hab('aur7', 1)];
    ativarEfeito(p, 'hab:aur7', efeitoHabilidade(p, 'aur7')!.ativo!);
    aplicarEvento(p, 'fimCombate');
    expect(p.efeitosAtivos).toHaveLength(0);
    expect(p.condicoes).toBe('Exausto');
  });

  it('veneno do Mestre: põe a condição, rola no início do turno e some no fim', () => {
    const p = novoPersonagem();
    const pvMax = computarFicha(p).pvMax;
    ativarEfeito(p, 'mestre', { nome: 'Veneno', rodadas: 2, condicao: 'Envenenado', porTurno: { formula: '1d4' } });
    expect(p.condicoes).toBe('Envenenado');
    let r = aplicarEvento(p, 'inicioTurno', fixo(3));
    expect(r.rolagens).toHaveLength(1);
    expect(p.pvAtual).toBe(pvMax - 3);
    r = aplicarEvento(p, 'inicioTurno', fixo(3));
    expect(p.pvAtual).toBe(pvMax - 6);
    expect(p.efeitosAtivos).toHaveLength(0);
    expect(p.condicoes).toBe('');
  });
});

describe('passivas com gatilho', () => {
  it('Circulação de Mana: +1 PM por nível no início do turno, até o máximo', () => {
    const p = novoPersonagem();
    p.habs = [hab('aur2', 2)];
    const max = computarFicha(p).pmMax;
    p.pmAtual = 0;
    aplicarEvento(p, 'inicioTurno');
    expect(p.pmAtual).toBe(2);
    p.pmAtual = max;
    aplicarEvento(p, 'inicioTurno');
    expect(p.pmAtual).toBe(max);
  });

  it('Fôlego de Combate só abaixo da metade; nv5 remove uma condição', () => {
    const p = novoPersonagem();
    p.habs = [hab('pun4', 5)];
    p.nivel = 5;
    const max = computarFicha(p).pvMax;
    p.pvAtual = max;
    p.condicoes = 'Lento';
    aplicarEvento(p, 'inicioTurno');
    expect(p.condicoes).toBe('Lento');
    p.pvAtual = 1;
    aplicarEvento(p, 'inicioTurno');
    expect(p.pvAtual).toBe(1 + 10);
    expect(p.condicoes).toBe('');
  });

  it('Sangue Fervente e Corpo Imortal regeneram; Corpo Imortal mesmo abaixo de 0', () => {
    const p = novoPersonagem();
    p.despertar = { id: 'd30', nv: 2 };
    p.pvAtual = -5;
    aplicarEvento(p, 'inicioTurno');
    expect(p.pvAtual).toBe(1);
    expect(DESP.d12).toBeDefined();
  });

  it('descanso curto: 1/4, ou metade com Sangue Fervente (PV) e Circulação nv3 (PM); avisa no 3º', () => {
    const p = novoPersonagem();
    p.atr.VIT = 18;
    p.atr.INT = 18;
    p.nivel = 5;
    p.despertar = { id: 'd12', nv: 1 };
    p.habs = [hab('aur2', 3)];
    const f = computarFicha(p);
    p.pvAtual = 0;
    p.pmAtual = 0;
    aplicarEvento(p, 'descansoCurto');
    expect(p.pvAtual).toBe(Math.floor(f.pvMax / 2));
    expect(p.pmAtual).toBe(Math.floor(f.pmMax / 2));
    aplicarEvento(p, 'descansoCurto');
    expect(aplicarEvento(p, 'descansoCurto').linhas.join(' ')).toMatch(/3º descanso curto/);
    aplicarEvento(p, 'descansoLongo');
    expect(aplicarEvento(p, 'descansoCurto').linhas.join(' ')).not.toMatch(/Atenção/);
  });

  it('Circulação de Mana nv5: ao zerar o PM, recupera metade uma vez por dia', () => {
    const p = novoPersonagem();
    p.habs = [hab('aur2', 5)];
    const max = computarFicha(p).pmMax;
    p.pmAtual = 0;
    expect(aoZerarPM(p)).toMatch(/recuperou/);
    expect(p.pmAtual).toBe(Math.floor(max / 2));
    p.pmAtual = 0;
    expect(aoZerarPM(p)).toBeNull();
  });
});
