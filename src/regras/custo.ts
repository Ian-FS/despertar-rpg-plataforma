/* Pagar o custo de PM de um poder (revisão 2 das regras).
   - Com PM suficiente: paga em PM.
   - Exaustão de Mana: gasta todos os PM que tem e paga só a diferença, em dobro, com PV; fica Exausto.
     Ex.: custo 10 com 4 PM → gasta 4 PM e 12 PV. Não pode se levar a 0 PV ou menos assim.
   - Hemomancia (d28): paga o custo inteiro em PV (1 por PM), sem ficar Exausto, também sem chegar a 0 PV. */
import { computarFicha, condicoesAtivas } from './ficha';
import type { Personagem } from './personagem';

/** Despertares que pagam PM com PV sem Exaustão (Hemomancia). */
export const PAGA_PM_COM_PV = new Set(['d28']);

/** Quanto custaria pagar com PV agora (Exaustão de Mana ou Hemomancia). null = não dá (sobraria 0 PV ou menos). */
export function custoEmPV(p: Personagem, custo: number): { pm: number; pv: number; hemomancia: boolean } | null {
  const f = computarFicha(p);
  const pm = p.pmAtual ?? f.pmMax;
  const pvAtual = p.pvAtual ?? f.pvMax;
  const hemomancia = PAGA_PM_COM_PV.has(p.despertar.id);
  const r = hemomancia ? { pm: 0, pv: custo, hemomancia } : { pm, pv: 2 * Math.max(0, custo - pm), hemomancia };
  return pvAtual - r.pv > 0 ? r : null;
}

/** Desconta o custo. `comPV`: sem PM suficiente, usa a Exaustão de Mana (ou a Hemomancia). */
export function pagarPM(p: Personagem, nome: string, custo: number, comPV: boolean): { mensagem?: string; erro?: string } {
  const f = computarFicha(p);
  const pm = p.pmAtual ?? f.pmMax;
  const pv = p.pvAtual ?? f.pvMax;
  if (custo <= 0) return { mensagem: `${nome}: sem custo de PM.` };
  // com PM suficiente paga em PM; só a Hemomancia pode escolher pagar em PV mesmo assim
  if (pm >= custo && !(comPV && PAGA_PM_COM_PV.has(p.despertar.id))) {
    p.pmAtual = pm - custo;
    return { mensagem: `${nome}: −${custo} PM (${pm} → ${p.pmAtual})` };
  }
  if (!comPV) return { erro: `PM insuficiente: ${nome} custa ${custo} PM e você tem ${pm}.` };
  const c = custoEmPV(p, custo);
  if (!c) return { erro: `PV insuficientes: pagar ${nome} com PV deixaria você com 0 PV ou menos.` };
  p.pvAtual = pv - c.pv;
  if (c.hemomancia) return { mensagem: `Hemomancia: ${nome} custou ${c.pv} PV (${pv} → ${p.pvAtual}).` };
  p.pmAtual = pm - c.pm;
  const conds = condicoesAtivas(p);
  if (!conds.includes('Exausto')) p.condicoes = [...conds, 'Exausto'].join(', ');
  return { mensagem: `Exaustão de Mana: ${nome} custou ${c.pm} PM e ${c.pv} PV (PV ${pv} → ${p.pvAtual}). Você está Exausto.` };
}
