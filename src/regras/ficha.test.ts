import { describe, expect, it } from 'vitest';
import { DESPERTARES, HABILIDADES } from './dados';
import {
  checarRequisitos,
  computarFicha,
  custoAquisicao,
  custoProximo,
  mod,
  phDisponiveis,
  phGasto,
  rankDoNivel,
  requisitosOk,
} from './ficha';
import { armaComum, armaduraComum, escudoComum, novoPersonagem, type Personagem } from './personagem';

const hab = (nome: string) => {
  const h = HABILIDADES.find((x) => x.n === nome);
  if (!h) throw new Error(`habilidade não encontrada: ${nome}`);
  return h;
};
const desp = (nome: string) => {
  const d = DESPERTARES.find((x) => x.n === nome);
  if (!d) throw new Error(`despertar não encontrado: ${nome}`);
  return d;
};

/** Exemplo completo do capítulo 3: Rafa. */
function rafa(): Personagem {
  const p = novoPersonagem('Adaga');
  p.nome = 'Rafa';
  p.potencial = 'Normal';
  p.compPot = { ph: 1, st: 3 };
  // FOR 15, AGI 18 (+3 Status = 21), VIT 14, INT 13, PER 17, PRE 12
  p.atr = { FOR: 15, AGI: 21, VIT: 14, INT: 13, PER: 17, PRE: 12 };
  p.despertar = { id: desp('Passo Espacial').id, nv: 1 }; // Épico: sem compensação
  p.habs = [
    { id: hab('Golpe Furtivo').id, nv: 2, gratis: true }, // Avaliação do Sistema + nv2 (2 PH)
    { id: hab('Passos Silenciosos').id, nv: 1, gratis: false }, // 1 PH
    { id: hab('Detectar Mana').id, nv: 1, gratis: false }, // 1 PH
  ];
  p.pericias = { Furtividade: 2, Percepção: 2 };
  return p;
}

describe('modificador', () => {
  it('segue a tabela do capítulo 4', () => {
    expect(mod(1)).toBe(-5);
    expect(mod(3)).toBe(-4);
    expect(mod(9)).toBe(-1);
    expect(mod(10)).toBe(0);
    expect(mod(11)).toBe(0);
    expect(mod(21)).toBe(5);
    expect(mod(60)).toBe(25);
  });
});

describe('Rank pelo nível', () => {
  it('sobe nos níveis 5, 10, 15, 20 e 25', () => {
    expect(rankDoNivel(1)).toBe('E');
    expect(rankDoNivel(4)).toBe('E');
    expect(rankDoNivel(5)).toBe('D');
    expect(rankDoNivel(14)).toBe('C');
    expect(rankDoNivel(25)).toBe('S');
    expect(rankDoNivel(30)).toBe('S');
  });
});

describe('exemplo da Rafa (capítulo 3)', () => {
  const p = rafa();
  const f = computarFicha(p);

  it('valores derivados batem com o livro', () => {
    expect(f.pvMax).toBe(12); // 10 + VIT +2
    expect(f.pmMax).toBe(11); // 10 + INT +1
    expect(f.desl).toBe(11); // 9 + metade de AGI +5
    expect(f.esq).toBe(6); // Nível 1 + AGI 5
    const adaga = f.ataques.find((a) => a.nome === 'Adaga');
    expect(adaga?.atk).toBe(6); // Nível 1 + AGI 5
  });

  it('outros valores do nível 1', () => {
    expect(f.acoes).toBe(1);
    expect(f.ini).toBe(5);
    expect(f.def).toBe(4); // Nível 1 + FOR 2 + Traje 1
    expect(f.defPassiva).toBe(11);
    expect(f.cd.AGI).toBe(16); // 10 + 1 + 5
    expect(f.res.VIT).toBe(3);
    expect(f.periciaMax).toBe(2);
    expect(f.periciaTotal).toBe(4);
  });

  it('Passos Silenciosos soma +2 em Furtividade', () => {
    expect(f.per.Furtividade).toBe(9); // AGI 5 + grau 2 + Passos 2
    expect(f.per.Percepção).toBe(5); // PER 3 + grau 2
  });

  it('dano da adaga: 1d4 + AGI + metade do nível', () => {
    const adaga = f.ataques.find((a) => a.nome === 'Adaga');
    expect(adaga?.dado).toBe('1d4');
    expect(adaga?.bonus).toBe(5);
  });

  it('gasta exatamente os 4 PH (3 + 1 do Potencial)', () => {
    expect(phGasto(p)).toBe(4);
    expect(phDisponiveis(p)).toBe(0);
  });

  it('afinidade Vulto do Passo Espacial não baixa Rank E abaixo de 1 PH', () => {
    expect(custoAquisicao(hab('Passos Silenciosos'), p)).toBe(1);
  });
});

