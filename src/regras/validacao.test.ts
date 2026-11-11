import { describe, expect, it } from 'vitest';
import { aplicarAtributos, aplicarAvaliacao, aplicarDespertar, despertarDoD100 } from './criacao';
import { mesclarEdicaoJogador, validarFicha } from './validacao';
import { novoPersonagem, type Personagem } from './personagem';

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

/** Rafa logo após os sorteios: Normal, Passo Espacial, Golpe Furtivo grátis. */
function rafaSorteada(): Personagem {
  const p = novoPersonagem('Adaga');
  aplicarAtributos(p, { FOR: 15, AGI: 18, VIT: 14, INT: 13, PER: 17, PRE: 12 }, { ph: 1, st: 3 }, 'Normal');
  aplicarDespertar(p, despertarDoD100(85).id);
  aplicarAvaliacao(p, 'vul2');
  return p;
}

describe('edição do jogador', () => {
  it('a criação completa da Rafa passa', () => {
    const antes = rafaSorteada();
    const edicao = clone(antes);
    edicao.atr.AGI = 21;
    edicao.statusPend = 0;
    edicao.habs = [
      { id: 'vul2', nv: 2, gratis: true },
      { id: 'vul1', nv: 1, gratis: false },
      { id: 'sen1', nv: 1, gratis: false },
    ];
    edicao.pericias = { Furtividade: 2, Percepção: 2 };
    const depois = mesclarEdicaoJogador(antes, edicao);
    expect(validarFicha(antes, depois)).toEqual([]);
  });

  it('campos protegidos não mudam pela edição do jogador', () => {
    const antes = rafaSorteada();
    const edicao = { ...clone(antes), nivel: 20, xp: 999, phExtra: 50, despertar: { id: 'd32', nv: 1 }, atrBase: { FOR: 30 } };
    const depois = mesclarEdicaoJogador(antes, edicao);
    expect([depois.nivel, depois.xp, depois.phExtra, depois.despertar.id]).toEqual([1, 0, 0, antes.despertar.id]);
    expect(depois.atrBase).toEqual(antes.atrBase);
  });

  it('não dá para inventar Pontos de Status nem baixar um atributo para subir outro', () => {
    const antes = rafaSorteada();
    const a = clone(antes);
    a.atr.AGI = 25; // +7 com só 3 pendentes
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, a))[0]).toMatch(/Pontos de Status/);
    const b = clone(antes);
    b.atr.FOR = 13;
    b.atr.AGI = 20;
    b.statusPend = 3;
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, b)).join()).toMatch(/FOR não pode ficar abaixo/);
  });

  it('habilidade grátis só pela Avaliação; requisitos e PH são conferidos', () => {
    const antes = rafaSorteada();
    const gratis = clone(antes);
    gratis.habs.push({ id: 'lam1', nv: 1, gratis: true });
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, gratis)).join()).toMatch(/não foi recebida de graça/);

    const semReq = clone(antes);
    semReq.habs.push({ id: 'vul3', nv: 1, gratis: false }); // Rastro Fantasma: Nível 5
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, semReq)).join()).toMatch(/Rastro Fantasma: falta Nível 5/);

    const caro = clone(antes);
    caro.habs = [{ id: 'vul2', nv: 5, gratis: true }]; // 2+3+4+5 = 14 PH, tem 4
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, caro)).join()).toMatch(/Faltam 10 PH/);
  });

  it('perícias: total e grau máximo do nível', () => {
    const antes = rafaSorteada();
    const e = clone(antes);
    e.pericias = { Furtividade: 3 };
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, e)).join()).toMatch(/grau máximo no nível 1 é 2/);
    e.pericias = { Furtividade: 2, Percepção: 2, Atletismo: 1 };
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, e)).join()).toMatch(/5 pontos usados de 4/);
  });

  it('Título só se tiver sido conquistado', () => {
    const antes = rafaSorteada();
    const e = { ...clone(antes), titulo: 't01' };
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, e)).join()).toMatch(/Título/);
    antes.titulosObtidos = ['t01'];
    expect(validarFicha(antes, mesclarEdicaoJogador(antes, e))).toEqual([]);
  });
});
