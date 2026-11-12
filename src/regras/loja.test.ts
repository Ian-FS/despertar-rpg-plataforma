import { describe, expect, it } from 'vitest';
import { DESP } from './dados';
import { custoUso, USOS_DESPERTAR, usosDoDespertar } from './despertar-usos';
import { computarFicha } from './ficha';
import { aplicarCompra, aplicarVenda, montarItem, precoItem, precoPedido, textoAfixo, validarPedido, type Pedido } from './loja';
import { itemBase, novoPersonagem } from './personagem';
import { conflitosEquipamento } from './validacao';

describe('Loja do Sistema', () => {
  it('preços do livro: base do Rank × raridade; consumível 1/5 da base', () => {
    expect(precoItem({ cat: 'arma', rank: 'E', rar: 'Comum' })).toBe(50);
    expect(precoItem({ cat: 'arma', rank: 'C', rar: 'Incomum' })).toBe(1600);
    expect(precoItem({ cat: 'consumivel', rank: 'D', rar: 'Comum' })).toBe(40);
    expect(precoPedido({ cat: 'consumivel', base: 'Poção de Cura', rank: 'E', rar: 'Comum', qtd: 3 })).toBe(30);
  });

  it('só vende até o Rank do Jogador, Comum ou Incomum, com os afixos certos', () => {
    const p = novoPersonagem();
    p.ouro = 100_000;
    const espada: Pedido = { cat: 'arma', base: 'Espada', rank: 'E', rar: 'Comum' };
    expect(validarPedido(p, espada)).toBeNull();
    expect(validarPedido(p, { ...espada, rank: 'D' })).toMatch(/até o seu Rank/);
    expect(validarPedido(p, { ...espada, rar: 'Raro' as never })).toMatch(/Comuns e Incomuns/);
    expect(validarPedido(p, { ...espada, rar: 'Incomum' })).toMatch(/Escolha 1 afixo/);
    expect(validarPedido(p, { ...espada, rar: 'Incomum', afixos: ['Brutal'] })).toBeNull();
    // acessório Comum já vem com 1 afixo
    expect(validarPedido(p, { cat: 'acessorio', base: 'Anel', rank: 'E', rar: 'Comum', afixos: ['Forte'] })).toBeNull();
    expect(validarPedido(p, { cat: 'consumivel', base: 'Elixir de Despertar', rank: 'E', rar: 'Comum' })).toMatch(/indisponível/);
  });

  it('Ouro e espaço no inventário', () => {
    const p = novoPersonagem();
    p.ouro = 49;
    expect(validarPedido(p, { cat: 'arma', base: 'Espada', rank: 'E', rar: 'Comum' })).toMatch(/Ouro insuficiente/);
    p.ouro = 10_000;
    p.itens = Array.from({ length: 20 }, () => itemBase('outro', 'Pedra'));
    expect(validarPedido(p, { cat: 'arma', base: 'Espada', rank: 'E', rar: 'Comum' })).toMatch(/Inventário cheio/);
  });

  it('Incomum com afixo funciona na ficha; consumíveis empilham; venda devolve metade', () => {
    const p = novoPersonagem();
    p.itens = [];
    p.ouro = 1000;
    const it = aplicarCompra(p, { cat: 'arma', base: 'Espada', rank: 'E', rar: 'Incomum', afixos: ['Brutal'] });
    expect(p.ouro).toBe(900);
    expect(it.afixos[0].desc).toBe('+2 de dano.');
    it.equip = true;
    expect(computarFicha(p).ataques[1].bonus).toBe(2);
    aplicarCompra(p, { cat: 'consumivel', base: 'Poção de Cura', rank: 'E', rar: 'Comum', qtd: 2 });
    aplicarCompra(p, { cat: 'consumivel', base: 'Poção de Cura', rank: 'E', rar: 'Comum', qtd: 1 });
    expect(p.itens.filter((i) => i.cat === 'consumivel')).toHaveLength(1);
    expect(p.itens[1].qtd).toBe(3);
    expect(aplicarVenda(p, it.uid)).toBe(50);
    expect(p.ouro).toBe(900 - 30 + 50);
  });

  it('texto do afixo com X calculado', () => {
    expect(textoAfixo('+Xd4 de dano de fogo', 3)).toBe('+3d4 de dano de fogo');
    expect(textoAfixo('+5X PV máximos.', 2)).toBe('+10 PV máximos.');
    expect(montarItem({ cat: 'acessorio', base: 'Anel', rank: 'C', rar: 'Comum', afixos: ['Forte'] }).afixos[0].desc).toBe('+6 de Força.');
  });
});

describe('acessórios', () => {
  it('no máximo 2 anéis e 1 de cada outro tipo', () => {
    const p = novoPersonagem();
    const ac = (base: string) => itemBase('acessorio', base, { base, equip: true });
    p.itens = [ac('Anel'), ac('Anel'), ac('Colar')];
    expect(conflitosEquipamento(p)).toEqual([]);
    p.itens.push(ac('Anel'), ac('Colar'));
    expect(conflitosEquipamento(p).join(' | ')).toMatch(/Anel: no máximo 2.*Colar: no máximo 1/);
  });
});

describe('usos do Despertar', () => {
  it('todos os cadastrados existem, com id único e custo definido', () => {
    for (const [id, usos] of Object.entries(USOS_DESPERTAR)) {
      expect(DESP[id], id).toBeDefined();
      expect(new Set(usos.map((u) => u.id)).size, id).toBe(usos.length);
      for (const u of usos) expect(u.pm, `${id}.${u.id}`).toBeGreaterThanOrEqual(0);
    }
  });

  it('mantém os ids antigos (contadores e efeitos gravados nas fichas)', () => {
    const ids = (d: string) => USOS_DESPERTAR[d].map((u) => u.id);
    expect(ids('d01')).toEqual(['rd', 'forma']);
    expect(ids('d09')).toEqual(['furia']);
    expect(ids('d32')).toEqual(['erguer', 'invocar', 'trocar']);
    expect(ids('d04')).toEqual(['forma']); // Velocidade Divina: Forma sem custo, agora com botão
  });

  it('libera por nível do Despertar; Forma Evoluída exige nv5 e nível 20', () => {
    const p = novoPersonagem();
    p.despertar = { id: 'd23', nv: 1 }; // Passo Espacial
    expect(usosDoDespertar(p).map((u) => [u.nome, u.liberado])).toEqual([
      ['Teleporte', true],
      ['Teleporte de esquiva', false],
      ['Portal Pessoal', false],
    ]);
    p.despertar = { id: 'd01', nv: 5 };
    expect(usosDoDespertar(p).find((u) => u.forma)!.liberado).toBe(false);
    p.nivel = 20;
    expect(usosDoDespertar(p).find((u) => u.forma)!.liberado).toBe(true);
  });

  it('Lâmina de Mana sem custo no nv5; Sombras custam 2 PM por Rank', () => {
    const p = novoPersonagem();
    p.despertar = { id: 'd02', nv: 4 };
    const lamina = usosDoDespertar(p)[0];
    expect(custoUso(p, lamina)).toBe(1);
    p.despertar.nv = 5;
    expect(custoUso(p, lamina)).toBe(0);
    p.despertar = { id: 'd32', nv: 1 };
    const invocar = usosDoDespertar(p).find((u) => u.porRank)!;
    expect([custoUso(p, invocar, 'E'), custoUso(p, invocar, 'C'), custoUso(p, invocar, 'S')]).toEqual([2, 6, 12]);
  });
});
