import { describe, expect, it } from 'vitest';
import { ativarEfeito } from './gatilhos';
import { novoPersonagem } from './personagem';
import { descreverMudanca, estavel, mesclarRemota } from './sincronia';

describe('sincronia em tempo real', () => {
  it('ignora a ordem das chaves', () => {
    expect(estavel({ b: 1, a: { d: 2, c: 3 } })).toBe(estavel({ a: { c: 3, d: 2 }, b: 1 }));
  });

  it('não faz nada quando a versão do banco é a mesma', () => {
    const p = novoPersonagem();
    expect(mesclarRemota(p, p, structuredClone(p))).toBeNull();
  });

  it('pega o dano do Mestre e mantém a anotação que o jogador ainda não gravou', () => {
    const salvo = novoPersonagem();
    salvo.pvAtual = 10;
    const local = { ...structuredClone(salvo), notas: 'escrevendo…' };
    const remota = { ...structuredClone(salvo), pvAtual: 6 };
    const r = mesclarRemota(local, salvo, remota)!;
    expect(r.pvAtual).toBe(6);
    expect(r.notas).toBe('escrevendo…');
  });

  it('descreve PV, condições e efeitos', () => {
    const antes = novoPersonagem();
    antes.pvAtual = 10;
    const depois = structuredClone(antes);
    depois.pvAtual = 6;
    ativarEfeito(depois, 'mestre', { nome: 'Veneno', rodadas: 2, condicao: 'Envenenado', porTurno: { formula: '1d4' } });
    expect(descreverMudanca(antes, depois)).toBe('PV 10 → 6 · +Envenenado · efeito Veneno');
    expect(descreverMudanca(depois, antes)).toBe('PV 6 → 10 · −Envenenado · Veneno terminou');
  });
});
