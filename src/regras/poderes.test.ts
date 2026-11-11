import { describe, expect, it } from 'vitest';
import { HAB } from './dados';
import { computarFicha } from './ficha';
import { USOS_DESPERTAR } from './despertar-usos';
import { armaComum, novoPersonagem } from './personagem';
import {
  chavesDespertar,
  chavesHabilidade,
  dobrarDados,
  efeitoHabilidade,
  PODERES_DESP,
  PODERES_HAB,
  previaPoder,
  resolverPoder,
} from './poderes';

const fixo = (v: number) => () => v;

describe('tabela de poderes', () => {
  it('só cita habilidades ativas e poderes do Despertar que existem', () => {
    for (const id of Object.keys(PODERES_HAB)) expect(HAB[id]?.tipo, id).toBe('Ativa');
    for (const chave of Object.keys(PODERES_DESP)) {
      const [desp, uso] = chave.split('.');
      expect(USOS_DESPERTAR[desp]?.some((u) => u.id === uso), chave).toBe(true);
    }
  });

  it('todas as fórmulas rolam do nível 1 ao 5', () => {
    const p = novoPersonagem();
    p.itens.push({ ...armaComum('Espada'), equip: true });
    for (const [id, def] of Object.entries(PODERES_HAB))
      for (let nv = 1; nv <= 5; nv++) {
        const r = resolverPoder(p, def(nv), chavesHabilidade(id), fixo(1));
        for (const x of r.rolagens) expect(Number.isFinite(x.r.total), `${id} nv${nv} ${x.rotulo}`).toBe(true);
      }
    for (const [k, def] of Object.entries(PODERES_DESP))
      for (let nv = 1; nv <= 5; nv++) resolverPoder(p, def(nv), chavesDespertar(k.split('.')[0]), fixo(1));
  });
});

describe('CD e Resistência', () => {
  it('CD = 10 + Nível + mod do atributo-chave (+ bônus do poder)', () => {
    const p = novoPersonagem();
    p.atr.FOR = 16; // mod +3
    p.habs = [{ id: 'lam4', nv: 1, gratis: false }];
    const ef = efeitoHabilidade(p, 'lam4')!;
    expect(previaPoder(p, ef, chavesHabilidade('lam4')).resistencia).toMatch(/^CD 14 · Resistência \(VIT\)/);
    p.habs[0].nv = 3; // A CD do Atordoamento recebe +2
    expect(previaPoder(p, efeitoHabilidade(p, 'lam4')!, chavesHabilidade('lam4')).resistencia).toMatch(/^CD 16/);
  });

  it('"A/B" usa o atributo de maior modificador', () => {
    const p = novoPersonagem();
    p.atr.VIT = 10;
    p.atr.PRE = 18;
    p.habs = [{ id: 'aur3', nv: 2, gratis: false }]; // +1 de CD por nível acima do 1º
    expect(previaPoder(p, efeitoHabilidade(p, 'aur3')!, ['VIT', 'PRE']).resistencia).toMatch(/^CD 16/); // 10 + 1 + 4 + 1
  });
});

describe('rolagens', () => {
  it('ataque com arma soma o dano da arma e os dados do poder', () => {
    const p = novoPersonagem();
    p.itens.push({ ...armaComum('Espada'), equip: true });
    p.habs = [{ id: 'lam2', nv: 2, gratis: false }];
    const r = resolverPoder(p, efeitoHabilidade(p, 'lam2')!, ['AGI'], fixo(2));
    expect(r.rolagens.map((x) => x.tipo)).toEqual(['ataque', 'dano']);
    expect(r.rolagens[1].r.formula).toMatch(/^1d8\+2d6/);
  });

  it('crítico rola todos os dados duas vezes; modificadores não dobram', () => {
    expect(dobrarDados('1d8+2d6+5')).toBe('2d8+4d6+5');
    const p = novoPersonagem();
    p.habs = [{ id: 'ele1', nv: 1, gratis: false }];
    const r = resolverPoder(p, efeitoHabilidade(p, 'ele1')!, ['INT'], fixo(20));
    expect(r.rolagens[1].dobrado).toBe(true);
    expect(r.rolagens[1].r.formula.startsWith('2d10')).toBe(true);
  });

  it('Golpe Devastador multiplica o total', () => {
    const p = novoPersonagem();
    p.habs = [{ id: 'pun8', nv: 2, gratis: false }];
    const r = resolverPoder(p, efeitoHabilidade(p, 'pun8')!, ['FOR'], fixo(2));
    const desarmado = computarFicha(p).ataques[0]; // 1d4 → 2 com o sorteio fixo
    expect(r.rolagens[1].r.total).toBe((2 + desarmado.bonus) * 3 + 10);
  });

  it('cura e dano no próprio usuário', () => {
    const p = novoPersonagem();
    p.habs = [{ id: 'aur4', nv: 1, gratis: false }];
    const r = resolverPoder(p, efeitoHabilidade(p, 'aur4')!, ['VIT'], fixo(3));
    expect(r.danoProprio).toBe(3);
    p.habs = [{ id: 'res1', nv: 1, gratis: false }];
    expect(resolverPoder(p, efeitoHabilidade(p, 'res1')!, ['INT'], fixo(3)).rolagens[0].tipo).toBe('cura');
  });
});
