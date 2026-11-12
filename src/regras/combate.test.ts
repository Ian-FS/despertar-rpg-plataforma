import { describe, expect, it } from 'vitest';
import { iniciarCombate, ordenar, pressao, proximaVez, removerCombatente, sequencia, type Combatente } from './combate';

const c = (uid: string, iniciativa: number, acoes = 1, extra: Partial<Combatente> = {}): Combatente => ({
  uid,
  nome: uid,
  tipo: 'inimigo',
  iniciativa,
  desempate: 0,
  acoes,
  reacoes: 0,
  surpreso: false,
  ...extra,
});

describe('combate', () => {
  it('ordena pela iniciativa e desempata pelo mod AGI', () => {
    const r = ordenar([c('a', 10, 1, { desempate: 1 }), c('b', 15), c('c', 10, 1, { desempate: 3 })]);
    expect(r.map((x) => x.uid)).toEqual(['b', 'c', 'a']);
  });

  it('passadas: exemplo do livro A → B → Lacaio → A → B → A', () => {
    const seq = sequencia({ rodada: 1, combatentes: [c('Lacaio', 5, 1), c('A', 20, 3), c('B', 12, 2)] });
    expect(seq.map((v) => v.uid)).toEqual(['A', 'B', 'Lacaio', 'A', 'B', 'A']);
  });

  it('avança a vez, marca o início de turno só na 1ª passada e vira a rodada', () => {
    let r = iniciarCombate([c('A', 20, 2), c('B', 10)]);
    expect(r.estado.vez).toEqual({ uid: 'A', passada: 1 });
    expect(r.inicioTurno).toBe('A');
    r = proximaVez(r.estado);
    expect(r.estado.vez).toEqual({ uid: 'B', passada: 1 });
    r = proximaVez(r.estado);
    expect(r.estado.vez).toEqual({ uid: 'A', passada: 2 });
    expect(r.inicioTurno).toBeNull();
    r = proximaVez(r.estado);
    expect(r.novaRodada).toBe(true);
    expect(r.estado.rodada).toBe(2);
    expect(r.inicioTurno).toBe('A');
  });

  it('Pressão: −2 por Reação depois da primeira, zera no início do turno', () => {
    let r = iniciarCombate([c('A', 20), c('B', 10)]);
    r.estado.combatentes = r.estado.combatentes.map((x) => (x.uid === 'B' ? { ...x, reacoes: 2 } : x));
    expect(pressao(r.estado.combatentes[1])).toBe(-4);
    expect(pressao({ reacoes: 5 })).toBe(-6); // no máximo −6
    r = proximaVez(r.estado);
    expect(r.estado.combatentes.find((x) => x.uid === 'B')!.reacoes).toBe(0);
  });

  it('Surpreso não age na primeira rodada e volta na segunda', () => {
    let r = iniciarCombate([c('A', 20, 1, { surpreso: true }), c('B', 10)]);
    expect(r.estado.vez?.uid).toBe('B');
    r = proximaVez(r.estado);
    expect(r.estado.rodada).toBe(2);
    expect(r.estado.vez?.uid).toBe('A');
  });

  it('remover quem está na vez passa a vez antes', () => {
    const r0 = iniciarCombate([c('A', 20), c('B', 15), c('C', 10)]);
    const r = removerCombatente(r0.estado, 'A');
    expect(r.estado.vez?.uid).toBe('B');
    expect(r.inicioTurno).toBe('B');
    expect(r.estado.combatentes.map((x) => x.uid)).toEqual(['B', 'C']);
  });
});
