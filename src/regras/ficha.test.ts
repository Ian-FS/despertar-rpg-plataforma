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

describe('regras decididas em docs/divergencias.md', () => {
  const lutador = () => {
    const p = novoPersonagem();
    p.nivel = 10; // Rank C, BR 2
    p.atr = { FOR: 20, AGI: 10, VIT: 10, INT: 10, PER: 10, PRE: 10 };
    return p;
  };

  it('1. Punhos de Ferro: desarmado recebe o Bônus de Rank do personagem', () => {
    const p = lutador();
    const semPunhos = computarFicha(p).ataques[0];
    expect([semPunhos.atk, semPunhos.dado, semPunhos.bonus]).toEqual([15, '1d4', 10]);
    p.habs = [{ id: hab('Punhos de Ferro').id, nv: 3, gratis: true }];
    const comPunhos = computarFicha(p).ataques[0];
    expect([comPunhos.atk, comPunhos.dado, comPunhos.bonus]).toEqual([17, '1d10', 14]);
  });

  it('2. Arqueiro Nato: +1d4 de dano à distância (+1d4 nos níveis 3 e 5), só à distância', () => {
    const p = novoPersonagem('Arco');
    p.itens.push(Object.assign(armaComum('Espada'), { equip: true }));
    p.despertar = { id: desp('Arqueiro Nato').id, nv: 1 };
    const arco = () => computarFicha(p).ataques.find((a) => a.nome === 'Arco')!;
    const espada = () => computarFicha(p).ataques.find((a) => a.nome === 'Espada')!;
    expect(arco().dado).toBe('1d6+1d4');
    expect(arco().atk).toBe(1 + 1);
    expect(espada().dado).toBe('1d8');
    p.despertar.nv = 3;
    expect(arco().dado).toBe('1d6+2d4');
    p.despertar.nv = 5;
    expect(arco().dado).toBe('1d6+3d4');
  });

  it('3. Pele Resistente: RD só contra físico até o nível 3', () => {
    const p = novoPersonagem();
    p.atr.VIT = 12;
    p.habs = [{ id: hab('Pele Resistente').id, nv: 2, gratis: true }];
    expect([computarFicha(p).rd, computarFicha(p).rdFisico]).toEqual([0, 2]);
    p.habs[0].nv = 3;
    expect([computarFicha(p).rd, computarFicha(p).rdFisico]).toEqual([3, 0]);
    p.habs[0].nv = 5;
    expect(computarFicha(p).pvMax).toBe(11 + 10);
  });

  it('4. Olho de Falcão: o bônus vale só para Percepção visual', () => {
    const p = novoPersonagem();
    p.atr.PER = 16;
    p.habs = [{ id: hab('Olho de Falcão').id, nv: 2, gratis: true }];
    const f = computarFicha(p);
    expect(f.per['Percepção']).toBe(3);
    expect(f.perVisual).toBe(3 + 4);
  });

  describe('5. margem de crítico', () => {
    it('padrão é só o 20 natural', () => {
      const f = computarFicha(novoPersonagem());
      expect(f.ataques.map((a) => a.critico)).toEqual([20, 20]);
    });

    it('Domínio de Armas: 19–20 no nv3 e 18–20 no nv5, só com armas corpo a corpo', () => {
      const p = novoPersonagem('Espada');
      p.itens.push(Object.assign(armaComum('Arco'), { equip: true }));
      p.habs = [{ id: hab('Domínio de Armas').id, nv: 3, gratis: true }];
      const crit = () => Object.fromEntries(computarFicha(p).ataques.map((a) => [a.nome, a.critico]));
      expect(crit()).toEqual({ Desarmado: 20, Espada: 19, Arco: 20 });
      p.habs[0].nv = 5;
      expect(crit().Espada).toBe(18);
    });

    it('Katana com Refino +5 critica com 19–20', () => {
      const p = novoPersonagem('Katana');
      const katana = () => computarFicha(p).ataques.find((a) => a.nome === 'Katana')!.critico;
      expect(katana()).toBe(20);
      p.itens[0].refino = 5;
      expect(katana()).toBe(19);
    });

    it('Letal e Ponto Vital ampliam a margem, somando com as outras fontes', () => {
      const p = novoPersonagem('Espada');
      p.itens[0].afixos = [{ n: 'Letal', desc: '' }];
      p.habs = [{ id: hab('Domínio de Armas').id, nv: 3, gratis: true }];
      expect(computarFicha(p).ataques[1].critico).toBe(18); // 19 do Domínio, +1 do Letal
      p.habs.push({ id: hab('Ponto Vital').id, nv: 1, gratis: true });
      expect(computarFicha(p).ataques.map((a) => a.critico)).toEqual([19, 17]);
    });

    it('Arqueiro Nato nv5: ataques à distância com 19–20', () => {
      const p = novoPersonagem('Arco');
      p.despertar = { id: desp('Arqueiro Nato').id, nv: 5 };
      expect(computarFicha(p).ataques[1].critico).toBe(19);
    });
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

describe('condições mudam os números (capítulo 7)', () => {
  const base = () => {
    const p = novoPersonagem('Espada');
    p.itens.push(Object.assign(armaComum('Arco'), { equip: true }));
    p.atr = { FOR: 14, AGI: 14, VIT: 14, INT: 10, PER: 10, PRE: 10 };
    return p;
  };

  it('sem condições, nada muda', () => {
    const f = computarFicha(base());
    expect([f.desl, f.acoes, f.semReacao, f.semEsquiva, f.penTeste]).toEqual([10, 1, false, false, 0]);
  });

  it('Derrubado: −4 só em corpo a corpo e em Esquivar', () => {
    const p = base();
    const antes = computarFicha(p);
    p.condicoes = 'Derrubado';
    const f = computarFicha(p);
    expect(f.ataques.find((a) => a.nome === 'Espada')!.atk).toBe(antes.ataques.find((a) => a.nome === 'Espada')!.atk - 4);
    expect(f.ataques.find((a) => a.nome === 'Arco')!.atk).toBe(antes.ataques.find((a) => a.nome === 'Arco')!.atk);
    expect(f.esq).toBe(antes.esq - 4);
  });

  it('Exausto e Lento: deslocamento pela metade cada; Lento tira uma ação (mínimo 1)', () => {
    const p = base();
    p.nivel = 5; // 2 ações
    p.condicoes = 'Exausto, Lento';
    const f = computarFicha(p);
    expect(f.desl).toBe(2.5);
    expect(f.acoes).toBe(1);
    expect(f.per.Atletismo).toBe(2 - 2);
    expect(f.penTeste).toBe(-2);
  });

  it('Imobilizado, Atordoado, Envenenado e Cego', () => {
    const p = base();
    p.condicoes = 'Imobilizado, Atordoado, Envenenado, Cego';
    const f = computarFicha(p);
    expect([f.desl, f.semEsquiva, f.semReacao, f.acoes]).toEqual([0, true, true, 1]);
    expect(f.res.VIT).toBe(1 + 2 - 2);
    expect(f.ataques[0].atk).toBe(1 + 2 - 5);
    expect(f.efeitosCondicoes).toHaveLength(4);
  });
});