describe('exemplo do Jin contra o Orc (capítulo 6)', () => {
  it('Jin nível 5, FOR 16, espada: ataque +8 e dano 1d8+5', () => {
    const p = novoPersonagem('Espada');
    p.nivel = 5;
    p.atr = { FOR: 16, AGI: 10, VIT: 10, INT: 10, PER: 10, PRE: 10 };
    const f = computarFicha(p);
    const espada = f.ataques.find((a) => a.nome === 'Espada');
    expect(espada?.atk).toBe(8); // 12 rolado + 8 = 20, como no livro
    expect(espada?.dado).toBe('1d8');
    expect(espada?.bonus).toBe(5); // FOR 3 + metade do nível 2
  });
});

describe('progressão', () => {
  it('PV e PM sobem por nível com mínimo de +1', () => {
    const p = novoPersonagem();
    p.atr = { FOR: 10, AGI: 10, VIT: 14, INT: 1, PER: 10, PRE: 10 };
    p.nivel = 5;
    const f = computarFicha(p);
    expect(f.pvMax).toBe(12 + 4 * 7); // 10+2, depois +5+2 por nível
    expect(f.pmMax).toBe(5 + 4 * 1); // 10−5, depois máx(1, 4−5) = 1 por nível
    expect(f.acoes).toBe(2);
  });

  it('níveis grátis do Despertar a cada novo Rank', () => {
    const p = novoPersonagem();
    p.despertar = { id: desp('Fúria').id, nv: 3 };
    p.nivel = 4;
    expect(phGasto(p)).toBe(2 + 3);
    p.nivel = 5; // nível 2 do Despertar fica grátis
    expect(phGasto(p)).toBe(3);
    p.nivel = 10; // níveis 2 e 3 grátis
    expect(phGasto(p)).toBe(0);
  });
});

describe('equipamento', () => {
  it('armadura pesada e escudo somam em Defender e penalizam Esquivar', () => {
    const p = novoPersonagem();
    p.atr.FOR = 14;
    p.itens = [armaduraComum('Pesada'), escudoComum()];
    p.itens.forEach((i) => (i.equip = true));
    const f = computarFicha(p);
    expect(f.def).toBe(1 + 2 + 3 + 2);
    expect(f.esq).toBe(1 + 0 - 3);
    expect(f.defPassiva).toBe(13);
  });

  it('item de Rank sem o atributo exigido funciona como Rank E', () => {
    const p = novoPersonagem();
    p.atr.FOR = 13; // Rank D exige 14
    const espadaD = armaComum('Espada', 'D');
    espadaD.equip = true;
    p.itens = [espadaD];
    expect(computarFicha(p).ataques[1].atk).toBe(1 + 1);
    p.atr.FOR = 14;
    expect(computarFicha(p).ataques[1].atk).toBe(1 + 2 + 1);
    expect(computarFicha(p).ataques[1].bonus).toBe(2 + 0 + 2); // FOR + Nv÷2 + 2×BR
  });
});

describe('requisitos de habilidade', () => {
  it('bloqueia por nível, atributo e pré-requisito', () => {
    const p = rafa();
    const rastro = hab('Rastro Fantasma');
    expect(requisitosOk(rastro, p)).toBe(false);
    expect(checarRequisitos(rastro, p).filter((r) => !r.ok).map((r) => r.txt)).toEqual([
      'Nível 5',
      'Passos Silenciosos nv2',
    ]);
    p.nivel = 5;
    p.habs.find((x) => x.id === hab('Passos Silenciosos').id)!.nv = 2;
    expect(requisitosOk(rastro, p)).toBe(true);
  });

  it('custo do próximo passo', () => {
    const p = rafa();
    expect(custoProximo(hab('Golpe Furtivo').id, p)).toBe(3);
    expect(custoProximo(hab('Rastro Fantasma').id, p)).toBe(1); // Rank D (2) − afinidade Vulto
    expect(custoProximo(hab('Cura').id, p)).toBe(1);
  });
});
